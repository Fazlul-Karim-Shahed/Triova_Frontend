import MainHeader from "@/src/components/Client/MainHeader/MainHeader";
import Preload from "@/src/components/Common/Preload/Preload";
import ReduxProvider from "@/src/redux/ReduxProvider";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Montserrat } from "next/font/google";
import Footer from "../components/Client/Footer/Footer";
import "./globals.css";
import ClientErrorBoundary from "./ClientErrorBoundary";
import Head from "next/head";
import Script from "next/script";

const inter = Montserrat({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-montserrat" });

// SEO config using Next.js Metadata API
export const metadata = {
    metadataBase: new URL("https://triova.vercel.app/"),
    title: "Triova Limited - Shop Top Brands with Discounts",
    description: "Explore Triova Limited for trendy fashion, top accessories, and best offers in Bangladesh.",
    keywords: ["fashion", "ecommerce", "Bangladesh", "Triova", "clothing", "accessories", "Triova Limited", "palsbd", "pals fashion"],
    authors: [{ name: "Triova Limited", url: "https://triova.vercel.app/" }],
    creator: "Triova Limited",
    robots: "index, follow",
    icons: {
        icon: "/favicon.ico",
    },
    openGraph: {
        title: "Triova - Redefine the future fashion",
        description: "Discover exclusive deals on trusted brands with Triova. Shop now and save big!",
        url: "https://triova.vercel.app/",
        siteName: "Triova Limited",
        type: "website",
        images: [
            {
                url: "https://triova.vercel.app/_next/static/media/Logo.607e2600.svg",
                width: 384,
                height: 384,
                alt: "Triova Limited Logo",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Triova - Redefine the future fashion",
        description: "Discover exclusive deals on trusted brands with Triova. Shop now and save big!",
        images: ["https://triova.vercel.app/_next/static/media/Logo.607e2600.svg"],
    },

    facebook: {
        url: "https://triova.vercel.app/",
        type: "website",
        title: "Triova - Redefine the future fashion",
        description: "Discover exclusive deals on trusted brands with Triova. Shop now and save big!",
        images: ["https://triova.vercel.app/_next/static/media/Logo.607e2600.svg"],
    },

    verification: {
        google: "9gdYTAp_lZEZBpe-PrdVDA7WidwKCMiqyoqNg_DVE9Y",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <Head>
                <meta name="google-site-verification" content="9gdYTAp_lZEZBpe-PrdVDA7WidwKCMiqyoqNg_DVE9Y" />

                <Script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: "Triova Limited",
                            url: "https://triova.vercel.app",
                            logo: "https://triova.vercel.app/_next/static/media/Logo.607e2600.svg",
                        }),
                    }}
                />
            </Head>

            <body className={`${inter.className} bg-white`}>
                {/* Google Analytics */}
                {/* Google Analytics */}

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
