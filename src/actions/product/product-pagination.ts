'use server'

import prisma from "@/lib/prisma"
import { Gender } from '@prisma/client';

interface PaginationOptions {
    page?: number;
    take?: number;
    gender?: Gender;
    term?: string;
}

export const getPaginatedProductsWithImages = async ({
    page = 1,
    take = 12,
    gender,
    term,
}: PaginationOptions) => {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;
    if (isNaN(Number(take))) take = 12;
    if (take < 1) take = 12;
    try {
        //1. Obtener los productos
        const products = await prisma.product.findMany({
            take: take,
            skip: (page - 1) * take,
            include: {
                ProductImage: {
                    take: 2,
                    select: {
                        url: true
                    },
                }
            },
            //! Por género
            where: {
                gender: gender,
                slug: { contains: term }
            }
        });

        //2. Obtener el total de páginas
        //todo:
        const totalCount = await prisma.product.count({
            where: {
                gender: gender,
                slug: { contains: term }
            }
        });
        const totalPages = Math.ceil(totalCount / take);

        //console.log(products);
        return {
            currentPage: page,
            totalPages: totalPages,
            products: products.map(product => ({
                ...product,
                images: product.ProductImage
                    .map(image => image.url)
            }))
        }

    } catch (error) {
        throw new Error('Error al obtener los productos');
    }
}