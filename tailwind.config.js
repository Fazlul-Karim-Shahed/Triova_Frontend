module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
        "@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
        "./node_modules/flowbite/**/*.js",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                primary: {
                    50: "#eff6ff",
                    100: "#dbeafe",
                    200: "#bfdbfe",
                    300: "#93c5fd",
                    400: "#60a5fa",
                    500: "#3b82f6",
                    600: "#2563eb",
                    700: "#1d4ed8",
                    800: "#1e40af",
                    900: "#1e3a8a",
                    950: "#172554",
                },
                brand: {
                    100: "#dbece8",
                    200: "#b7d9d1",
                    300: "#93c6ba",
                    400: "#6fb3a3",
                    500: "#4b9f8c", // main brand color
                    600: "#3c8070",
                    700: "#2d6054",
                    800: "#1e4038",
                    900: "#0f201c",
                },
            },

            fontSize: {
                h1: ["32px", { lineHeight: "40px" }],
                h2: ["28px", { lineHeight: "36px" }],
                h3: ["24px", { lineHeight: "32px" }],
                h4: ["20px", { lineHeight: "28px" }],
                h5: ["18px", { lineHeight: "24px" }],
                h6: ["15px", { lineHeight: "22px" }],
            },
        },
    },
    darkMode: false,
    plugins: [require("daisyui"), require("flowbite/plugin")],
};
