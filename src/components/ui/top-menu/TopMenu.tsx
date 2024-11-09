'use client'
import { Searchbar } from "@/components"
import { titleFont } from "@/config/fonts"
import { useCartStore, useUIStore } from "@/store"
import Link from "next/link"
import { useEffect, useState } from "react"
import { IoCartOutline, IoSearchOutline } from "react-icons/io5"

export const TopMenu = () => {
    const openSideMenu = useUIStore(state => state.openSideMenu);
    const toggleSearchBar = useUIStore(state => state.toggleSearchBar);
    const isSearchBarOpen = useUIStore(state => state.isSearchBarOpen);
    const closeSearchBar = useUIStore(state => state.closeSearchBar);
    const totalItemsInCart = useCartStore(state => state.getTotalItems());
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
        closeSearchBar();
    }, [])


    return (
        <nav
            className="flex px-5 justify-between items-center w-full"
        >
            {/* Logo */}
            <div>
                <Link
                    href="/"
                >
                    <span className={`${titleFont.className}
                        antialiased font-bold
                    `}
                    >
                        Teslo
                    </span>
                    <span> | Shop</span>
                </Link>
            </div>
            {/* Center Menu */}
            <div className="hidden sm:block">
                <Link
                    className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
                    href="/gender/men"
                >
                    Hombres
                </Link>
                <Link
                    className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
                    href="/gender/women"
                >
                    Mujeres
                </Link>
                <Link
                    className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
                    href="/gender/kid"
                >
                    Niños
                </Link>
            </div>

            {/* Search,Cart,Menu */}
            <div className="flex items-center">
                {/* <Link href="/search" className="mx-2">
                    <IoSearchOutline className="w-5 h-5" />
                </Link> */}
                <div className="relative">
                    <div
                        className={`transition-all duration-300 ${isSearchBarOpen ? "opacity-100" : "opacity-0"} pointer-events-${isSearchBarOpen ? "auto" : "none"} w-64`}>
                        <Searchbar />
                    </div>
                </div>
                <button
                    onClick={() => toggleSearchBar()}
                    className="mx-2">
                    <IoSearchOutline className="w-5 h-5" />
                </button>
                <Link href={
                    ((totalItemsInCart === 0) && loaded)
                        ? '/empty'
                        : '/cart'
                } className="mx-2">
                    <div className="relative">
                        {
                            (loaded && totalItemsInCart > 0) && (
                                <span className="fade-in absolute text-xs px-1 rounded-full  font-bold -top-2 -right-2 bg-blue-700 text-white">
                                    {totalItemsInCart}
                                </span>
                            )
                        }
                        <IoCartOutline className="w-5 h-5" />
                    </div>
                </Link>
                <button
                    className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
                    onClick={() => openSideMenu()}
                >
                    Menú
                </button>
            </div>

        </nav>
    )
}
