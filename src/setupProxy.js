const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['/sitemap.xml', '/site/sitemap.xml'],
    createProxyMiddleware({
      target: process.env.REACT_APP_API_BASE_URL || 'https://backend.bytebodh.in',
      changeOrigin: true,
    })
  );
};
