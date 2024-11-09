'use server';

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

interface PaginationOptions {
    page?: number;
    take?: number;
    //podria venir el user
}

export const getPaginatedUsers = async ({
    page = 1,
    take = 12,
}: PaginationOptions) => {

    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;
    if (isNaN(Number(take))) take = 12;
    if (take < 1) take = 12;

    try {
        const session = await auth();
        if (session?.user.role !== 'admin') {
            return {
                ok: false,
                message: 'You are not authorized to perform this action'
            }
        }
        const users = await prisma.user.findMany({
            take: take,
            skip: (page - 1) * take,
            orderBy: { name: 'desc' }
        });

        //2. Obtener el total de páginas
        //todo:
        const totalCount = await prisma.user.count();
        const totalPages = Math.ceil(totalCount / take);

        return {
            ok: true,
            users: users,
            totalPages: totalPages,
        }

    } catch (error) {
        console.log(error);
        throw new Error('Error al obtener los usuarios');
    }
}