import { basename, extname } from "../../src/common/path";
import War3MapViewer from '../../src/viewer/handlers/w3x/viewer';
import { setupCamera } from "../shared/camera";
import localOrHive from "../shared/localorhive";
import { setupThumbnail, updateViewportPosition } from "./thumbnail.js";
import { setupLayers } from "./layers.js";
import { setupTriggers } from "./events.js";
import "../thirdparty/fpsmeter.min.js";

const statusElement = document.getElementById('status');
statusElement.textContent = 'Initializing the viewer';

const canvas = document.getElementById('canvas');

// true because the Reforged Hive API is used in localOrHive.
const viewer = new War3MapViewer(canvas, localOrHive, true);
window.viewer = viewer; // 将viewer暴露到全局作用域以便测试

const thingsLoading = [];

function updateStatus() {
  if (thingsLoading.length) {
    statusElement.textContent = `Loading ${thingsLoading.join(', ')}`;
  } else {
    statusElement.textContent = '';
  }
}

for (const key of viewer.promiseMap.keys()) {
  thingsLoading.push(basename(key));
}

updateStatus();

viewer.on('loadstart', ({ fetchUrl }) => {
  thingsLoading.push(basename(fetchUrl));
  updateStatus();
});

viewer.on('loadend', ({ fetchUrl }) => {
  const file = basename(fetchUrl);
  const index = thingsLoading.indexOf(file);

  if (index !== -1) {
    thingsLoading.splice(index, 1);
    updateStatus();
  }
});

viewer.on('idle', function () {
  if (!viewer.map) return;
  
  // 地图加载完毕了，初始化相机控制器
  const c = setupCamera(viewer.map.worldScene, { distance: 3000 });
  setupThumbnail(viewer, c);
  setupLayers(viewer, c);
  setupTriggers(viewer, c);
  
  // 显示插件容器
  document.getElementById('togglePluginContainer').style.display = 'block';
  document.getElementById('pluginContainer').style.display = 'block';
});

const meter = new FPSMeter({
  position: 'absolute',
  left: '10px',
  top: '10px',
  // left: 'calc(100% - 130px)',
  theme: 'transparent',
  heat: 1,
  graph: 1
});

(function step() {
  requestAnimationFrame(step);

  viewer.updateAndRender();
  meter.tick();
  
  // 获取并显示当前渲染坐标（使用相机目标位置而非相机位置）
  if (viewer.map && viewer.map.worldScene && viewer.map.worldScene.camera) {
    updateViewportPosition(viewer);
  }
}());

// 插件面板Tab切换功能
document.addEventListener('DOMContentLoaded', function() {
  // Tab切换逻辑
  const tabs = document.querySelectorAll('.plugin-tab');
  const panels = document.querySelectorAll('.plugin-panel');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetPanelId = this.getAttribute('data-target');
      
      // 更新激活的tab
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // 显示对应的内容面板
      panels.forEach(panel => {
        if (panel.id === targetPanelId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
  
  // 插件容器显示/隐藏切换
  const toggleButton = document.getElementById('togglePluginContainer');
  const pluginContainer = document.getElementById('pluginContainer');
  
  toggleButton.addEventListener('click', function() {
    if (pluginContainer.style.display === 'none' || pluginContainer.style.display === '') {
      pluginContainer.style.display = 'block';
    } else {
      pluginContainer.style.display = 'none';
    }
  });
  
  // 点击插件容器外部隐藏插件容器
  document.addEventListener('click', function(event) {
    if (!pluginContainer.contains(event.target) && 
        event.target !== toggleButton && 
        pluginContainer.style.display === 'block') {
      pluginContainer.style.display = 'none';
    }
  });
  
  // 初始化抽屉关闭按钮事件监听器
  initDrawerCloseEvents();
});

/**
 * 初始化抽屉关闭按钮事件监听器
 */
function initDrawerCloseEvents() {
  // 属性面板抽屉关闭按钮
  const propertyDrawerClose = document.getElementById('propertyDrawerClose');
  const propertyDrawerOverlay = document.getElementById('propertyDrawerOverlay');
  
  if (propertyDrawerClose) {
    propertyDrawerClose.addEventListener('click', closePropertyDrawer);
  }
  
  if (propertyDrawerOverlay) {
    propertyDrawerOverlay.addEventListener('click', closePropertyDrawer);
  }
  
  // 事件面板抽屉关闭按钮已在events.js中处理
}

/**
 * 关闭属性面板抽屉
 */
function closePropertyDrawer() {
  const drawer = document.getElementById('propertyDrawer');
  const overlay = document.getElementById('propertyDrawerOverlay');
  
  if (drawer) {
    drawer.classList.remove('open');
    setTimeout(() => {
      if (overlay) {
        overlay.style.display = 'none';
      }
    }, 300);
  }
}

document.addEventListener('dragover', e => {
  e.preventDefault();
});

document.addEventListener('dragend', e => {
  e.preventDefault();
});

document.addEventListener('drop', e => {
  e.preventDefault();

  if (viewer.loadedBaseFiles) {
    const file = e.dataTransfer.files[0];
    const name = file.name;
    const ext = extname(name);

    if (ext === '.w3m' || ext === '.w3x') {
      const reader = new FileReader();

      reader.addEventListener('loadend', e => {
        viewer.loadMap(e.target.result);
      });

      reader.readAsArrayBuffer(file);
    }
  }
});
