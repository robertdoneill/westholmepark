import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://westholmepark.com',
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    react(),
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop',
    },
  },
});
