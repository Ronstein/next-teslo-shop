'use client';

import { useCartStore } from "@/store"
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { currencyFormat } from '../../../../../utils/currencyFormat';

export const ProductsInCart = () => {
    const [loaded, setLoaded] = useState(false);
    const productsInCart = useCartStore(state => state.cart);

    useEffect(() => {
        setLoaded(true);
    }, []);

    // useEffect(() => {
    //     if (loaded) {
    //         if (productsInCart.length === 0) redirect('/empty');
    //     }
    // }, [productsInCart])

    if (!loaded) {
        return <p>Loading...</p>;
    }

    return (
        <>
            {
                productsInCart.map(product => (
                    <div key={`${product.slug}-${product.size}}`} className="flex mb-5">
                        <Image
                            src={`/products/${product.image}`}
                            width={100}
                            height={100}
                            style={{ width: '100px', height: '100px' }}
                            alt=""
                            className="mr-5 rounded"
                        />
                        <div>
                            <span>
                                {product.size} - {product.title} ({product.quantity})
                            </span>
                            <p className="font-bold">{currencyFormat(product.price * product.quantity)}</p>

                        </div>
                    </div>
                ))
            }
        </>
    )
}
