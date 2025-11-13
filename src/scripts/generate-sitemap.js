const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

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

// Example blog slugs
const blogSlugs = ['welcome-to-bytebodh'];
blogSlugs.forEach(slug => links.push({ url: `/blogs/${slug}`, changefreq: 'weekly', priority: 0.9 }));

async function generateSitemap() {
  const writeStream = createWriteStream('./public/sitemap.xml');

  // Pipe sitemap stream to file
  sitemap.pipe(writeStream);

  // Write all URLs
  links.forEach(link => sitemap.write(link));

  // End the sitemap stream
  sitemap.end();

  // Wait for the sitemap stream (not the writeStream)
  await streamToPromise(sitemap);

  console.log('Sitemap created!');
}

generateSitemap();
