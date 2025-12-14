const { execSync } = require('child_process');
const { resolve } = require('path');

// 客户端构建配置
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

// 为每个客户端执行独立的构建
Object.entries(clientConfigs).forEach(([name, entry]) => {
  console.log(`Building client: ${name}`);
  
  try {
    // 使用vite的lib模式为每个客户端构建UMD包
    execSync(
      `vite build --lib "${entry}" --name "${name.charAt(0).toUpperCase() + name.slice(1)}" --formats umd --outDir "." --fileName "clients/${name}.min"`,
      { stdio: 'inherit', cwd: __dirname }
    );
    console.log(`Successfully built client: ${name}`);
  } catch (error) {
    console.error(`Failed to build client: ${name}`, error.message);
    process.exit(1);
  }
});

console.log('All clients built successfully!');