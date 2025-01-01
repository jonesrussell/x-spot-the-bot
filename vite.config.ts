import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: 'src/content/index.ts',
      formats: ['iife'],
      name: 'xbot',
      fileName: 'content.js'
    },
    modulePreload: false,
    cssCodeSplit: false,
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      external: ['chrome'],
      output: {
        format: 'iife',
        name: 'xbot',
        extend: true,
        entryFileNames: 'content.js',
        globals: {
          chrome: 'chrome'
        },
        generatedCode: {
          constBindings: true
        },
        assetFileNames: (assetInfo) => {
          return assetInfo.name === 'style.css' ? 'content.css' : assetInfo.name ?? '[name][extname]';
        }
      }
    }
  },
  resolve: {
    extensions: ['.ts', '.js', '.css'],
    alias: {
      '@': resolve(__dirname, './src'),
      '@services': resolve(__dirname, './src/services'),
      '@types': resolve(__dirname, './src/types'),
      '@utils': resolve(__dirname, './src/utils')
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]__[hash:base64:5]',
      exportGlobals: true
    }
  },
  esbuild: {
    target: 'es2022',
    format: 'esm',
    platform: 'browser',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    keepNames: true,
    legalComments: 'none'
  }
}); 