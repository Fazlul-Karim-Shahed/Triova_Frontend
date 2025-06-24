import Link from "next/link";
import ClientSlider from "../components/Common/Slider/ClientSlider";
import HeroSlider from "../components/Common/Slider/HeroSlider";
import Slider from "../components/Common/Slider/Slider";
import { getAllProductApi } from "../api/SuperAdminApi/ProductApi";
import EventPopup from "../components/Client/EventPopup/Eventpopup";
import { imageSrc } from "../functions/CustomFunction";
import Script from "next/script";

export default async function Home() {
    const productRes = await getAllProductApi(10);
    const products = productRes?.data || [];

    // Generate JSON-LD ItemList for SEO (server-side rendered)

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

            <main className="p-4 md:p-6">
                {/* Grid Banners */}
                <div className="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 md:auto-rows-fr">
                    <div className="col-span-2 md:col-span-4 lg:col-span-4 row-span-1 md:row-span-2 bg-white text-white flex justify-center items-center rounded-lg relative overflow-hidden">
                        <img src="/banner.png" alt="Promo GIF" className="w-full h-full object-cover" />
                    </div>
                    <div className="col-span-2 lg:col-span-2 md:row-span-2 rounded-lg">
                        <HeroSlider />
                    </div>
                    <div className="col-span-2 md:col-span-4 lg:col-span-6 row-span-1 bg-gradient-to-r from-[#FA1768] to-[#e51111] text-black flex flex-col justify-center items-center p-4 md:p-6 rounded-lg relative text-center">
                        <h2 className="text-xl md:text-2xl font-bold text-white">Shop with Triova to get up to 50% discount</h2>
                        <p className="mt-2 text-lg font-bold">Every day & more</p>
                        <Link href="/products" className="mt-4 bg-black text-white py-2 px-4 rounded-lg text-sm md:text-base">
                            Explore Triova
                        </Link>
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="mt-14 mb-5">
                    <div className="md:text-3xl text-center mb-10 text-2xl font-extrabold">Top Selling Products</div>

                    <Slider products={products} />
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
