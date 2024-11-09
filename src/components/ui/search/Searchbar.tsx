'use client';

export const Searchbar = () => {
    return (
        <div className="bg-gray-50 p-0.5 rounded-md shadow-md">
            {/* Customize the search input here */}
            <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full p-1 rounded-md focus:outline-none"
            />
        </div>
    )
}