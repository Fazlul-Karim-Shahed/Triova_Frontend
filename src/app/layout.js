import MainHeader from "@/src/components/Client/MainHeader/MainHeader";
import Preload from "@/src/components/Common/Preload/Preload";
import ReduxProvider from "@/src/redux/ReduxProvider";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Montserrat } from "next/font/google";
import Footer from "../components/Client/Footer/Footer";
import "./globals.css";
import ClientErrorBoundary from "./xxxClientErrorBoundaryxxx";
import Head from "next/head";
import Script from "next/script";

const inter = Montserrat({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-montserrat" });

// SEO config using Next.js Metadata API
export const metadata = {
    metadataBase: new URL("https://triova.vercel.app/"),
    title: "Triova BD - Shop Top Brands with Discounts",
    description: "Explore Triova BD for trendy fashion, top accessories, and best offers in Bangladesh.",
    keywords: ["fashion", "ecommerce", "Bangladesh", "Triova", "clothing", "accessories", "Triova BD", "palsbd", "pals fashion"],
    authors: [{ name: "Triova BD", url: "https://triova.vercel.app/" }],
    creator: "Triova BD",
    robots: "index, follow",
    icons: {
        icon: "/favicon.ico",
    },
    openGraph: {
        title: "Triova - Redefine the future fashion",
        description: "Discover exclusive deals on trusted brands with Triova. Shop now and save big!",
        url: "https://triova.vercel.app/",
        siteName: "Triova BD",
        type: "website",
        images: [
            {
                url: "https://triova.vercel.app/Logo_Bg.png",
                width: 384,
                height: 384,
                alt: "Triova BD Logo",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Triova - Redefine the future fashion",
        description: "Discover exclusive deals on trusted brands with Triova. Shop now and save big!",
        images: ["https://triova.vercel.app/Logo_Bg.png"],
    },

    facebook: {
        url: "https://triova.vercel.app/",
        type: "website",
        title: "Triova - Redefine the future fashion",
        description: "Discover exclusive deals on trusted brands with Triova. Shop now and save big!",
        images: ["https://triova.vercel.app/Logo_Bg.png"],
    },

    other: {
        "google-site-verification": "heuWYnGOKgUq813UakBvI-oh5dJLszSPv_0DIz77niM", // 👈 Add this
    },

    verification: {
        google: "heuWYnGOKgUq813UakBvI-oh5dJLszSPv_0DIz77niM",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <Head>
                <meta name="google-site-verification" content="heuWYnGOKgUq813UakBvI-oh5dJLszSPv_0DIz77niM" />

                <Script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: "Triova BD",
                            url: "https://triova.vercel.app",
                            logo: "https://triova.vercel.app/Logo_Bg.png",
                        }),
                    }}
                />
            </Head>

            <body className={`${inter.className} bg-white`}>
                <ReduxProvider>
                    <ClientErrorBoundary>
                        <Preload />
                        <MainHeader />
                        {children}
                        <Footer />
                    </ClientErrorBoundary>
                </ReduxProvider>
            </body>
        </html>
    );
}