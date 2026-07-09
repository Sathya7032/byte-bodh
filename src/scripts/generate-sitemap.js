const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

const API_BASE = "https://backend.bytebodh.in/api";
const sitemap = new SitemapStream({ hostname: 'https://bytebodh.in' });

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.7 },
  { url: '/blogs', changefreq: 'weekly', priority: 0.9 },
  { url: '/privacy-policy', changefreq: 'monthly', priority: 0.6 },
  { url: '/terms-and-conditions', changefreq: 'monthly', priority: 0.6 },
  { url: '/cookie-policy', changefreq: 'monthly', priority: 0.6 },
  { url: '/disclaimer', changefreq: 'monthly', priority: 0.6 },
  { url: '/products', changefreq: 'weekly', priority: 0.8 },
  { url: '/qr', changefreq: 'monthly', priority: 0.7 },
  { url: '/invoice-generator', changefreq: 'monthly', priority: 0.7 },
  { url: '/image-compressor', changefreq: 'monthly', priority: 0.7 },
  { url: '/code-editor', changefreq: 'monthly', priority: 0.7 },
  { url: '/jobs', changefreq: 'daily', priority: 0.9 },
];

async function fetchApi(url) {
  if (typeof fetch === 'function') {
    const res = await fetch(url);
    return res.json();
  } else {
    const axios = require('axios');
    const res = await axios.get(url);
    return res.data;
  }
}

// Helper function to create URL-friendly slug (matching Jobs.js)
const createJobSlug = (title, id) => {
  if (!title) return id.toString();
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
  return `${slug}-${id}`;
};

async function fetchBlogSlugs() {
  try {
    const data = await fetchApi(`${API_BASE}/blogs`);
    const blogs = data.data || data;
    
    if (Array.isArray(blogs)) {
      const slugs = blogs.map(blog => blog.slug).filter(slug => slug);
      slugs.forEach(slug => links.push({
        url: `/blogs/${slug}`,
        changefreq: 'weekly',
        priority: 0.8
      }));
      console.log(`✅ Fetched ${slugs.length} blog slugs`);
    } else {
      console.log('No blogs found or unexpected response format');
    }
  } catch (err) {
    console.error('Error fetching blog slugs:', err.message);
  }
}

async function fetchJobSlugs() {
  try {
    const data = await fetchApi(`${API_BASE}/job-notifications`);
    const jobs = data.data || data;
    
    if (Array.isArray(jobs)) {
      // Filter active jobs only
      const activeJobs = jobs.filter(job => job.isActive !== false);
      activeJobs.forEach(job => {
        const slug = createJobSlug(job.jobTitle, job.id);
        links.push({
          url: `/jobs/${slug}`,
          changefreq: 'weekly',
          priority: 0.8
        });
      });
      console.log(`✅ Fetched ${activeJobs.length} active job slugs`);
    } else {
      console.log('No jobs found or unexpected response format');
    }
  } catch (err) {
    console.error('Error fetching job slugs:', err.message);
  }
}

async function generateSitemap() {
  await fetchBlogSlugs();
  await fetchJobSlugs();

  const writeStream = createWriteStream('./public/sitemap.xml');
  sitemap.pipe(writeStream);
  links.forEach(link => sitemap.write(link));
  sitemap.end();

  await streamToPromise(sitemap);
  console.log('✅ Sitemap created successfully at ./public/sitemap.xml');
}

generateSitemap();
