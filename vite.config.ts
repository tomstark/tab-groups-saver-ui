import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import hotReloadExtension from 'hot-reload-extension-vite';
import { fileURLToPath, URL } from 'node:url';
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    hotReloadExtension({
      log: true,
      backgroundPath: 'src/pages/background/index.js'
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    origin: 'https://localhost:5173',
    port: 5173,
    strictPort: true,
    https: {
      key: fs.readFileSync(`docker/certs/tgs-ui-test-key.pem`),
      cert: fs.readFileSync(`docker/certs/tgs-ui-test-cert.pem`),
    },
    hmr: {
      host: 'localhost'
    }
  },
  build: {
    rollupOptions: {
      input: {
        'new-tab': resolve(__dirname, 'src/pages/new-tab/index.html'),
        popup: resolve(__dirname, 'src/pages/popup/index.html'),
        // content: resolve(__dirname, 'src/pages/content/index.js'),
        // background: resolve(__dirname, 'src/pages/background/index.js'),
        // 'dev-tools': resolve(__dirname, 'src/pages/dev-tools/index.html'),
        // panel: resolve(__dirname, 'src/pages/panel/index.html')
      },
      output: {
        dir: 'dist',
        entryFileNames: 'src/pages/[name]/index.js',
        chunkFileNames: 'assets/js/[name].js'
      }
    }
  },
});
