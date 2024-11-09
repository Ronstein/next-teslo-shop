'use server';

import type { Address } from "@/interfaces";
import prisma from "@/lib/prisma";

export const setUserAddress = async (address: Address, userId: string) => {
    try {
        const newAddress = await createOrReplaceAddress(address, userId);
        return {
            ok: true,
            address: newAddress,
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo grabar la dirección del usuario'
        }
    }
}

const createOrReplaceAddress = async (address: Address, userId: string) => {
    try {
        //console.log({ userId });

        const storedAddress = await prisma.userAddress.findUnique({
            where: {
                userId: userId
            }
        });

        const addressToSave = {
            userId: userId,
            address: address.address,
            address2: address.address2,
            countryId: address.country,
            firstName: address.firstName,
            lastName: address.lastName,
            phone: address.phone,
            postalCode: address.postalCode,
            city: address.city,
        };

        if (!storedAddress) {
            const newAddress = await prisma.userAddress.create({
                data: addressToSave,
            });
            const { userId, ...rest } = newAddress;
            return { ...rest };
        }

        const updatedAddress = await prisma.userAddress.update({
            where: {
                userId: userId
            },
            data: addressToSave,
        });

        const { userId: _, ...rest } = updatedAddress;
        return { ...rest };

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo grabar la dirección del usuario'
        }
    }
}