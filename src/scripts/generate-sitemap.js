const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const fetch = require('node-fetch');

const API_BASE = "https://bytebodh.codewithsathya.info/api/blogs";
const sitemap = new SitemapStream({ hostname: 'https://bytebodh.in' });

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.7 },
  { url: '/blogs', changefreq: 'weekly', priority: 0.9 },
  { url: '/privacy-policy', changefreq: 'monthly', priority: 0.6 },
  { url: '/terms-and-conditions', changefreq: 'monthly', priority: 0.6 },
  { url: '/cookie-policy', changefreq: 'monthly', priority: 0.6 },
  { url: '/products', changefreq: 'weekly', priority: 0.8 },
  { url: '/qr', changefreq: 'monthly', priority: 0.7 },
  { url: '/invoice-generator', changefreq: 'monthly', priority: 0.7 },
  { url: '/image-compressor', changefreq: 'monthly', priority: 0.7 },
  { url: '/code-editor', changefreq: 'monthly', priority: 0.7 },
  { url: '/jobs', changefreq: 'daily', priority: 0.9 },
  { url: '/login', changefreq: 'monthly', priority: 0.5 },
  { url: '/register', changefreq: 'monthly', priority: 0.5 },
];

async function fetchBlogSlugs() {
  try {
    const res = await fetch(API_BASE);
    const data = await res.json();

    // Handle response format - check if data is in data.data or direct array
    const blogs = data.data || data;
    
    if (Array.isArray(blogs)) {
      const slugs = blogs.map(blog => blog.slug).filter(slug => slug);
      slugs.forEach(slug => links.push({
        url: `/blogs/${slug}`,
        changefreq: 'monthly',
        priority: 0.8
      }));

      console.log(`✅ Fetched ${slugs.length} blog slugs`);
    } else {
      console.log('No blogs found or unexpected response format');
    }
  } catch (err) {
    console.error('Error fetching blog slugs:', err.message);
    console.log('⚠️  Continuing with static pages only...');
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
