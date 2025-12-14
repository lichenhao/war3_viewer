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
          external: ['fengari', 'fengari-web', 'events', 'gl-matrix', 'pako', 'tga-js'],
          output: {
            globals: {
              'fengari': 'fengari',
              'fengari-web': 'fengariWeb',
              'events': 'EventEmitter',
              'gl-matrix': 'glMatrix',
              'pako': 'pako',
              'tga-js': 'TGA'
            }
          }
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
          external: ['fengari', 'fengari-web', 'events', 'gl-matrix', 'pako', 'tga-js'],
          output: {
            globals: {
              'fengari': 'fengari',
              'fengari-web': 'fengariWeb',
              'events': 'EventEmitter',
              'gl-matrix': 'glMatrix',
              'pako': 'pako',
              'tga-js': 'TGA'
            }
          }
        },
        outDir: 'dist/mjs'
      },
      plugins: [react()]
    };
  } else if (mode.startsWith('client-')) {
    // 客户端构建模式 - 为每个客户端生成独立的UMD打包文件
    const clientName = mode.replace('client-', '');
    
    // 获取客户端入口配置
    const clientConfigs = {
      'example': resolve(__dirname, 'clients/example/index.js'),
      'downgrader': resolve(__dirname, 'clients/downgrader/index.js'),
      'map': resolve(__dirname, 'clients/map/index.js'),
      'mdlx': resolve(__dirname, 'clients/mdlx/index.js'),
      'rebuild': resolve(__dirname, 'clients/rebuild/index.js'),
      'sanitytest': resolve(__dirname, 'clients/sanitytest/index.js'),
      'tests': resolve(__dirname, 'clients/tests/index.js'),
      'weu': resolve(__dirname, 'clients/weu/index.js'),
      'mdlxoptimizer': resolve(__dirname, 'clients/mdlxoptimizer/index.ts')
    };
    
    const entry = clientConfigs[clientName];
    if (!entry) {
      throw new Error(`Unknown client: ${clientName}`);
    }
    
    return {
      build: {
        rollupOptions: {
          input: {
            [clientName]: entry
          },
          // 对于客户端构建，我们需要确保fengari-web被正确打包
          // 但由于命名冲突问题，我们将fengari-web也排除在外，通过<script>标签引入
          external: ['fengari', 'fengari-web', 'events', 'gl-matrix', 'pako', 'tga-js'],
          output: {
            format: 'umd',
            entryFileNames: `clients/${clientName}.min.js`,
            chunkFileNames: `clients/${clientName}.min.js`,
            assetFileNames: `clients/${clientName}.[ext]`,
            globals: {
              'fengari': 'fengari',
              'fengari-web': 'fengariWeb',
              'events': 'EventEmitter',
              'gl-matrix': 'glMatrix',
              'pako': 'pako',
              'tga-js': 'TGA'
            }
          }
        },
        outDir: '.',
        emptyOutDir: false
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
          events: resolve(__dirname, 'node_modules/events/events.js')
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