/**
 * 自动注册第三方库的机制
 * 确保在使用前正确加载所有依赖
 */

// 检查并注册全局对象
function registerGlobal(name: string, object: any): void {
  if (typeof window !== 'undefined' && !(window as any)[name]) {
    (window as any)[name] = object;
  }
  if (typeof globalThis !== 'undefined' && !(globalThis as any)[name]) {
    (globalThis as any)[name] = object;
  }
}

// 注册所有第三方库
function registerAllVendors(): void {
  // 注册events库
  if (typeof window !== 'undefined' && typeof (window as any).EventEmitter !== 'undefined') {
    registerGlobal('EventEmitter', (window as any).EventEmitter);
  }
  
  // 注册fengari-web库 (包含了fengari)
  if (typeof window !== 'undefined' && typeof (window as any).fengariWeb !== 'undefined') {
    registerGlobal('fengariWeb', (window as any).fengariWeb);
    // 同时注册fengari，因为fengari-web包含了它
    if ((window as any).fengariWeb.fengari) {
      registerGlobal('fengari', (window as any).fengariWeb.fengari);
    }
  }
  
  // 注册gl-matrix库
  if (typeof window !== 'undefined' && typeof (window as any).glMatrix !== 'undefined') {
    registerGlobal('glMatrix', (window as any).glMatrix);
    // 同时注册gl-matrix的子模块
    if ((window as any).glMatrix.vec3) registerGlobal('vec3', (window as any).glMatrix.vec3);
    if ((window as any).glMatrix.vec4) registerGlobal('vec4', (window as any).glMatrix.vec4);
    if ((window as any).glMatrix.quat) registerGlobal('quat', (window as any).glMatrix.quat);
    if ((window as any).glMatrix.mat4) registerGlobal('mat4', (window as any).glMatrix.mat4);
  }
  
  // 注册pako库
  if (typeof window !== 'undefined' && typeof (window as any).pako !== 'undefined') {
    registerGlobal('pako', (window as any).pako);
  }
  
  // 注册tga-js库
  if (typeof window !== 'undefined' && typeof (window as any).TGA !== 'undefined') {
    registerGlobal('TGA', (window as any).TGA);
  }
}

// 确保在所有库加载后再执行注册
function delayedRegisterAllVendors(): void {
  // 给库一些时间加载
  setTimeout(registerAllVendors, 0);
}

// 自动执行注册
if (typeof window !== 'undefined') {
  // 在浏览器环境中，等待所有资源加载完成后注册
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', delayedRegisterAllVendors);
  } else {
    delayedRegisterAllVendors();
  }
} else if (typeof globalThis !== 'undefined') {
  // 在Node.js环境中，立即注册
  registerAllVendors();
}

export { registerGlobal, registerAllVendors };
