const fs = require('fs-extra');
const dotenv = require('dotenv');

dotenv.config();

const proxyConfig = {
  "/api": {
    target: process.env.API_PROXY_TARGET || "http://127.0.0.1:8000",
    secure: false,
    changeOrigin: true,
    logLevel: "debug"
  }
};

fs.writeJsonSync('proxy.conf.json', proxyConfig, { spaces: 2 });
console.log("✅ proxy.conf.json generated with target:", proxyConfig["/api"].target);
