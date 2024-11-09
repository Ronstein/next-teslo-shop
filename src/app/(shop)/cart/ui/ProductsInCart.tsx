'use client';

import { ProductImage, QuantitySelector } from "@/components";
import { useCartStore } from "@/store"
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {
    const [loaded, setLoaded] = useState(false);
    const productsInCart = useCartStore(state => state.cart);
    const updateProductQuantity = useCartStore(state => state.updateProductQuantity);
    const removeProduct = useCartStore(state => state.removeProduct);

    useEffect(() => {
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (loaded) {
            if (productsInCart.length === 0) redirect('/empty');
        }
    }, [productsInCart])


    if (!loaded) {
        return <p>Loading...</p>;
    }

    return (
        <>
            {
                productsInCart.map(product => (
                    <div key={`${product.slug}-${product.size}}`} className="flex mb-5">
                        <ProductImage
                            src={product.image}
                            width={100}
                            height={100}
                            style={{ width: '100px', height: '100px' }}
                            alt=""
                            className="mr-5 rounded"
                        />
                        <div>
                            <Link href={`/product/${product.slug}`}
                                className="hover:underline cursor-pointer"
                            >
                                {product.size} - {product.title}
                            </Link>
                            <p>${product.price}</p>
                            <QuantitySelector
                                quantity={product.quantity}
                                onQuantityChanged={quantity => updateProductQuantity(product, quantity)}
                            />
                            <button
                                onClick={() => removeProduct(product)}
                                className="underline mt-3"
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
