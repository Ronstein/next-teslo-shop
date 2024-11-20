'use client';

import { getProductsByTerm } from "@/actions";
import { Product } from "@/interfaces";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";

export const Searchbar = () => {

    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState<string>("");
    const debounceRef = useRef<NodeJS.Timeout>();
    const onQueryChanged = (event: ChangeEvent<HTMLInputElement>) => {

        const value = event.target.value;
        setQuery(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            //todo buscar o ejecutar consulta
            setProducts([]);
            //console.log('debounced value: ', event.target.value);
            const { products } = await getProductsByTerm(value);
            //console.log(products);
            if (products) {
                setProducts(products);
            }
        }, 400);
    }

    const clearSearch = () => {
        setQuery("");
        setProducts([]); // Limpia los resultados
    };

    const onClickSearch = () => {
        router.replace(`/search/${query}`)
        clearSearch();
    }

    return (
        <>
            <div className="bg-gray-50 p-0.5 rounded-md shadow-md">
                {/* Customize the search input here */}
                <input
                    type="text"
                    value={query}
                    placeholder="Buscar productos..."
                    className="w-full p-1 rounded-md focus:outline-none"
                    onChange={onQueryChanged}
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        &#x2715; {/* Icono "X" */}
                    </button>
                )}

                {/* Contenedor de resultados */}
                {
                    products.length > 0 && (
                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.slug}`}
                                    onClick={clearSearch}
                                >
                                    <p

                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {product.title}
                                    </p>
                                </Link>
                            ))}

                            <p className="p-2 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                onClick={onClickSearch}
                            >
                                Buscar Más Resultados con:  <span className="font-bold">{query}</span>
                            </p>
                        </div>
                    )
                }
            </div>
        </>

    )
}