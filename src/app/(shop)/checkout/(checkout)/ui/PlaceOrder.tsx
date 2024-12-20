'use client';

import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const PlaceOrder = () => {

    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const address = useAddressStore(state => state.address);
    const [errorMessage, setErrorMessage] = useState('');

    const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
        state.getSummaryInformation()
    );
    const clearCart = useCartStore(state => state.clearCart);

    const cart = useCartStore(state => state.cart);

    useEffect(() => {
        setLoaded(true);
    }, []);

    const onPlaceOrder = async () => {
        setIsPlacingOrder(true);
        //await sleep(3)
        const productsToOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size,
        }));
        //Todo: Server Action
        //console.log({ address, productsToOrder });
        const resp = await placeOrder(productsToOrder, address);
        //console.log({ resp });
        if (!resp.ok) {
            setIsPlacingOrder(false);
            setErrorMessage(resp.message!);
            return;
        }

        //todo: Todo salio Bien!
        clearCart();
        setIsPlacingOrder(false);
        router.replace('/orders/' + resp.order?.id);
    }

    if (!loaded) {
        return <p>Cargando...</p>
    }
    return (
        <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl font-bold mb-2">Dirección de Entrega</h2>
            <div className="mb-10">
                <p className="text-xl">{address.firstName} {address.lastName}</p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>
                    {address.city}, {address.country}
                </p>
                <p>{address.phone}</p>
            </div>

            {/* divider */}
            <div
                className="w-full h-0.5 rounded bg-gray-200 mb-10"
            />

            <h2 className="text-2xl mb-2 font-bold">Resumen de orden</h2>
            <div className="grid grid-cols-2">
                <span>No. Productos</span>
                <span className="text-right">
                    {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
                </span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>

                <span>Impuestos (15%)</span>
                <span className="text-right">{currencyFormat(tax)}</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>

            </div>
            <div className="mt-5 mb-2 w-full">
                <p className="mb-5">
                    {/* disclaimer */}
                    <span className="text-xs">
                        Al hacer clic en &quot;Colocar Orden&quot;, aceptas nuestros <a href="#" className="underline">Términos y Condiciones</a> y <a href="#" className="underline">Política de Privacidad</a>
                    </span>
                </p>
                <p className="text-red-500">{errorMessage}</p>
                <button
                    //href="/orders/123" 
                    onClick={onPlaceOrder}
                    className={
                        clsx("w-full", {
                            "btn-primary": !isPlacingOrder,
                            "btn-disabled": isPlacingOrder
                        })
                    }
                >
                    Colocar Orden
                </button>
            </div>
        </div>
    )
}
