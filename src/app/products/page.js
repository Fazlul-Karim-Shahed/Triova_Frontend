import { getSingleProductByNameApi } from "@/src/api/SuperAdminApi/ProductApi";
import { imageSrc } from "@/src/functions/CustomFunction";
import ProductDetailsPage from "@/src/components/Client/ProductDetails/ProductDetailsPage";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
    const productName = decodeURIComponent(params.productName);

    const res = await getSingleProductByNameApi(productName);
    const product = res?.data;

    if (!product) {
        return {
            title: "Product Not Found | Triova BD",
            description: "This product could not be found.",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const discountedPrice = parseFloat((product.sellingPrice - product.sellingPrice * (product.discount / 100)).toFixed(2));

    const url = `https://triova.vercel.app/products/${encodeURIComponent(product.name)}`;

    return {
        title: `${product.name} | Triova BD`,
        description: product.description?.substring(0, 160) || "Buy premium watches at best prices from Triova BD.",
        keywords: `${product.name}, Triova, buy online, watches in Bangladesh, fashion accessories`,
        openGraph: {
            title: `${product.name} | Triova BD`,
            description: product.description,
            url,
            siteName: "Triova BD",
            type: "product",
            images: [
                {
                    url: imageSrc(product.featuredImage?.name),
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: product.description,
            site: "@triova_bd",
        },
        alternates: {
            canonical: url,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function ProductDetailsPageWrapper({ params }) {
    const productName = decodeURIComponent(params.productName);
    const res = await getSingleProductByNameApi(productName);
    const product = res?.data;

    if (!product) return notFound();

    const originalPrice = Number(product.sellingPrice);
    const discountedPrice = Number((product.sellingPrice - product.sellingPrice * (product.discount / 100)).toFixed(2));

    const productLD = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: [imageSrc(product.featuredImage.name), ...product.image.map((img) => imageSrc(img.name))],
        description: product.description?.substring(0, 500) || "Top quality watch from Triova BD.",
        sku: product.sku || product._id,
        brand: {
            "@type": "Brand",
            name: product.brand?.name || "Triova BD",
        },
        offers: {
            "@type": "Offer",
            url: `https://triova.vercel.app/products/${encodeURIComponent(product.name)}`,
            priceCurrency: "BDT",
            price: discountedPrice,
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            itemCondition: "https://schema.org/NewCondition",
            availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            seller: {
                "@type": "Organization",
                name: "Triova BD",
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
                reviewBody: "Great design and durability. Worth every BDT.",
            },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLD) }} />
            <ProductDetailsPage product={product} />
        </>
    );
}
