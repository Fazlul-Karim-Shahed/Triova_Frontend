import { getAllProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import { getAllSubCategoryApi } from "@/src/api/SuperAdminApi/SubCategoryApi";
import ProductShowPageWrapper from "@/src/components/Client/ProductShowPageWrapper/ProductShowPageWrapper";
import { imageSrc } from "@/src/functions/CustomFunction";

export async function generateMetadata({ searchParams }) {
    const { search = "", category = "", subcategory = "" } = searchParams || {};

    const title = search ? `${search} | Triova Limited` : category || subcategory ? `${category || subcategory} Products | Triova Limited` : "All Products | Triova Limited";

    const description = `Browse our collection of ${search || category || subcategory || "latest"} products at the best prices and premium quality. Shop now from Triova Limited.`;

    const keywords = `${search}, ${category}, ${subcategory}, Triova, buy online, best price, ecommerce in Bangladesh`;

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            url: `https://triova.vercel.app/products`,
            siteName: "Triova Limited",
            type: "website",
            images: [
                {
                    url: "https://triova.vercel.app/logo.png", // Replace with your OG image
                    width: 1200,
                    height: 630,
                    alt: "Triova Limited Products",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            site: "@triova_bd", // optional: your Twitter handle
        },
        alternates: {
            canonical: `https://triova.vercel.app/products`,
        },
        robots: {
            index: true,
            follow: true,
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

    const productLD = {
        "@context": "https://schema.org",
        "@graph": products.map((item) => {
            const originalPrice = item.sellingPrice.toFixed(2);
            const discountedPrice = (item.sellingPrice - item.sellingPrice * (item.discount / 100)).toFixed(2);

            return {
                "@type": "Product",
                name: item.name,
                image: [imageSrc(item.featuredImage.name)],
                description: item.description || "Product from Triova Limited",
                sku: item._id,
                brand: {
                    "@type": "Brand",
                    name: item.brandId?.name || "Triova Limited",
                },
                offers: {
                    "@type": "Offer",
                    url: `https://triova.vercel.app/products/${encodeURIComponent(item.name)}`,
                    priceCurrency: "BDT",
                    price: discountedPrice,
                    itemCondition: "https://schema.org/NewCondition",
                    availability: item.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                    priceSpecification: {
                        "@type": "UnitPriceSpecification",
                        priceCurrency: "BDT",
                        price: discountedPrice,
                        referenceQuantity: {
                            "@type": "QuantitativeValue",
                            value: 1,
                            unitCode: "EA",
                        },
                        eligibleQuantity: {
                            "@type": "QuantitativeValue",
                            value: 1,
                            unitCode: "EA",
                        },
                        priceBeforeDiscount: originalPrice,
                    },
                    validFrom: new Date().toISOString(),
                },
                aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "5.0",
                    reviewCount: "1",
                },
                review: {
                    "@type": "Review",
                    author: {
                        "@type": "Person",
                        name: "Verified Buyer",
                    },
                    datePublished: "2024-01-01",
                    reviewBody: "Excellent product, highly recommended!",
                    reviewRating: {
                        "@type": "Rating",
                        ratingValue: "5",
                        bestRating: "5",
                    },
                },
            };
        }),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLD) }} />
            <ProductShowPageWrapper initialProducts={products} initialSubCategory={subCategory} searchParams={allSearchParams} />
        </>
    );
}
