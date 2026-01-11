const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://geo-review-app.onrender.com',
      changeOrigin: true,
    })
  );
};