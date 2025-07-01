import { getAllProductApi } from "@/src/api/SuperAdminApi/ProductApi";

const baseUrl = "https://triova.vercel.app";

const staticUrls = ["", "about", "contact", "privacy", "terms", "branding", "design", "marketing", "advertisement", "job", "press", "cookie"];

export async function GET() {
    try {
        const productRes = await getAllProductApi(null);
        const products = productRes?.data || [];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls
      .map(
          (path) => `
    <url>
      <loc>${baseUrl}/${path}</loc>
      <changefreq>hourly</changefreq>
      <priority>0.9</priority>
    </url>
  `
      )
      .join("")}
  ${products
      .map(
          (product) => `
    <url>
      <loc>${baseUrl}/products/${encodeURIComponent(product.name)}</loc>
      <lastmod>${new Date(product.updatedAt || product.createdAt || new Date()).toISOString()}</lastmod>
      <changefreq>hourly</changefreq>
      <priority>0.9</priority>
    </url>
  `
      )
      .join("")}
</urlset>`.trim();

        return new Response(sitemap, {
            status: 200,
            headers: {
                "Content-Type": "application/xml",
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (error) {
        return new Response("Failed to generate sitemap", { status: 500 });
    }
}
