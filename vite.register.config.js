import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  if (mode === 'umd') {
    return {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/register.ts'),
          name: 'register',
          formats: ['umd'],
          fileName: 'register.vendor'
        },
        outDir: 'dist/umd',
        emptyOutDir: false
      }
    };
  } else if (mode === 'mjs') {
    return {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/register.ts'),
          name: 'register',
          formats: ['es'],
          fileName: 'register.vendor'
        },
        outDir: 'dist/mjs',
        emptyOutDir: false
      }
    };
  } else {
    // client mode
    return {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/register.ts'),
          name: 'register',
          formats: ['umd'],
          fileName: 'register'
        },
        outDir: 'vendors',
        emptyOutDir: false
      }
    };
  }
});