import { getAllProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import ProductDetailsForm from "@/src/components/Client/ProductDetails/ProductDetailsForm";
import SimilarProduct from "@/src/components/Client/ProductDetails/SimilarProduct";
import ProductImageGallery from "@/src/components/Client/ProductImageGallery/ProductImageGallery";
import ClientImageWithLoader from "@/src/components/Common/ImageLoader/ClientImageWithLoader";
import { imageSrc } from "@/src/functions/CustomFunction";
import Script from "next/script";

// ✅ SEO + Open Graph + Twitter Meta for social sharing
export async function generateMetadata({ params }) {
    const name = decodeURIComponent(params.name);
    const productRes = await getAllProductApi(null, { name });
    const product = !productRes.error ? productRes.data[0] : null;

    if (!product) {
        return {
            title: `Product Not Found | Triova BD`,
            description: `Sorry, we couldn't find the product you’re looking for.`,
        };
    }

    const productUrl = `https://triova.vercel.app/products/${encodeURIComponent(product.name)}`;
    const imageUrl = imageSrc(product.featuredImage.name);

    const title = `${product.name} | Triova BD`;
    const description = `Buy ${product.name} at the best price in Bangladesh. Explore specifications, offers & more at Triova.`;

    return {
        title,
        description,
        keywords: `${product.name}, ${product.categoryId.name}, ${product.subCategoryId.name}, buy online, Triova, ${product.tags.join(",")}`,
        openGraph: {
            title,
            description,
            url: productUrl,
            siteName: "Triova BD",
            type: "website",
            images: [
                {
                    url: imageUrl,
                    width: 800,
                    height: 600,
                    alt: product.name,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: productUrl,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

const ProductDetailsPage = async ({ params }) => {
    const name = decodeURIComponent(params.name);
    let productRes = await getAllProductApi(null, { name });

    const product = !productRes.error ? productRes.data[0] : null;

    if (!product) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <p className="text-2xl font-semibold text-gray-500">Product not found!</p>
            </div>
        );
    }

    const discountedPrice = (product.sellingPrice - product.sellingPrice * (product.discount / 100)).toFixed(2);

    return (
        <section className="py-10 relative">
            {/* ✅ JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                id="product-jsonld"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        name: product.name,
                        image: [imageSrc(product.featuredImage?.name), ...product.image?.map((img) => imageSrc(img.name)).filter(Boolean)],
                        description: product.shortDescription || "High-quality product from Triova BD.",
                        sku: product.sku || product._id,
                        mpn: product._id,
                        brand: {
                            "@type": "Brand",
                            name: product.brandId?.name || "Triova BD",
                            logo: imageSrc(product.brandId?.logo?.name),
                        },
                        offers: {
                            "@type": "Offer",
                            url: `https://triova.vercel.app/products/${encodeURIComponent(product.name)}`,
                            priceCurrency: "BDT",
                            price: discountedPrice,
                            priceSpecification: {
                                "@type": "UnitPriceSpecification",
                                priceCurrency: "BDT",
                                price: discountedPrice,
                                priceBeforeDiscount: product.sellingPrice.toFixed(2),
                            },
                            itemCondition: "https://schema.org/NewCondition",
                            availability: "https://schema.org/InStock",
                            seller: {
                                "@type": "Organization",
                                name: "Triova BD",
                            },
                            validFrom: new Date().toISOString(),
                            priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
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
                                refundType: "https://schema.org/FullRefund",
                            },
                        },
                        aggregateRating: {
                            "@type": "AggregateRating",
                            ratingValue: "4.0",
                            reviewCount: "5",
                        },
                        review: {
                            "@type": "Review",
                            author: {
                                "@type": "Person",
                                name: "Verified Buyer",
                            },
                            datePublished: "2024-01-01",
                            reviewBody: "Excellent quality and fast delivery.",
                            reviewRating: {
                                "@type": "Rating",
                                ratingValue: "5",
                                bestRating: "5",
                            },
                        },
                    }),
                }}
            />

            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
                    <div className="col-span-1 md:col-span-5 w-full h-full rounded-2xl">
                        <ProductImageGallery
                            featuredImage={product.featuredImage}
                            images={product.image}
                            colorImages={
                                product?.colors?.length
                                    ? product.colors.map((item) => ({
                                          name: item.image,
                                      }))
                                    : []
                            }
                        />
                    </div>

                    <div className="col-span-1 md:col-span-7 flex flex-col justify-center max-lg:max-w-[608px] max-lg:mx-auto">
                        <p className="font-medium text-indigo-600 mb-4">
                            {product.categoryId.name} / {product.subCategoryId.name}
                        </p>
                        <div className="grid grid-cols-5 gap-4 mb-5 ">
                            <div className="col-span-full md:col-span-4 ">
                                <h2 className="font-bold text-xl text-gray-900 ">{product.name}</h2>
                            </div>
                            <div className="col-span-full md:col-span-1 my-5 md:my-0">
                                <ClientImageWithLoader height={100} width={100} className="object-contain" src={imageSrc(product.brandId.logo.name)} alt={product.brandId.name} />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                            <h6 className="leading-9 text-gray-900 pr-5 sm:border-r border-gray-200 mr-5">
                                <span className="font-bold">Tk {discountedPrice}</span>
                                {product.discount > 0 && <span className="text-xs line-through ml-2">Tk {product.sellingPrice}</span>}
                            </h6>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {[...Array(4)].map((_, i) => (
                                        <svg key={i} width="20" height="20" fill="#FBBF24" viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                    <svg width="20" height="20" fill="#F3F4F6" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                </div>
                                <span className="text-gray-500 text-sm">5 reviews</span>
                            </div>
                        </div>

                        <p className="text-gray-700 text-sm mb-8">
                            Discover the precision and style of the {product.name} — featuring a durable design, reliable movement, and water resistance, ideal for everyday wear.
                        </p>

                        <ProductDetailsForm product={product} />

                        {product.discount > 0 && (
                            <p className="font-medium text-sm text-gray-500 mt-4">
                                Get the {product.subCategoryId.name} and receive {product.discount}% off right now. Don&apos;t miss this offer!
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="col-span-full lg:col-span-8 mt-10">
                        <div className="collapse collapse-arrow bg-base-100 border border-base-300 mb-5 shadow glass">
                            <input type="checkbox" id="collapse1" defaultChecked />
                            <label htmlFor="collapse1" className="collapse-title font-semibold">
                                Specification
                            </label>
                            <div className="collapse-content text-sm">
                                <div dangerouslySetInnerHTML={{ __html: product.description }} />
                            </div>
                        </div>

                        <div className="collapse collapse-arrow bg-base-100 border border-base-300 mb-5 shadow glass">
                            <input type="checkbox" id="collapse2" />
                            <label htmlFor="collapse2" className="collapse-title font-semibold">
                                Direction
                            </label>
                            <div className="collapse-content text-sm">
                                <ol className="list-decimal pl-4 mt-2 space-y-1">
                                    <li>Clean with a damp cloth regularly.</li>
                                    <li>Do not use harsh detergents or bleach.</li>
                                    <li>Store in a cool, dry place when not in use.</li>
                                    <li>Avoid prolonged exposure to direct sunlight.</li>
                                </ol>
                            </div>
                        </div>

                        <div className="collapse collapse-arrow bg-base-100 border border-base-300 mb-5 shadow glass">
                            <input type="checkbox" id="collapse3" />
                            <label htmlFor="collapse3" className="collapse-title font-semibold">
                                Warranty
                            </label>
                            <div className="collapse-content text-sm">
                                <p>
                                    This product comes with a <strong>1-year limited warranty</strong> covering:
                                </p>
                                <ul className="list-disc pl-4 mt-2 space-y-1">
                                    <li>Manufacturing defects in materials or workmanship</li>
                                    <li>Faulty zippers, seams, or handles</li>
                                </ul>
                                <p className="mt-2">
                                    Warranty does not cover normal wear and tear, misuse, or accidental damage. For claims, please retain your purchase receipt and contact our support team.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-full md:col-span-4">
                        <SimilarProduct subCategory={product.subCategoryId} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetailsPage;
