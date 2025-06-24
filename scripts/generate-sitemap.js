// scripts/generate-sitemap.js
const fs = require("fs");
const path = require("path");
const { getAllProductApi } = require("../src/api/SuperAdminApi/ProductApi");
require("dotenv").config();

const baseUrl = "https://triova.vercel.app/";

const staticUrls = ["", "about", "contact", "privacy", "terms", "branding", "design", "marketing", "advertisement", "job", "press", "cookie"];

async function generateSitemap() {
    try {
        // Fetch products using your API function
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
  </url>`
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
  </url>`
      )
      .join("")}
</urlset>`;

        // Write sitemap.xml to public folder
        fs.writeFileSync(path.join(__dirname, "../public/sitemap.xml"), sitemap.trim());
        console.log("✅ Sitemap generated successfully!");
    } catch (error) {
        console.error("❌ Failed to generate sitemap:", error.message);
    }
}

generateSitemap();
