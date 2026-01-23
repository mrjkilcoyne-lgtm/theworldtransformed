import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
    site: 'https://mrjkilcoyne-lgtm.github.io',
    base: '/theworldtransformed',
    integrations: [mdx()],
    markdown: {
          shikiConfig: {
                  theme: 'github-dark'
          }
    }
});
