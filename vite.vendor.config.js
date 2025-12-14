import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  // 从环境变量获取配置
  const libEntry = process.env.VITE_LIB_ENTRY;
  const libName = process.env.VITE_LIB_NAME;
  const fileName = process.env.VITE_FILE_NAME;
  
  return {
    build: {
      lib: {
        entry: libEntry || '',
        name: libName || '',
        formats: ['umd'],
        fileName: () => fileName ? `${fileName}.min.js` : 'vendor.min.js'
      },
      outDir: 'vendors',
      emptyOutDir: false
    }
  };
});