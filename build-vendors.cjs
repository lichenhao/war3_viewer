const { execSync } = require('child_process');
const { resolve } = require('path');
const { mkdirSync, existsSync } = require('fs');

// 确保输出目录存在
const vendorsDir = resolve(__dirname, 'vendors');
if (!existsSync(vendorsDir)) {
  mkdirSync(vendorsDir, { recursive: true });
}

// 第三方库配置
const vendorLibs = {
  'events': {
    entry: 'node_modules/events/events.js',
    name: 'EventEmitter',
    output: 'events.vendor.min.js'
  },
  'fengari': {
    entry: 'node_modules/fengari/dist/fengari.js',
    name: 'fengari',
    output: 'fengari.vendor.min.js'
  },
  'fengari-web': {
    entry: 'node_modules/fengari-web/dist/fengari-web.js',
    name: 'fengariWeb',
    output: 'fengari-web.vendor.min.js'
  },
  'gl-matrix': {
    entry: 'node_modules/gl-matrix/dist/gl-matrix.js',
    name: 'glMatrix',
    output: 'gl-matrix.vendor.min.js'
  }
};

// 构建所有库
Object.entries(vendorLibs).forEach(([libName, config]) => {
  console.log(`Building ${libName}...`);
  
  try {
    // 使用vite构建单个库
    execSync(
      `vite build --lib "${config.entry}" --name "${config.name}" --formats umd --outDir "vendors" --fileName "${config.output.replace('.min.js', '')}"`,
      { stdio: 'inherit', cwd: __dirname }
    );
    console.log(`Successfully built ${libName}`);
  } catch (error) {
    console.error(`Failed to build ${libName}:`, error.message);
    process.exit(1);
  }
});

console.log('All vendor libraries built successfully!');