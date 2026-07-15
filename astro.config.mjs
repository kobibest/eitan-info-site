import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://info.m-eitan.co.il',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // Inline all page CSS to eliminate render-blocking stylesheet requests (Core Web Vitals)
    inlineStylesheets: 'always',
  },
});
