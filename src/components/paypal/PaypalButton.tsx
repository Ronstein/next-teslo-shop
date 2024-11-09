'use client';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { CreateOrderData, CreateOrderActions, OnApproveActions, OnApproveData } from "@paypal/paypal-js"
import { paypalCheckPayment, setTransactionId } from "@/actions";

interface Props {
    orderId: string;
    amount: number;
}

export const PaypalButton = ({ orderId, amount }: Props) => {
    const [{ isPending }] = usePayPalScriptReducer();
    const roundedAmount = Math.round(amount * 100) / 100;
    if (isPending) {
        return (
            <div className="animate-pulse mb-16">
                <div className="h-11 bg-gray-300 rounded" />
                <div className="h-11 bg-gray-300 rounded mt-2" />
            </div>
        )
    }

    const createOrder
        = async (data: CreateOrderData, actions: CreateOrderActions)
            : Promise<string> => {

            const transactionId = await actions.order.create({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        invoice_id: orderId,
                        amount: {
                            currency_code: 'USD',
                            value: `${roundedAmount}`,
                        }
                    }
                ]
            });

            console.log({ transactionId });
            // todo: guardar el id en la orden en la base de datos
            // setTransactionId
            const { ok } = await setTransactionId(orderId, transactionId);
            if (!ok) {
                throw new Error('Error al actualizar la orden');
            }

            return transactionId;
        }

    const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
        //console.log('onApprove');

        const details = await actions.order?.capture();
        if (!details) return;
        await paypalCheckPayment(details.id!);
    }

    return (
        <div className="relative z-0">
            <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </div>
    )
}
