export const revalidate = 60;  //60 segundos

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";


interface Props {
    params: {
        search: string;
    };
    searchParams: {
        page?: string;
    };
}

export default async function SearchByPage({ params, searchParams }: Props) {
    const { search } = params;
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    //const products = seedProducts.filter((product) => product.gender === id);

    const { products, currentPage, totalPages } = await getPaginatedProductsWithImages(
        {
            page,
            term: search,
        }
    );
    if (products.length === 0) {
        redirect(`search/${search}`);
    }

    //const genero = id === 'men' ? 'Hombre' : id === 'women' ? 'Mujer' : 'Niño'
    // if (id === 'kids') {
    //     notFound();
    // }

    return (
        <div>
            <Title
                title={`Articulos que contengan: ${search}`}
                subtitle={`Encuentra los mejores productos`}
                className="mb-2"
            />
            <ProductGrid products={products} />
            <Pagination totalPages={totalPages} />
        </div>
    );
}