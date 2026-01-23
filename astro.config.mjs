import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
    site: 'https://theworldtransformed.org',
    integrations: [mdx(), react()],
    output: 'hybrid',
    adapter: node({
        mode: 'standalone'
    }),
    markdown: {
          shikiConfig: {
                  theme: 'github-dark'
          }
    }
});
