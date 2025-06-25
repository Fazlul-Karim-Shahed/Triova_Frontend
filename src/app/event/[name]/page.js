import EventPage from "@/src/components/Client/Event/EventPage";

export const generateMetadata = ({ params }) => {
    const eventName = decodeURIComponent(params.name);
    return {
        title: `${eventName} | Triova Special Event`,
        description: `Discover exclusive deals and fashion picks in the "${eventName}" event by Triova.`,
        openGraph: {
            title: `${eventName} | Triova`,
            description: `Explore the "${eventName}" collection with exclusive offers. Only on Triova.`,
            url: `https://triova.vercel.app/event/${eventName}`,
            siteName: "Triova",
            images: [
                {
                    url: "https://triova.vercel.app/Logo_Bg.png", // static fallback OG image
                    width: 1200,
                    height: 630,
                    alt: `${eventName} - Triova Event`,
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${eventName} | Triova Event`,
            description: `Explore the "${eventName}" event only on Triova.`,
            images: ["https://triova.vercel.app/Logo_Bg.png"],
        },
    };
};

export default function Page({ params }) {
    return <EventPage params={params} />;
}
