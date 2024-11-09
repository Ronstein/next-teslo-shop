'use client'
import { QuantitySelector, SizeSelector } from "@/components"
import type { CartProduct, Product, ValidSize } from "@/interfaces"
import { useCartStore } from "@/store"
import { useState } from "react"

interface Props {
    product: Product
}

export const AddToCart = ({ product }: Props) => {
    //console.log(product.images?.length);

    const addProductToCart = useCartStore(state => state.addProductToCart);

    const [size, setSize] = useState<ValidSize | undefined>()
    const [quantity, setQuantity] = useState<number>(1);
    const [posted, setPosted] = useState(false);

    const addToCart = () => {
        setPosted(true);
        if (!size) return;
        //console.log({ size, quantity, product })
        // todo: add to Cart
        const cartProduct: CartProduct = {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            quantity: quantity,
            size: size,
            image: product.images![0]
        }
        addProductToCart(cartProduct);
        setPosted(false);
        setQuantity(1);
        setSize(undefined);
    }

    return (
        <>
            {
                posted && !size && (
                    <span className="mt-2 text-red-600">
                        Debe de Seleccionar una Talla
                    </span>
                )
            }
            {/* Selector de Tallas */}
            <SizeSelector
                selectedSize={size}
                availableSizes={product.sizes}
                onSizeChanged={setSize}
            />
            {/* Selector de Cantidad */}
            <QuantitySelector
                quantity={quantity}
                onQuantityChanged={setQuantity}
            />
            {/* Button */}
            <button className="btn-primary my-5"
                onClick={addToCart}
                disabled={product.images?.length === 0}
            >
                Agregar al carrito
            </button>
        </>
    )
}
