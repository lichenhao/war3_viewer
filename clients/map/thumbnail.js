export const WIDTH = 150;
export const HEIGHT = 150;
export const GRID_SIZE = 128;
const cvs = document.getElementById('thumbnailCanvas');
const viewport = document.getElementById('thumbnailViewport');

// 存储缩略图的比例尺，用于坐标转换
let thumbnailScaleX = 1;
let thumbnailScaleY = 1;

let GlobalCamera = null;

export function setupThumbnail(viewer, cameraController) {
    cvs.width = WIDTH;
    cvs.height = HEIGHT;
    GlobalCamera = cameraController;
    console.log(viewer, cameraController);
    // 创建缩略图
    createThumbnail(viewer);
    
    let isDragging = false;
    cvs.addEventListener('mousedown', function (e) {
        isDragging = true;
        update(e);
        e.preventDefault();
    });
    cvs.addEventListener('mousemove', function (e) {
        if (isDragging) {
            update(e);
        };
        e.preventDefault();
    });
    cvs.addEventListener('mouseup', function (e) {
        isDragging = false;
        update(e);
        e.preventDefault();
    });
    cvs.addEventListener('click', function (e) {
        update(e);
        e.preventDefault();
    });
    cvs.addEventListener('dblclick', function (e) {
        const pos = window.prompt('input the position :');
        if (pos.match(/\d+,\d+/)) {
            // 解析输入的坐标
            const coords = pos.split(',').map(parseFloat);
            // 使用新的 moveTo 方法直接移动到指定坐标
            moveTo(coords[0], coords[1]);
        }
        e.preventDefault();
    });
}

function createThumbnail(viewer) {
  const ctx = cvs.getContext('2d');
  // 1. 获取地图尺寸（格子数）
  const mapSize = viewer.map.mapSize;
  const mapGridWidth = mapSize[0];
  const mapGridHeight = mapSize[1];
  
  // 2. 基于地图尺寸计算世界尺寸（每个格子128单位）
  const mapWorldWidth = mapGridWidth * GRID_SIZE;
  const mapWorldHeight = mapGridHeight * GRID_SIZE;
  
  // 4. 计算地图的实际边界（世界坐标）
  // 地图中心是 (0,0)，所以左下角是 (-mapWorldWidth/2, -mapWorldHeight/2)
  const mapMinX = -mapWorldWidth/2;
  const mapMinY = -mapWorldHeight/2;
  
  // 5. 换算缩略图的比例尺（地图世界尺寸 / 缩略图尺寸）
  thumbnailScaleX = cvs.width / mapWorldWidth;
  thumbnailScaleY = cvs.height / mapWorldHeight;
  
  // 获取地形数据
  const corners = viewer.map.corners;
  const rows = corners.length;
  const cols = rows > 0 ? corners[0].length : 0;
  
  if (rows === 0 || cols === 0) return;
  
  // 清空画布
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  
  // 找到高度范围用于颜色映射
  let minHeight = Infinity;
  let maxHeight = -Infinity;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const height = corners[y][x].groundHeight;
      minHeight = Math.min(minHeight, height);
      maxHeight = Math.max(maxHeight, height);
    }
  }
  
  const heightRange = maxHeight - minHeight || 1;
  
  // 绘制地形高度图
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const corner = corners[y][x];
      const height = corner.groundHeight;
      const water = corner.water;
      
      // 根据高度计算颜色
      const normalizedHeight = (height - minHeight) / heightRange;
      
      // 水域使用蓝色，陆地使用绿色到棕色的渐变
      if (water) {
        const blueValue = Math.floor(100 + normalizedHeight * 155);
        ctx.fillStyle = `rgb(0, 0, ${blueValue})`;
      } else {
        const greenValue = Math.floor(100 + (1 - normalizedHeight) * 155);
        const redValue = Math.floor(50 + normalizedHeight * 205);
        ctx.fillStyle = `rgb(${redValue}, ${greenValue}, 0)`;
      }
      
      // 世界坐标转缩略图坐标
      // 地图中心 (0,0) 对应缩略图中心 (WIDTH/2, HEIGHT/2)
      // 由于地图需要旋转-90度，所以需要交换x和y坐标并调整符号
      const worldX = x * GRID_SIZE + mapMinX;
      const worldY = y * GRID_SIZE + mapMinY;
      // 旋转-90度: newX = y, newY = -x
      const rotatedX = worldY;
      const rotatedY = -worldX;
      const posX = WIDTH/2 + (rotatedX / mapWorldWidth) * WIDTH;
      const posY = HEIGHT/2 - (rotatedY / mapWorldHeight) * HEIGHT;
      
      // 绘制像素块
      const pixelSize = Math.max(1, thumbnailScaleX * GRID_SIZE);
      ctx.fillRect(posX, posY, pixelSize, pixelSize);
    }
  }
  
  // 绘制悬崖边缘
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = Math.max(1, thumbnailScaleY * GRID_SIZE / 4);
  
  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      // 检查是否是悬崖
      if (viewer.map.isCliff(x, y)) {
        // 世界坐标转缩略图坐标
        // 地图中心 (0,0) 对应缩略图中心 (WIDTH/2, HEIGHT/2)
        const worldX = x * GRID_SIZE + mapMinX;
        const worldY = y * GRID_SIZE + mapMinY;
        // 旋转-90度: newX = y, newY = -x
        const rotatedX = worldY;
        const rotatedY = -worldX;
        const posX = WIDTH/2 + (rotatedX / mapWorldWidth) * WIDTH;
        const posY = HEIGHT/2 - (rotatedY / mapWorldHeight) * HEIGHT;
        const size = GRID_SIZE * (WIDTH / mapWorldWidth);
        ctx.strokeRect(posX, posY, size, size);

      }
    }
  }
  
  // 标记地图中心点(0,0)位置
  const centerX = WIDTH / 2;
  const centerY = HEIGHT / 2;
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
  ctx.fill();

  // 保存 viewer 引用以便后续使用
  window.viewer = viewer;
  updateViewportPosition(viewer);
}

// 更新缩略图视口位置
export function updateViewportPosition(viewer) {
    if (!GlobalCamera) return;
    
    // 获取地图信息
    if (!viewer || !viewer.map) return;
    const mapSize = viewer.map.mapSize;
    
    // 计算地图的实际边界（世界坐标）
    const mapWorldWidth = mapSize[0] * GRID_SIZE;
    const mapWorldHeight = mapSize[1] * GRID_SIZE;
    
    // 使用相机的目标位置作为地图上的实际渲染坐标
    const targetX = GlobalCamera.target[0];
    const targetY = GlobalCamera.target[1];    
    
    // 将世界坐标转换为缩略图坐标
    // 地图中心 (0,0) 对应缩略图中心 (WIDTH/2, HEIGHT/2)
    // 由于地图需要旋转-90度，所以需要交换x和y坐标并调整符号
    // 旋转-90度: newX = y, newY = -x
    const rotatedX = targetY;
    const rotatedY = -targetX;
    const thumbX = WIDTH/2 + (rotatedX / mapWorldWidth) * WIDTH;
    const thumbY = HEIGHT/2 - (rotatedY / mapWorldHeight) * HEIGHT;
    
    // 设置视口位置（视口大小可以根据需要调整）
    const viewportSize = 30; // 视口大小
    
    // 更新视口元素的样式（使用正确的坐标计算）
    viewport.style.left = `${thumbX - viewportSize/2}px`;
    viewport.style.top = `${thumbY - viewportSize/2}px`;
    viewport.style.width = `${viewportSize}px`;
    viewport.style.height = `${viewportSize}px`;
    
    // 显示视口
    viewport.style.display = 'block';
    // 如果页面上有坐标显示元素，可以更新其内容
    const coordsElement = document.getElementById('coordinates');
    coordsElement.textContent = `坐标: (${targetX.toFixed(2)}, ${targetY.toFixed(2)}, ${GlobalCamera.target[2].toFixed(2)})`;
}

/**
 * 直接移动到指定的世界坐标位置
 * @param {number} x - 世界坐标X
 * @param {number} y - 世界坐标Y
 * @param {number} z - 世界坐标Z (可选，默认为当前高度)
 */
export function moveTo(x, y, z) {
    if (!GlobalCamera) return;
    GlobalCamera.moveTo(x, y, z);
}

function update(e) {
    if (!GlobalCamera) return;
    if (!e) return;
    
    // 通过缩略图坐标计算世界坐标
    // 获取地图信息
    if (!window.viewer || !window.viewer.map) return;
    const mapSize = window.viewer.map.mapSize;
    
    // 计算地图的实际边界（世界坐标）
    const mapWorldWidth = mapSize[0] * GRID_SIZE;
    const mapWorldHeight = mapSize[1] * GRID_SIZE;
    
    // 将缩略图坐标转换为世界坐标
    // 地图中心 (0,0) 对应缩略图中心 (WIDTH/2, HEIGHT/2)
    // 由于地图需要旋转-90度，所以需要反向旋转坐标
    // 旋转90度(反向): newX = -y, newY = x
    const relativeX = (e.layerX - WIDTH/2) / WIDTH * mapWorldWidth;
    const relativeY = -(e.layerY - HEIGHT/2) / HEIGHT * mapWorldHeight;
    const worldX = -relativeY;
    const worldY = relativeX;
    
    // 使用新的 moveTo 方法直接移动到指定坐标
    moveTo(worldX, worldY);
}
