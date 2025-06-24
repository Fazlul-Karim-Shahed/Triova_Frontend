// app/products/page.jsx

import { getAllProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import { getAllSubCategoryApi } from "@/src/api/SuperAdminApi/SubCategoryApi";
import ProductShowPageWrapper from "@/src/components/Client/ProductShowPageWrapper/ProductShowPageWrapper";
import { imageSrc } from "@/src/functions/CustomFunction";
import { Metadata } from "next";
import Script from "next/script";

export async function generateMetadata({ searchParams }) {
    const { search = "", category = "", subcategory = "" } = searchParams || {};

    const title = search ? `${search} | Triova Limited` : category || subcategory ? `${category || subcategory} Products | Triova Limited` : "All Products | Triova Limited";

    const description = `Browse our collection of ${search || category || subcategory || "latest"} products with best price and quality. Shop now from Triova Limited.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://triova.vercel.app/products`,
            siteName: "Triova Limited",
            type: "website",
        },
    };
}

export default async function ProductPage({ searchParams }) {
    const allSearchParams = {
        search: searchParams?.search || "",
        subcategory: searchParams?.subcategory || "",
        brand: searchParams?.brand || "",
        subbrand: searchParams?.subbrand || "",
        category: searchParams?.category || "",
        min: searchParams?.min || "",
        max: searchParams?.max || "",
        size: searchParams?.size || "",
        color: searchParams?.color || "",
    };

    const fetchedProducts = await getAllProductApi(null, allSearchParams);
    const products = fetchedProducts?.data?.filter((p) => p.stock > 0) || [];

    let subCategory = null;
    if (allSearchParams.subcategory !== "") {
        const fetchedSubCategory = await getAllSubCategoryApi({ name: allSearchParams.subcategory });
        if (!fetchedSubCategory.error && fetchedSubCategory.data.length > 0) {
            subCategory = fetchedSubCategory.data[0].categoryId._id;
        }
    }

    const productLD = products.map((item) => ({
        "@context": "https://schema.org",
        "@type": "Product",
        name: item.name,
        image: imageSrc(item.featuredImage.name),
        description: item.description || "Product from Triova Limited",
        brand: {
            "@type": "Brand",
            name: item.brand || "Triova Limited",
        },
        offers: {
            "@type": "Offer",
            priceCurrency: "BDT",
            price: (item.sellingPrice - item.sellingPrice * (item.discount / 100)).toFixed(2),
            availability: item.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
    }));

    return (
        <>
            <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLD) }} />
            <ProductShowPageWrapper initialProducts={products} initialSubCategory={subCategory} searchParams={allSearchParams} />
        </>
    );
}
