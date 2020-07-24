const TARGET = process.env.TARGET || 'ICNDB';


const configuration = {
  'ICNDB' : {
    target : 'https://api.icndb.com',
    host: 'api.icndb.com'
  },
  'HTTPBIN' : {
    target : 'https://httpbin.org',
    host: 'httpbin.org'
  }
};


const PROXY_CONFIG = [
    {
        context: ["/api/**"],
        target: configuration[TARGET].target,
        headers: {
          host: configuration[TARGET].host
        },
        secure: false,
        pathRewrite: {
          '^/api': ''
        }
    }
];

module.exports = PROXY_CONFIG;
