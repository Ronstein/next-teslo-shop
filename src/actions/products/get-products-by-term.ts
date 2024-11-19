'use server';

import prisma from "@/lib/prisma";

export const getProductsByTerm = async (term: string) => {
    if (term.trim().length === 0) return { products: undefined };

    try {
        const products = await prisma.product.findMany({
            take: 10,
            include: {
                ProductImage: {
                    take: 2,
                    select: {
                        url: true
                    },
                }
            },
            //! Por término
            where: {
                slug: { contains: term.toLowerCase() }
            }
        });

        return {
            products: products.map(product => ({
                ...product,
                images: product.ProductImage
                    .map(image => image.url)
            }))
        }

    } catch (error) {
        console.log(error);
        throw new Error("Error al obtener productos por termino");
    }

}