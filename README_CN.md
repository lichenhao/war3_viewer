# MDX/M3 3D模型查看器

[English Version](README.md) | 中文版本

## 项目简介

这是一个用于查看魔兽争霸3 (Warcraft 3) 和星际争霸2 (Starcraft 2) 游戏中使用的3D模型的浏览器WebGL查看器。支持MDX/M3模型格式以及相关的纹理和地图文件。

项目来源：[https://github.com/flowtsohg/mdx-m3-viewer/tree/master](https://github.com/flowtsohg/mdx-m3-viewer/tree/master)

## 核心功能

- **模型支持**：
  - MDX (Warcraft 3模型)：全面支持，几乎所有功能都可以正常工作
  - M3 (Starcraft 2模型)：部分支持
  - W3M/W3X (Warcraft 3地图)：部分支持

- **纹理支持**：
  - BLP1 (Warcraft 3纹理)：全面支持
  - TGA (图像)：全面支持
  - DDS (压缩纹理)：部分支持 - DXT1/DXT3/DXT5/RGTC
  - PNG/JPG/GIF/WebP：由浏览器原生支持

- **特色功能**：
  - Reforged高清资源切换支持
  - 团队颜色控制
  - SC2模型自动缩放
  - 音频支持（需用户交互启用）
  - 多场景合成
  - 内存加载与自定义数据注入

## 最新更新

本项目已完成以下重要更新：

1. **编译和Lint系统升级**：已将项目构建与lint流程升级至基于最新Vite架构
2. **React版本更新**：升级到最新的React生态系统版本

## 目录结构

```
.
├── clients/                 # 客户端示例
│   ├── example/            # 基础示例
│   ├── map/                # 地图查看器
│   ├── melee/              # 对战模式查看器
│   └── ...                 # 其他客户端
├── src/                    # 源代码
│   ├── common/             # 通用工具
│   ├── parsers/            # 文件解析器
│   ├── utils/              # 实用工具
│   └── viewer/             # 查看器核心
└── dist/                   # 构建输出
```

## 安装与构建

### 安装依赖
```bash
pnpm install
```

### 构建项目
```bash
# 构建所有客户端
pnpm build

# 构建UMD版本（用于发布）
pnpm prepublishOnly
```

### 开发模式
```bash
# 启动开发服务器
pnpm dev

# 预览构建结果
pnpm serve
```

## 使用示例

### 基础用法
```javascript
// 创建查看器
let canvas = document.getElementById('canvas');
let viewer = new ModelViewer.viewer.ModelViewer(canvas);

// 添加场景
let scene = viewer.addScene();
scene.camera.move([0, 0, 500]);

// 添加处理器
viewer.addHandler(handlers.mdx);
viewer.addHandler(handlers.blp);

// 加载模型
let modelPromise = viewer.load("Resources/model.mdx");

// 创建实例并添加到场景
modelPromise.then(model => {
  if (model) {
    let instance = model.addInstance();
    instance.setScene(scene);
  }
});

// 渲染循环
(function step() {
  requestAnimationFrame(step);
  viewer.updateAndRender();
}());
```

## 技术架构

- **构建工具**：Vite（最新版本）
- **前端框架**：React（最新版本）
- **模块系统**：NodeNext (TypeScript)
- **代码检查**：ESLint（最新配置）
- **包管理器**：pnpm

## 许可证

本项目采用MIT许可证。

## 致谢

感谢原作者 [flowtsohg](https://github.com/flowtsohg) 创建了这个优秀的项目。