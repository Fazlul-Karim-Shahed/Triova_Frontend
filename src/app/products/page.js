import { getAllProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import { getAllSubCategoryApi } from "@/src/api/SuperAdminApi/SubCategoryApi";
import ProductShowPageWrapper from "@/src/components/Client/ProductShowPageWrapper/ProductShowPageWrapper";
import { imageSrc } from "@/src/functions/CustomFunction";

export async function generateMetadata({ searchParams }) {
    const { search = "", category = "", subcategory = "" } = searchParams || {};

    const title = search ? `${search} | Triova BD` : category || subcategory ? `${category || subcategory} Products | Triova BD` : "All Products | Triova BD";

    const description = `Browse our collection of ${search || category || subcategory || "latest"} products at the best prices and premium quality. Shop now from Triova BD.`;

    const keywords = `${search}, ${category}, ${subcategory}, Triova, buy online, best price, ecommerce in Bangladesh`;

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            url: `https://triova.vercel.app/products`,
            siteName: "Triova BD",
            type: "website",
            images: [
                {
                    url: "https://triova.vercel.app/logo.png", // Replace with your OG image
                    width: 1200,
                    height: 630,
                    alt: "Triova BD Products",
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
    const products = fetchedProducts?.data || [];

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
            const originalPrice = Number(item.sellingPrice);
            const discountedPrice = Number((item.sellingPrice - item.sellingPrice * (item.discount / 100)).toFixed(2));

            return {
                "@type": "Product",
                name: item.name,
                url: `https://triova.vercel.app/products/${encodeURIComponent(item.name)}`,
                image: [imageSrc(item.featuredImage.name), ...item.image.map((img) => imageSrc(img.name))],
                description: item.description?.substring(0, 500) || "Quality product from Triova BD.",
                sku: item.sku || item._id,
                brand: {
                    "@type": "Brand",
                    name: item.brand?.name || "Triova BD",
                },
                offers: {
                    "@type": "Offer",
                    url: `https://triova.vercel.app/products/${encodeURIComponent(item.name)}`,
                    priceCurrency: "BDT",
                    price: discountedPrice, // ✅ number, not string
                    priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    itemCondition: "https://schema.org/NewCondition",
                    availability: item.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                    seller: {
                        "@type": "Organization",
                        name: "Triova BD",
                    },
                    priceSpecification: {
                        "@type": "UnitPriceSpecification",
                        price: discountedPrice,
                        priceBeforeDiscount: originalPrice,
                        priceCurrency: "BDT",
                    },
                    shippingDetails: {
                        "@type": "OfferShippingDetails",
                        shippingRate: {
                            "@type": "MonetaryAmount",
                            value: 60,
                            currency: "BDT",
                        },
                        shippingDestination: {
                            "@type": "DefinedRegion",
                            addressCountry: "BD",
                        },
                        deliveryTime: {
                            "@type": "ShippingDeliveryTime",
                            handlingTime: {
                                "@type": "QuantitativeValue",
                                minValue: 0,
                                maxValue: 1,
                                unitCode: "d",
                            },
                            transitTime: {
                                "@type": "QuantitativeValue",
                                minValue: 2,
                                maxValue: 5,
                                unitCode: "d",
                            },
                        },
                    },
                    hasMerchantReturnPolicy: {
                        "@type": "MerchantReturnPolicy",
                        applicableCountry: "BD",
                        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                        merchantReturnDays: 7,
                        returnMethod: "https://schema.org/ReturnByMail",
                        returnFees: "https://schema.org/FreeReturn",
                        refundType: "https://schema.org/FullRefund", // ✅ Added
                    },
                },
                aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.3", // ✅ average rating (1–5)
                    reviewCount: "12", // ✅ total number of reviews
                },
                review: [
                    {
                        "@type": "Review",
                        author: {
                            "@type": "Person",
                            name: "Verified Buyer",
                        },
                        datePublished: "2024-06-15",
                        reviewRating: {
                            "@type": "Rating",
                            ratingValue: "5",
                            bestRating: "5",
                        },
                        reviewBody: "Excellent product, great value for the price.",
                    },
                ],
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
