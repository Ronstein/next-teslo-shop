'use server';

import { auth } from "@/auth.config";
import type { Address, ValidSize } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: ValidSize;
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {
    const session = await auth();
    const userId = session?.user.id;

    //verificar sesión de usuario
    if (!userId) {
        return {
            ok: false,
            message: 'No hay sesión de usuario'
        }
    }

    //console.log({ productIds, address, userId });
    //Obtener la información de los productos
    //Nota: recuerden que podemos llevar 2+ productos con el mismo ID
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map(p => p.productId)
            }
        }
    });

    //console.log({ products });

    //Calcular el total de la orden // los montos
    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);
    //console.log({ itemsInOrder });
    //los totales de tax, subtotal, y total
    const { subTotal, tax, total } = productIds.reduce((totals, item) => {
        const productQuantity = item.quantity;
        const product = products.find(product => product.id === item.productId);
        if (!product) throw new Error(`Producto: ${item.productId} no existe. - 500`);
        const subTotal = product.price * productQuantity;
        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return totals;

    }, { subTotal: 0, tax: 0, total: 0 });

    //console.log({ subTotal, tax, total });
    //crear la transaccion de base de datos
    try {

        const prismaTx = await prisma.$transaction(async (tx) => {
            //1. Actualizar el stock de los productos
            const updatedProductsPromises = products
                .map((product) => {
                    const productQuantity = productIds
                        .filter(p => p.productId === product.id)
                        .reduce((acumulado, item) => item.quantity + acumulado, 0);
                    if (productQuantity === 0) {
                        throw new Error(`Producto: ${product.id} no tiene cantidad definida. - 500`);
                    }
                    return tx.product.update({
                        where: { id: product.id },
                        data: { inStock: { decrement: productQuantity } }
                    })
                });

            const updatedProducts = await Promise.all(updatedProductsPromises);
            //verificar valores negativos en la existencia = no hay stock
            updatedProducts.forEach(product => {
                if (product.inStock < 0) {
                    throw new Error(`Producto: ${product.title} no tiene stock suficiente. - 500`);
                }
            });


            //2. Crear la orden - Encabezado - Detalle
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,

                    OrderItem: {
                        createMany: {
                            data: productIds.map(p => ({
                                productId: p.productId,
                                quantity: p.quantity,
                                size: p.size,
                                price: products
                                    .find(product => product.id === p.productId)?.price ?? 0,
                            }))
                        }
                    }
                }
            });
            //Validar, si el la orden por el id tiene un price en cero, entonces lanzar un error

            //3. Crear la dirección de la orden
            const { country, ...restAddress } = address;
            //console.log('rest', restAddress);

            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: order.id,
                }
            })

            return {
                order: order,
                orderAddress: orderAddress,
                updatedProducts: updatedProducts,

            }
        });

        return {
            ok: true,
            order: prismaTx.order,
            prismaTx,
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                ok: false,
                message: error.message,
            }
        } else {
            return {
                ok: false,
                message: 'An unknown error occurred',
            }
        }
    }


}