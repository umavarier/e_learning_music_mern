const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
      '/book-demo', 
      createProxyMiddleware({
        // target: 'https://melodymusic.online/', 
        target: 'http://localhost:4000',
        changeOrigin: true,
      })
    );
  };
  