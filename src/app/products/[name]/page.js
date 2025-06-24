import { getAllProductApi } from "@/src/api/SuperAdminApi/ProductApi";
import ProductDetailsForm from "@/src/components/Client/ProductDetails/ProductDetailsForm";
import ProductImageGallery from "@/src/components/Client/ProductImageGallery/ProductImageGallery";
import Script from "next/script";

export async function generateMetadata({ params }) {
    const name = decodeURIComponent(params.name);
    return {
        title: `${name} | Triova Limited`,
        description: `Buy ${name} at the best price. Explore features, reviews, and offers at Triova Limited.`,
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
            {/* ✅ SEO Structured Data */}
            <Script
                type="application/ld+json"
                id="product-jsonld"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        name: product.name,
                        image: [product.featuredImage, ...product.image],
                        description: product.shortDescription || "High-quality product from Triova Limited.",
                        sku: product.sku || product._id,
                        brand: {
                            "@type": "Brand",
                            name: product.brandId.name,
                        },
                        offers: {
                            "@type": "Offer",
                            url: `https://triova.vercel.app/products/${encodeURIComponent(product.name)}`,
                            priceCurrency: "BDT",
                            price: discountedPrice,
                            itemCondition: "https://schema.org/NewCondition",
                            availability: "https://schema.org/InStock",
                            seller: {
                                "@type": "Organization",
                                name: "Triova Limited",
                            },
                        },
                        aggregateRating: {
                            "@type": "AggregateRating",
                            ratingValue: "4.0",
                            reviewCount: "5",
                        },
                    }),
                }}
            />

            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
                    {/* Images (Client) */}
                    <div className="col-span-1 md:col-span-5 w-full h-full rounded-2xl">
                        <ProductImageGallery featuredImage={product.featuredImage} images={product.image} />
                    </div>

                    {/* Product Details */}
                    <div className="col-span-1 md:col-span-7 flex flex-col justify-center max-lg:max-w-[608px] max-lg:mx-auto">
                        <p className="font-medium text-indigo-600 mb-4">
                            {product.categoryId.name} / {product.subCategoryId.name}
                        </p>
                        <h2 className="mb-2 font-bold text-xl leading-10 text-gray-900">{product.name}</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                            <h6 className="leading-9 text-gray-900 pr-5 sm:border-r border-gray-200 mr-5">
                                <span className="font-bold">Tk {discountedPrice}</span>
                                {product.discount > 0 && <span className="text-xs line-through ml-2">Tk {product.sellingPrice}</span>}
                            </h6>
                            <div className="flex items-center gap-2">
                                {/* Rating */}
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
                                Get the {product.subCategoryId.name} and receive {product.discount}% off on your next purchase!
                            </p>
                        )}
                    </div>
                </div>

                {/* Collapse Sections */}
                <div className="mt-10">
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
            </div>
        </section>
    );
};

export default ProductDetailsPage;
