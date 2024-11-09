export interface Product {
    id: string;
    description: string;
    images?: string[];
    inStock: number;
    price: number;
    sizes: ValidSize[];
    slug: string;
    tags: string[];
    title: string;
    //todo: type: ValidType;
    gender: ValidCategory
}

export interface CartProduct {
    id: string;
    slug: string;
    title: string;
    price: number;
    quantity: number;
    size: ValidSize;
    image: string
}

export interface ProductImage {
    id: number;
    url: string;
    productId: string;
}

export enum Gender {
    men = 'men',
    women = 'women',
    kid = 'kid',
    unisex = 'unisex'
}

export type ValidCategory = 'men' | 'women' | 'kid' | 'unisex'
export type ValidSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
export type ValidType = 'shirts' | 'pants' | 'hoodies' | 'hats';