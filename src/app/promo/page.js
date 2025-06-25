// app/promos/page.jsx

import PromoCodeCard from "@/src/components/Client/PromoCodeCard/PromoCodeCard";

export const metadata = {
    title: "Latest Promo Codes | Triova",
    description: "Discover today's valid promo codes from Triova. Use them to save money on your favorite fashion and lifestyle products.",
    openGraph: {
        title: "Triova Promo Codes",
        description: "Check out today's promo codes available on Triova. Use them now before they expire!",
        url: "https://triova.vercel.app/promos",
        siteName: "Triova",
        images: [
            {
                url: "https://triova.vercel.app/Logo_Bg.png", // Replace with your actual OG image URL
                width: 1200,
                height: 630,
                alt: "Triova Promo",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Triova Promo Codes",
        description: "Don't miss today's Triova promo offers!",
        images: ["https://triova.vercel.app/Logo_Bg.png"],
    },
};

export default function PromoPage() {
    return <PromoCodeCard />;
}
