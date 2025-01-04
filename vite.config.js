import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs/promises';
import svgr from '@svgr/rollup';

// Define your base URL and sub URL here
const BASE_URL = 'https://api.theclaimsteam.org.uk';
// const BASE_URL = 'http://192.168.24.80:8000';

const SUB_API_NAME = '/GBVR';

// https://vitejs.dev/config/
export default defineConfig({
  base: SUB_API_NAME,
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          setup(build) {
            build.onLoad({ filter: /src\\.*\.js$/ }, async (args) => ({
              loader: 'jsx',
              contents: await fs.readFile(args.path, 'utf8'),
            }));
          },
        },
      ],
    },
  },
  plugins: [svgr(), react()],
  define: {
    'import.meta.env.VITE_API_DOMAIN': JSON.stringify(BASE_URL),
    'import.meta.env.VITE_SUB_API_NAME': JSON.stringify(SUB_API_NAME),
  },
  server: {
    host: true,
    port: 5174,
  },
});
