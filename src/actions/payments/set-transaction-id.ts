'use server';

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const setTransactionId
    = async (orderId: string, transactionId: string) => {
        const session = await auth();
        if (!session?.user) {
            return {
                ok: false,
                message: 'No hay sesión de usuario'
            }
        }

        //console.log('Paso', { orderId, transactionId });
        try {
            const order = await prisma.order.update({
                where: { id: orderId },
                data: { transactionId }
            });

            if (!order) {
                return {
                    ok: false,
                    message: `No se encontró una orden con el id: ${orderId} `,
                }
            }
            return {
                ok: true,
            };
        } catch (error) {
            console.log(error);
            return {
                ok: false,
                message: 'Error al actualizar la orden'
            }
        }
    }