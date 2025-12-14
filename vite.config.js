import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readdirSync } from 'fs';

// 获取所有客户端目录
const clientDirs = readdirSync('./clients', { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// 添加editor目录
clientDirs.push('editor');

// 为每个客户端创建入口点
const clientInputs = {};
clientDirs.forEach(dir => {
  const entryPath = `./clients/${dir}/index.js`;
  const tsEntryPath = `./clients/${dir}/index.ts`;
  
  // 检查是否存在TS文件
  try {
    const fs = require('fs');
    if (fs.existsSync(tsEntryPath)) {
      clientInputs[dir] = tsEntryPath;
    } else if (fs.existsSync(entryPath)) {
      clientInputs[dir] = entryPath;
    }
  } catch (err) {
    // 忽略错误
  }
});

// 添加默认入口点以防clientInputs为空
if (Object.keys(clientInputs).length === 0) {
  clientInputs.example = './clients/example/index.js';
}

export default defineConfig(({ command, mode }) => {
  if (mode === 'umd') {
    // 库模式构建
    return {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'ModelViewer',
          formats: ['umd'],
          fileName: 'viewer'
        },
        rollupOptions: {
          external: ['fengari', 'gl-matrix', 'events'],
          output: {
            globals: {
              fengari: 'fengari',
              'gl-matrix': 'glMatrix',
              'events': 'EventEmitter'
            }
          }
        },
        outDir: 'dist/umd'
      },
      plugins: [react()]
    };
  } else {
    // 客户端构建
    return {
      build: {
        rollupOptions: {
          input: {
            ...clientInputs
          },
          output: {
            entryFileNames: 'clients/[name].min.js',
            chunkFileNames: 'chunks/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]'
          }
        },
        outDir: 'dist'
      },
      server: {
        open: '/clients/example/index.html'
      },
      plugins: [react()],
      resolve: {
        alias: {
          events: resolve(__dirname, 'node_modules/events/events.js')
        }
      }
    };
  }
});