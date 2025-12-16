import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readFileSync } from 'fs';

export default defineConfig(({ command, mode }) => {
  if (mode === 'umd') {
    // UMD 构建模式
    return {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'ModelViewer',
          formats: ['umd'],
          fileName: 'viewer'
        },
        rollupOptions: {
        },
        outDir: 'dist/umd'
      },
      plugins: [react()]
    };
  } else if (mode === 'mjs') {
    // MJS 构建模式
    return {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'ModelViewer',
          formats: ['es'],
          fileName: 'viewer'
        },
        rollupOptions: {
        },
        outDir: 'dist/mjs'
      },
      plugins: [react()]
    };
  } else {
    // 开发服务器模式
    return {
      server: {
        // 不对非网页文件进行处理，直接返回原始二进制文件
        mimeTypes: {
          '.mdx': 'application/octet-stream',
          '.m3': 'application/octet-stream',
          '.blp': 'application/octet-stream',
          '.dds': 'application/octet-stream',
          '.tga': 'application/octet-stream'
        }
      },
      plugins: [
        react(),
        // 自定义插件，确保二进制文件不被Vite处理
        {
          name: 'binary-assets',
          configureServer(server) {
            server.middlewares.use((req, res, next) => {
              if (req.url && (req.url.endsWith('.mdx') || req.url.endsWith('.m3') || req.url.endsWith('.blp') || req.url.endsWith('.dds') || req.url.endsWith('.tga'))) {
                const filePath = resolve(__dirname, req.url.slice(1));
                try {
                  const buffer = readFileSync(filePath);
                  res.setHeader('Content-Type', 'application/octet-stream');
                  res.setHeader('Content-Length', buffer.length);
                  res.end(buffer);
                  return;
                } catch (err) {
                  // 如果文件不存在，继续下一个中间件
                  next();
                  return;
                }
              }
              next();
            });
          }
        }
      ],
      resolve: {
        alias: {
          events: resolve(__dirname, 'node_modules/events/events.js'),
          fengari: resolve(__dirname, 'node_modules/fengari-web/dist/fengari-web.js')
        }
      },
      define: {
        // 为fengari库定义process对象
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.browser': JSON.stringify(true),
        'process.version': JSON.stringify(''),
        'process.versions': JSON.stringify({})
      },
      // 配置Vite不处理特定的二进制文件
      optimizeDeps: {
        exclude: []
      }
    };
  }
});