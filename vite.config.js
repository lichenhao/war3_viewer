import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// 在ES模块中使用require
const require = createRequire(import.meta.url);

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 请求缓存，避免重复请求相同的资源
const requestCache = new Map();

// 定期清理请求缓存，避免内存泄漏
setInterval(() => {
  if (requestCache.size > 100) {
    // 保留最近50个请求
    const keys = Array.from(requestCache.keys());
    for (let i = 0; i < keys.length - 50; i++) {
      requestCache.delete(keys[i]);
    }
    console.log(`Cleaned request cache, remaining entries: ${requestCache.size}`);
  }
}, 30000); // 每30秒检查一次

// 并发控制类，限制同时进行的远程请求数量
class ConcurrencyController {
  constructor(maxConcurrent = 10) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }

  async add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject
      });
      this.process();
    });
  }

  async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.running++;
    const { task, resolve, reject } = this.queue.shift();

    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.process();
    }
  }
}

// 创建并发控制器实例
const concurrencyController = new ConcurrencyController(10);

// 根据文件扩展名获取Content-Type
function getResourceContentType(ext) {
  const contentTypes = {
    'mdx': 'application/octet-stream',
    'm3': 'application/octet-stream',
    'blp': 'application/octet-stream',
    'dds': 'application/octet-stream',
    'tga': 'application/octet-stream',
    'mdl': 'text/plain',
    'j': 'text/plain',
    'lua': 'text/plain',
    'w3x': 'application/octet-stream',
    'w3m': 'application/octet-stream'
  };
  
  return contentTypes[ext] || 'application/octet-stream';
}

// 构造远程资源URL
function getRemoteResourceUrl(resourcePath) {
  // 对于脚本文件，使用特定的HiveWorkshop URL
  if (resourcePath.startsWith('scripts/')) {
    return `https://www.hiveworkshop.com/data/static_assets/mpq/tft/${resourcePath}`;
  }
  
  // 对于其他资源，使用Reforged CASC内容URL
  return `https://www.hiveworkshop.com/casc-contents?path=${encodeURIComponent(resourcePath)}`;
}

// 获取远程资源
async function fetchRemoteResource(url) {
  // 检查请求缓存
  if (requestCache.has(url)) {
    console.log(`Returning cached request for ${url}`);
    return requestCache.get(url);
  }

  // 使用并发控制器包装请求
  const promise = concurrencyController.add(() => {
    return new Promise((resolve, reject) => {
      const https = require('https');
      const http = require('http');
      
      const lib = url.startsWith('https') ? https : http;
      
      const req = lib.get(url, (res) => {
        // 处理重定向
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // 递归调用以跟随重定向
          fetchRemoteResource(res.headers.location).then(resolve).catch(reject);
          return;
        }
        
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to fetch ${url}: ${res.statusCode} ${res.statusMessage}`));
          return;
        }
        
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        });
      }).on('error', (err) => {
        reject(err);
      });
      
      // 设置超时
      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error(`Request timeout for ${url}`));
      });
    });
  });

  // 缓存请求Promise
  requestCache.set(url, promise);

  try {
    const result = await promise;
    return result;
  } catch (error) {
    // 请求失败时清除缓存
    requestCache.delete(url);
    throw error;
  }
}

// 保存资源到本地缓存
async function saveResourceToLocalCache(filePath, buffer) {
  try {
    // 确保目录存在，使用相对于项目根目录的路径
    const fullPath = resolve(__dirname, filePath);
    const dir = dirname(fullPath);
    if (!existsSync(dir)) {
      // 递归创建目录
      mkdirSync(dir, { recursive: true });
    }
    
    // 写入文件
    writeFileSync(fullPath, buffer);
    console.log(`Saved resource to local cache: ${fullPath}`);
  } catch (err) {
    console.error(`Failed to save resource to local cache: ${filePath}`, err);
  }
}

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
        },
        // 代理配置，用于本地资源缓存
        proxy: {
          // 拦截/resources/路径的请求
          '/resources': {
            target: 'http://localhost:5173',
            changeOrigin: true,
            bypass: function (req, res, proxyOptions) {
              // 本地资源服务器逻辑在自定义插件中实现
              return req.url;
            }
          }
        }
      },
      plugins: [
        react(),
        // 自定义插件，处理本地资源缓存逻辑
        {
          name: 'local-resource-cache',
          configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
              // 处理/resources/路径的请求
              if (req.url && req.url.startsWith('/resources/')) {
                const resourcePath = req.url.slice(10); // 移除'/resources/'前缀
                
                try {
                  // 尝试从本地resources文件夹读取，使用相对于项目根目录的路径
                  const fullPath = resolve(__dirname, 'resources', resourcePath);
                  const buffer = readFileSync(fullPath);
                  console.log(`Loaded ${resourcePath} from local cache`);
                  
                  // 设置正确的Content-Type
                  const ext = resourcePath.split('.').pop().toLowerCase();
                  const contentType = getResourceContentType(ext);
                  res.setHeader('Content-Type', contentType);
                  res.setHeader('Content-Length', buffer.length);
                  res.end(buffer);
                  return;
                } catch (err) {
                  // 本地文件不存在，从远程获取并保存
                  console.log(`Local cache miss for ${resourcePath}, fetching from remote`);
                  
                  try {
                    // 构造远程URL
                    const remoteUrl = getRemoteResourceUrl(resourcePath);
                    
                    // 使用内置的http/https模块获取远程资源
                    const buffer = await fetchRemoteResource(remoteUrl);
                    
                    // 保存到本地resources文件夹
                    await saveResourceToLocalCache(`resources/${resourcePath}`, buffer);
                    
                    // 返回资源
                    const ext = resourcePath.split('.').pop().toLowerCase();
                    const contentType = getResourceContentType(ext);
                    res.setHeader('Content-Type', contentType);
                    res.setHeader('Content-Length', buffer.length);
                    res.end(buffer);
                    return;
                  } catch (remoteErr) {
                    console.error(`Failed to fetch or save resource ${resourcePath}:`, remoteErr);
                    res.statusCode = 404;
                    res.end('Resource not found');
                    return;
                  }
                }
              }
              
              // 处理其他二进制文件
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