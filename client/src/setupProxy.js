const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
      '/book-demo', 
      createProxyMiddleware({
        target: 'https://melodymusic.online/', 
        changeOrigin: true,
      })
    );
  };
  