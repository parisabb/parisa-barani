/* Generates clean, shareable pages for every project in the portfolio.
   Run with: node scripts/generate-clean-routes.js */

const fs = require("fs");
const vm = require("vm");

const dataSource = `${fs.readFileSync("js/data.js", "utf8")}
globalThis.catalog = { PROFESSIONAL_PROJECTS, STUDIO_BARAN_PROJECTS, ARTWORKS, EXHIBITIONS };`;
const context = {};
vm.createContext(context);
vm.runInContext(dataSource, context);

const groups = [
  ["work", "work.html", context.catalog.PROFESSIONAL_PROJECTS],
  ["studio-baran", "studio-baran.html", context.catalog.STUDIO_BARAN_PROJECTS],
  ["art", "art.html", context.catalog.ARTWORKS],
  ["exhibitions", "exhibitions.html", context.catalog.EXHIBITIONS],
];

const sections = [
  ["work", "work.html"],
  ["studio-baran", "studio-baran.html"],
  ["art", "art.html"],
  ["exhibitions", "exhibitions.html"],
  ["about", "about.html"],
  ["contact", "contact.html"],
];

const viewport = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
const cleanRouteScript = '<script src="js/clean-routes.js?v=20261013b"></script>\r\n';

function escapeAttribute(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function shortDescription(item) {
  const text = String(item.concept || item.description || item.process || item.scope || "Selected work by Parisa Barani.")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 155 ? `${text.slice(0, 152).replace(/\s+\S*$/, "")}...` : text;
}

function addBaseAndRouting(page, base, includeDetailRouting = false) {
  const withBase = page.replace(viewport, `${viewport}\r\n<base href="${base}">`);
  return includeDetailRouting ? withBase.replace("</body>", `${cleanRouteScript}</body>`) : withBase;
}

for (const [route, source] of sections) {
  const page = addBaseAndRouting(fs.readFileSync(source, "utf8"), "../", groups.some(([group]) => group === route));
  fs.mkdirSync(route, { recursive: true });
  fs.writeFileSync(`${route}/index.html`, page);
}

const sitemapUrls = [
  "https://parisabarani.se/",
  "https://parisabarani.se/work/",
  "https://parisabarani.se/studio-baran/",
  "https://parisabarani.se/exhibitions/",
  "https://parisabarani.se/art/",
  "https://parisabarani.se/about/",
  "https://parisabarani.se/contact/",
];

let projectCount = 0;

for (const [route, source, items] of groups) {
  for (const item of items) {
    const url = `https://parisabarani.se/${route}/${encodeURIComponent(item.slug)}/`;
    const image = item.heroImage || item.image || (item.images && item.images[0]) || "images/hero-public-bench-city.webp";
    const description = shortDescription(item);
    let page = addBaseAndRouting(fs.readFileSync(source, "utf8"), "../../", true);

    page = page
      .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttribute(item.title)} — Parisa Barani</title>`)
      .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeAttribute(description)}">`)
      .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
      .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeAttribute(item.title)} — Parisa Barani">`)
      .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeAttribute(description)}">`)
      .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`)
      .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="https://parisabarani.se/${encodeURI(image)}">`)
      .replace(/<meta property="og:image:alt" content="[^"]*">/, `<meta property="og:image:alt" content="${escapeAttribute(item.title)} — Parisa Barani">`);

    fs.mkdirSync(`${route}/${item.slug}`, { recursive: true });
    fs.writeFileSync(`${route}/${item.slug}/index.html`, page);
    sitemapUrls.push(url);
    projectCount += 1;
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((url) => `  <url><loc>${url}</loc><lastmod>2026-10-13</lastmod></url>`).join("\n")}
</urlset>
`;

fs.writeFileSync("sitemap.xml", sitemap);
console.log(`Created ${projectCount} named project routes and ${sitemapUrls.length} sitemap entries.`);
