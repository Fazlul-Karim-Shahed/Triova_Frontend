export default function About() {
    return (
        <main className="min-h-screen bg-white text-gray-800 py-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-6">About Triova BD</h1>
                    <p className="text-xl text-gray-600">Your Fashion Companion in Bangladesh</p>
                </header>

                <section className="glass p-8 rounded-3xl shadow-xl backdrop-blur-lg bg-white/60">
                    <p className="text-lg leading-relaxed mb-6">
                        At <strong>Triova BD</strong>, we believe fashion is more than clothing—it's a form of self-expression. As a proudly Bangladeshi online fashion destination, we bring the latest
                        trends and timeless pieces directly to your doorstep. Our curated collections are designed for comfort, confidence, and style.
                    </p>
                    <p className="text-lg leading-relaxed mb-6">
                        We are committed to providing a seamless online shopping experience with reliable delivery, secure payment options, and attentive customer care. From trendy apparel to everyday
                        essentials, Triova BD is your trusted source for all things fashion.
                    </p>
                    <p className="text-lg leading-relaxed">
                        Join thousands of happy shoppers across Bangladesh who trust us for quality, affordability, and authenticity. With every order, you become a part of the Triova family.
                    </p>
                </section>

                <section className="mt-16 grid md:grid-cols-3 gap-8 text-center" aria-label="Mission Vision Values">
                    <article className="glass p-6 rounded-2xl shadow-lg backdrop-blur-md bg-white/70">
                        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                        <p>To empower fashion lovers in Bangladesh with high-quality, affordable styles delivered with integrity and care.</p>
                    </article>
                    <article className="glass p-6 rounded-2xl shadow-lg backdrop-blur-md bg-white/70">
                        <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
                        <p>To become the most trusted online fashion brand in Bangladesh by blending style, service, and sustainability.</p>
                    </article>
                    <article className="glass p-6 rounded-2xl shadow-lg backdrop-blur-md bg-white/70">
                        <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
                        <p>Quality, Customer First, Sustainability, Innovation, and Community.</p>
                    </article>
                </section>

                <section className="mt-20 text-center" aria-label="Stay Connected">
                    <h2 className="text-3xl font-bold mb-4">Stay in Touch</h2>
                    <p className="mb-6 text-gray-600">Subscribe to get the latest updates, offers, and style inspiration.</p>
                    <form className="flex flex-col md:flex-row justify-center items-center gap-4" method="POST">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="px-6 py-3 rounded-full w-full md:w-96 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                            required
                        />
                        <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full transition">
                            Subscribe
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}
