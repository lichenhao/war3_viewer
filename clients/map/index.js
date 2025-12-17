import { basename, extname } from "../../src/common/path";
import War3MapViewer from '../../src/viewer/handlers/w3x/viewer';
import { setupCamera } from "../shared/camera";

// 创建一个通过代理加载资源的函数
function proxyResourceLoader(src) {
  // 构造代理URL
  const proxyUrl = `/resources/${src}`;
  console.log(`Loading resource through proxy: ${proxyUrl}`);
  return proxyUrl;
}

const statusElement = document.getElementById('status');
statusElement.textContent = 'Initializing the viewer';

const canvas = document.getElementById('canvas');

// 使用代理资源加载器
const viewer = new War3MapViewer(canvas, proxyResourceLoader, true);

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

const meter = new FPSMeter({
  position: 'absolute',
  right: '10px',
  top: '10px',
  left: 'calc(100% - 130px)',
  theme: 'transparent',
  heat: 1,
  graph: 1
});

const cellsElement = document.getElementById('cells');
const instancesElement = document.getElementById('instances');
const particlesElement = document.getElementById('particles');

(function step() {
  requestAnimationFrame(step);

  viewer.updateAndRender();
  meter.tick();

  cellsElement.textContent = `Cells: ${viewer.visibleCells}`;
  instancesElement.textContent = `Instances: ${viewer.visibleInstances}`;
  particlesElement.textContent = `Particles: ${viewer.updatedParticles}`;
}());

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

        setupCamera(viewer.map.worldScene, { distance: 3000 });
      });

      reader.readAsArrayBuffer(file);
    }
  }
});
