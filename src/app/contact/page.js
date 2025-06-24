import ContactForm from "@/src/components/Client/Contact/ContactForm";

export const metadata = {
    title: "Contact Us | Triova Limited",
    description: "Contact Triova Limited for fashion inquiries, support, or business partnerships. Email, call, or send us a message through the form.",
    robots: "index, follow",
    alternates: {
        canonical: "https://triova.vercel.app/contact",
    },
    openGraph: {
        title: "Contact Us | Triova Limited",
        description: "Reach out to the Triova Limited team by email, phone, or contact form. We're here to help.",
        url: "https://triova.vercel.app/contact",
        type: "website",
        images: [
            {
                url: "/logo.png",
                width: 1200,
                height: 630,
                alt: "Triova Limited Logo",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
    },
};

export default function ContactPage() {
    return <ContactForm />;
}
