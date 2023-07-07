const { writeFile } = require("fs");
const builder = require("xmlbuilder");
const { promisify } = require("util");
const writeFileAsync = promisify(writeFile);
const { CITIES, STATES } = require("./lib/locations");
const { FILTERS } = require("./lib/filters");

async function generateIndex() {
  const citySlugs = CITIES.map((city) => city.slug).sort();
  const xmlObject = {
    sitemapindex: {
      "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
      sitemap: [
        {
          loc: "https://website.com/sitemaps/sitemap-states.xml",
        },
        ...citySlugs.map((slug) => {
          return {
            loc: "https://website.com/sitemaps/sitemap-city-" + slug + ".xml",
          };
        }),
      ],
    },
  };

  const xmlFeed = builder.create(xmlObject, { encoding: "utf-8" });
  const sitemap = xmlFeed.end({ pretty: true });

  await writeFileAsync("./public/sitemap.xml", sitemap);
}

async function generateStates() {
  const stateSlugs = STATES.map((state) => state.slug).sort();
  const xmlObject = {
    urlset: {
      "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
      url: [
        ...stateSlugs.map((slug) => {
          return {
            loc: "https://website.com/" + slug,
            lastmod: new Date().toISOString().split("T")[0],
            changefreq: "weekly",
            priority: 0.6,
          };
        }),
      ],
    },
  };

  const xmlFeed = builder.create(xmlObject, { encoding: "utf-8" });
  const sitemap = xmlFeed.end({ pretty: true });

  await writeFileAsync("./public/sitemaps/sitemap-states.xml", sitemap);
}

async function generateCities() {
  const citySlugs = CITIES.map((city) => city.slug).sort();
  const filterSlugs = Object.values(FILTERS).map((filter) => filter.slug);
  for (const citySlug of citySlugs) {
    const cityUrl = "https://website.com/apartments-for-rent/" + citySlug;
    const xmlObject = {
      urlset: {
        "@xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
        url: [
          {
            loc: cityUrl,
            lastmod: new Date().toISOString().split("T")[0],
            changefreq: "daily",
            priority: 0.8,
          },
          ...filterSlugs.map((filterSlug) => {
            return {
              loc: cityUrl + "/" + filterSlug,
              lastmod: new Date().toISOString().split("T")[0],
              changefreq: "daily",
              priority: 0.7,
            };
          }),
        ],
      },
    };

    const xmlFeed = builder.create(xmlObject, { encoding: "utf-8" });
    const sitemap = xmlFeed.end({ pretty: true });

    await writeFileAsync(
      "./public/sitemaps/sitemap-city-" + citySlug + ".xml",
      sitemap
    );
  }
}

generateIndex();
generateStates();
generateCities();
