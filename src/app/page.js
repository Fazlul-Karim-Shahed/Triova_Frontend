import Link from "next/link";
import ClientSlider from "../components/Common/Slider/ClientSlider";
import HeroSlider from "../components/Common/Slider/HeroSlider";
import Slider from "../components/Common/Slider/Slider";
import { getAllProductApi } from "../api/SuperAdminApi/ProductApi";
import EventPopup from "../components/Client/EventPopup/Eventpopup";
import { imageSrc } from "../functions/CustomFunction";
import ClientImageWithLoader from "../components/Common/ImageLoader/ClientImageWithLoader";
import Head from "next/head";

export default async function Home() {
    const productRes = await getAllProductApi(10);
    const products = !productRes.error ? productRes.data : [];

    // Generate JSON-LD ItemList for SEO (server-side rendered)

    const productLD = {
        "@context": "https://schema.org",
        "@graph": products.map((item) => {
            const originalPrice = Number(item.sellingPrice);
            const discountedPrice = Number((item.sellingPrice - item.sellingPrice * (item.discount / 100)).toFixed(2));

            return {
                "@type": "Product",
                name: item.name,
                image: imageSrc(item.featuredImage.name),
                description: item.description?.substring(0, 500) || "Buy high-quality products from Triova Limited.",
                sku: item.sku || item._id,
                brand: {
                    "@type": "Brand",
                    name: item.brand?.name || "Triova Limited",
                },
                offers: {
                    "@type": "Offer",
                    url: `https://triova.vercel.app/products/${encodeURIComponent(item.name)}`,
                    priceCurrency: "BDT",
                    price: discountedPrice.toFixed(2),
                    priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    itemCondition: "https://schema.org/NewCondition",
                    availability: item.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                    seller: {
                        "@type": "Organization",
                        name: "Triova Limited",
                    },
                    priceSpecification: {
                        "@type": "UnitPriceSpecification",
                        price: discountedPrice.toFixed(2),
                        priceBeforeDiscount: originalPrice.toFixed(2),
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
                        refundType: "https://schema.org/FullRefund",
                    },
                },
                aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.3",
                    reviewCount: "12",
                },
                review: [
                    {
                        "@type": "Review",
                        author: { "@type": "Person", name: "Verified Buyer" },
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
            import Head from "next/head"; // Inside your component return:
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLD) }} />
            <main className="p-4 md:p-6">
                {/* Grid Banners */}
                <div className="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 md:auto-rows-fr">
                    <div className="col-span-2 md:col-span-4 lg:col-span-4 row-span-1 md:row-span-2 bg-white text-white flex justify-center items-center rounded-lg relative overflow-hidden">
                        <ClientImageWithLoader src="/banner.svg" alt="Promo GIF" className="w-full h-full object-cover" />
                    </div>
                    <div className="col-span-2 lg:col-span-2 md:row-span-2 rounded-lg">
                        <HeroSlider />
                    </div>
                    <div className="col-span-2 md:col-span-4 lg:col-span-6 row-span-1 bg-gradient-to-r from-brand-600 to-brand-800 text-brand-50 flex flex-col justify-center items-center p-4 md:p-6 rounded-lg relative text-center">
                        <h2 className="text md:text-2xl font-bold text-white">Shop with Triova to get up to 50% discount</h2>
                        <p className="mt-2 text-sm md:text-lg font-bold">Every day & more</p>
                        <Link
                            href="/products"
                            className="mt-4 font-semibold bg-brand-100 hover:bg-brand-200 transition-all duration-200 text-brand-900 py-1 md:py-2 px-2 md:px-4 rounded-lg text-xs md:text-base"
                        >
                            Explore Triova
                        </Link>
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="mt-14 mb-5">
                    <div className="md:text-3xl text-center mb-10 text-2xl font-extrabold">Top Selling Products</div>

                    <Slider />
                    <div className="text-center pt-5">
                        <Link href="/products" className="btn md:btn-md btn-sm btn-outline">
                            Show more
                        </Link>
                    </div>
                </div>

                {/* Trusted Brands */}
                <div className="mt-14 mb-5">
                    <div className="md:text-3xl text-center mb-10 text-2xl font-extrabold">Your Trusted Brands</div>
                    <ClientSlider />
                </div>

                <EventPopup />
            </main>
        </>
    );
}
