import { getCategories, getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";

interface Props {
    params: {
        slug: string;
    };
}

export default async function AdminProductPage({ params }: Props) {
    const { slug } = params;

    //hacer en paralelo los await 
    const [product, categories] = await Promise.all([
        getProductBySlug(slug),
        getCategories()
    ]);

    // const product = await getProductBySlug(slug);
    // //get-categories.ts
    // const categories = await getCategories();
    //Todo: New
    if (!product && slug !== 'new') {
        redirect('/admin/products');
    }


    const title = (slug === 'new') ? 'Nuevo producto' : 'Editar producto';
    return (
        <>
            <Title title={title} />
            <ProductForm product={product ?? {}} categories={categories} />
        </>
    );
}