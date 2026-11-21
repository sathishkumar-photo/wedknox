// LOCATION: next.config.js   (REPLACE - project root, next to package.json)
module.exports = {
  reactStrictMode: true,
  webpack(config) {
    // Lets `import x from "./file.html?raw"` give back the file's text.
    // Used by the Get Started button so its original source file can stay untouched.
    config.module.rules.push({ resourceQuery: /raw/, type: "asset/source" });
    return config;
  },
};