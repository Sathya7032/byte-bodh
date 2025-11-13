const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

const API_BASE = "https://bytebodh.codewithsathya.info/api/blog-posts/";
const sitemap = new SitemapStream({ hostname: 'https://bytebodh.in' });

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.7 },
  { url: '/blogs', changefreq: 'weekly', priority: 0.9 },
  { url: '/privacy-policy', changefreq: 'monthly', priority: 0.6 },
  { url: '/terms-and-conditions', changefreq: 'monthly', priority: 0.6 },
  { url: '/cookie-policy', changefreq: 'monthly', priority: 0.6 },
];

async function fetchBlogSlugs() {
  try {
    const res = await fetch(API_BASE);
    const data = await res.json();

    const slugs = data.map(blog => blog.slug);
    slugs.forEach(slug => links.push({
      url: `/blogs/${slug}`,
      changefreq: 'weekly',
      priority: 0.9
    }));

    console.log("Fetched slugs:", slugs);
  } catch (err) {
    console.error('Error fetching blog slugs:', err);
  }
}

async function generateSitemap() {
  await fetchBlogSlugs();

  const writeStream = createWriteStream('./public/sitemap.xml');
  sitemap.pipe(writeStream);
  links.forEach(link => sitemap.write(link));
  sitemap.end();

  await streamToPromise(sitemap);
  console.log('✅ Sitemap created successfully at ./public/sitemap.xml');
}

generateSitemap();
