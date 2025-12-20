import { OBJECT_CLASSIFICATIONS, FACTIONS } from '../../src/war3/objectclassification.js';
let GlobalCanvas = null;
/**
 * 初始化图层控制面板
 * @param {War3MapViewer} viewer - 地图查看器实例
 */
export function setupLayers(viewer, c) {
    console.log('图层控制面板已初始化', viewer);
    GlobalCanvas = c;
    // 获取图层面板元素
    const layerPanel = document.getElementById('layerPanel');
    
    // 创建筛选表单
    createFilterForm(layerPanel);
    
    // 创建物体列表
    createObjectList(layerPanel);
    
    // 加载物体数据
    loadMapObjects(viewer);
    
    // 初始化抽屉事件监听器
    initDrawerEvents();
}

/**
 * 初始化抽屉事件监听器
 */
function initDrawerEvents() {
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
 * 打开属性面板抽屉
 */
function openPropertyDrawer() {
    const drawer = document.getElementById('propertyDrawer');
    const overlay = document.getElementById('propertyDrawerOverlay');
    
    if (drawer && overlay) {
        overlay.style.display = 'block';
        setTimeout(() => {
            drawer.classList.add('open');
        }, 10);
    }
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

/**
 * 创建筛选表单
 * @param {HTMLElement} container - 容器元素
 */
function createFilterForm(container) {
    // 创建表单容器
    const formContainer = document.createElement('div');
    formContainer.className = 'filter-form';
    
    // 添加标题
    const title = document.createElement('h4');
    title.textContent = '筛选条件';
    formContainer.appendChild(title);
    
    // 创建物体类型筛选
    const typeFilter = createTypeFilter();
    formContainer.appendChild(typeFilter);
    
    // 创建阵营筛选
    const factionFilter = createFactionFilter();
    formContainer.appendChild(factionFilter);
    
    // 添加到容器
    container.appendChild(formContainer);
}

/**
 * 创建物体类型筛选控件
 * @returns {HTMLElement}
 */
function createTypeFilter() {
    const div = document.createElement('div');
    div.className = 'filter-group';
    
    const label = document.createElement('label');
    label.textContent = '物体类型:';
    div.appendChild(label);
    
    const select = document.createElement('select');
    select.id = 'objectTypeFilter';
    
    // 添加"全部"选项
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = '全部类型';
    select.appendChild(allOption);
    
    // 添加各物体类型选项
    OBJECT_CLASSIFICATIONS.forEach(classification => {
        const option = document.createElement('option');
        option.value = classification.categoryId;
        option.textContent = classification.categoryName;
        select.appendChild(option);
    });
    
    div.appendChild(select);
    
    // 添加事件监听器
    select.addEventListener('change', handleFilterChange);
    
    return div;
}

/**
 * 创建阵营筛选控件
 * @returns {HTMLElement}
 */
function createFactionFilter() {
    const div = document.createElement('div');
    div.className = 'filter-group';
    
    const label = document.createElement('label');
    label.textContent = '阵营:';
    div.appendChild(label);
    
    const select = document.createElement('select');
    select.id = 'factionFilter';
    
    // 添加"全部"选项
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = '全部阵营';
    select.appendChild(allOption);
    
    // 添加各阵营选项
    FACTIONS.forEach(faction => {
        const option = document.createElement('option');
        option.value = faction.faction;
        option.textContent = faction.factionName;
        select.appendChild(option);
    });
    
    div.appendChild(select);
    
    // 添加事件监听器
    select.addEventListener('change', handleFilterChange);
    
    return div;
}

/**
 * 处理筛选条件变化
 */
function handleFilterChange() {
    // TODO: 实现筛选逻辑
    console.log('筛选条件已更改');
    
    // 获取当前筛选条件
    const typeFilter = document.getElementById('objectTypeFilter');
    const factionFilter = document.getElementById('factionFilter');
    
    const selectedType = typeFilter.value;
    const selectedFaction = factionFilter.value;
    
    // 应用筛选
    applyFilters(selectedType, selectedFaction);
}

/**
 * 应用筛选条件
 * @param {string} objectType - 物体类型
 * @param {string} faction - 阵营
 */
function applyFilters(objectType, faction) {
    // TODO: 实现具体的筛选逻辑
    console.log('应用筛选条件:', objectType, faction);
    
    // 获取所有列表项
    const listItems = document.querySelectorAll('#objectList li');
    
    listItems.forEach(item => {
        const itemObjectType = item.dataset.objectType;
        const itemFaction = item.dataset.faction;
        
        let showItem = true;
        
        // 检查物体类型筛选
        if (objectType !== 'all' && itemObjectType !== objectType) {
            showItem = false;
        }
        
        // 检查阵营筛选
        if (faction !== 'all' && itemFaction !== faction) {
            showItem = false;
        }
        
        // 显示或隐藏项
        item.style.display = showItem ? '' : 'none';
    });
}

/**
 * 创建物体列表
 * @param {HTMLElement} container - 容器元素
 */
function createObjectList(container) {
    // 创建列表容器
    const listContainer = document.createElement('div');
    listContainer.className = 'object-list';
    
    // 添加标题
    const title = document.createElement('h4');
    title.textContent = '物体列表';
    listContainer.appendChild(title);
    
    // 创建列表
    const list = document.createElement('ul');
    list.id = 'objectList';
    listContainer.appendChild(list);
    
    // 添加到容器
    container.appendChild(listContainer);
}

/**
 * 加载地图物体数据
 * @param {War3MapViewer} viewer - 地图查看器实例
 */
function loadMapObjects(viewer) {
    if (!viewer.map) {
        console.warn('地图未加载');
        return;
    }
    
    // 清空现有列表
    const objectList = document.getElementById('objectList');
    if (!objectList) {
        console.warn('无法找到物体列表容器');
        return;
    }
    
    objectList.innerHTML = '';
    
    // 添加装饰物
    if (viewer.map.doodads && viewer.map.doodads.length > 0) {
        viewer.map.doodads.forEach((doodad, index) => {
            if (doodad && doodad.row) {
                const listItem = createObjectListItem({
                    id: doodad.row.id || `doodad-${index}`,
                    name: doodad.row && typeof doodad.row.string === 'function' ? doodad.row.string('name') : `装饰物-${index}`,
                    type: 'Doodad',
                    faction: null,
                    position: doodad.instance ? doodad.instance.worldLocation : [0, 0, 0],
                    object: doodad // 保存对象引用
                });
                objectList.appendChild(listItem);
            }
        });
    }
    
    // 添加单位和建筑
    if (viewer.map.units && viewer.map.units.length > 0) {
        viewer.map.units.forEach((unit, index) => {
            if (unit && unit.row) {
                const listItem = createObjectListItem({
                    id: unit.row.id || `unit-${index}`,
                    name: unit.row && typeof unit.row.string === 'function' ? unit.row.string('name') : `单位-${index}`,
                    type: unit.row.number && unit.row.number('isBuilding') ? 'Building' : 'NormalUnit',
                    faction: null, // TODO: 根据ID前缀确定阵营
                    position: unit.instance ? unit.instance.worldLocation : [0, 0, 0],
                    object: unit // 保存对象引用
                });
                objectList.appendChild(listItem);
            }
        });
    }
    
    console.log(`加载了 ${objectList.children.length} 个物体`);
}

/**
 * 创建物体列表项
 * @param {Object} objectData - 物体数据
 * @returns {HTMLElement}
 */
function createObjectListItem(objectData) {
    const li = document.createElement('li');
    li.className = 'object-item';
    
    // 设置数据属性用于筛选
    li.dataset.objectType = objectData.type;
    if (objectData.faction) {
        li.dataset.faction = objectData.faction;
    }
    
    // 创建显示内容
    const nameSpan = document.createElement('span');
    nameSpan.className = 'object-name';
    nameSpan.textContent = objectData.name || objectData.id;
    
    const idSpan = document.createElement('span');
    idSpan.className = 'object-id';
    idSpan.textContent = `(${objectData.id})`;
    
    const positionSpan = document.createElement('span');
    positionSpan.className = 'object-position';
    // 确保position存在且为数组后再处理
    let positionText = '[0, 0, 0]';
    if (objectData.position && Array.isArray(objectData.position)) {
        positionText = `[${objectData.position.map(p => typeof p === 'number' ? p.toFixed(2) : '0').join(', ')}]`;
    }
    positionSpan.textContent = positionText;
    
    // 添加到列表项
    li.appendChild(nameSpan);
    li.appendChild(idSpan);
    li.appendChild(positionSpan);
    
    // 添加点击事件
    li.addEventListener('click', () => {
        console.log('选中物体:', objectData);
        // 聚焦到物体
        focusOnObject(objectData);
        // 显示物体属性
        showObjectProperties(objectData);
    });
    
    return li;
}

/**
 * 聚焦到指定物体
 * @param {Object} objectData - 物体数据
 */
function focusOnObject(objectData) {
    // 获取物体位置
    const [x, y, z] = objectData.position;
    GlobalCanvas.moveTo(x,y,z);
    
    console.log(`聚焦到物体: ${objectData.name || objectData.id} 位置: [${x}, ${y}, ${z}]`);
}

/**
 * 显示物体属性
 * @param {Object} objectData - 物体数据
 */
function showObjectProperties(objectData) {
    // 获取属性抽屉内容容器
    const propertyDrawerContent = document.getElementById('propertyDrawerContent');
    if (!propertyDrawerContent) {
        console.warn('无法找到属性抽屉内容容器');
        // 如果找不到抽屉容器，则延迟一段时间后重试
        setTimeout(() => showObjectProperties(objectData), 500);
        return;
    }
    
    // 清空现有内容
    propertyDrawerContent.innerHTML = '';
    
    // 添加标题
    const title = document.createElement('h3');
    title.textContent = '对象属性';
    propertyDrawerContent.appendChild(title);
    
    // 创建属性容器
    const propertiesContainer = document.createElement('div');
    propertiesContainer.className = 'properties-container';
    
    // 添加基本属性
    addProperty(propertiesContainer, 'ID', objectData.id || 'N/A');
    addProperty(propertiesContainer, '名称', objectData.name || 'N/A');
    addProperty(propertiesContainer, '类型', objectData.type || 'N/A');
    
    // 添加位置属性
    if (objectData.position && Array.isArray(objectData.position)) {
        addProperty(propertiesContainer, '位置', `[${objectData.position.map(p => typeof p === 'number' ? p.toFixed(2) : '0').join(', ')}]`);
    } else {
        addProperty(propertiesContainer, '位置', 'N/A');
    }
    
    // 如果有阵营信息，添加阵营属性
    if (objectData.faction) {
        addProperty(propertiesContainer, '阵营', objectData.faction);
    }
    
    // 如果有物体对象引用，尝试显示更多属性
    if (objectData.object) {
        const obj = objectData.object;
        
        // 如果是单位对象
        if (obj.row) {
            const row = obj.row;
            
            // 显示一些常见的单位属性
            if (typeof row.number === 'function') {
                try {
                    addProperty(propertiesContainer, '生命值', row.number('hp') || 'N/A');
                    addProperty(propertiesContainer, '魔法值', row.number('mana') || 'N/A');
                    addProperty(propertiesContainer, '等级', row.number('level') || 'N/A');
                } catch (e) {
                    console.warn('无法读取单位数值属性:', e);
                }
            }
            
            if (typeof row.string === 'function') {
                try {
                    addProperty(propertiesContainer, '描述', row.string('description') || 'N/A');
                } catch (e) {
                    console.warn('无法读取单位字符串属性:', e);
                }
            }
        }
        
        // 如果有实例对象
        if (obj.instance) {
            const instance = obj.instance;
            
            // 显示一些常见的实例属性
            if (instance.scale) {
                // 检查scale是否为数组
                if (Array.isArray(instance.scale)) {
                    addProperty(propertiesContainer, '缩放', `[${instance.scale.map(s => s.toFixed(2)).join(', ')}]`);
                } else if (typeof instance.scale === 'number') {
                    // 如果scale是单个数字
                    addProperty(propertiesContainer, '缩放', instance.scale.toFixed(2));
                } else {
                    // 其他情况显示原始值
                    addProperty(propertiesContainer, '缩放', String(instance.scale));
                }
            }
            
            if (instance.rotation) {
                // 检查rotation是否为数组
                if (Array.isArray(instance.rotation)) {
                    addProperty(propertiesContainer, '旋转', `[${instance.rotation.map(r => r.toFixed(2)).join(', ')}]`);
                } else if (typeof instance.rotation === 'number') {
                    // 如果rotation是单个数字
                    addProperty(propertiesContainer, '旋转', instance.rotation.toFixed(2));
                } else {
                    // 其他情况显示原始值
                    addProperty(propertiesContainer, '旋转', String(instance.rotation));
                }
            }
        }
    }
    
    // 添加到属性抽屉
    propertyDrawerContent.appendChild(propertiesContainer);
    
    // 打开属性抽屉
    openPropertyDrawer();
}

/**
 * 添加属性到容器
 * @param {HTMLElement} container - 容器元素
 * @param {string} name - 属性名称
 * @param {string} value - 属性值
 */
function addProperty(container, name, value) {
    const propertyDiv = document.createElement('div');
    propertyDiv.className = 'property-item';
    
    const nameLabel = document.createElement('span');
    nameLabel.className = 'property-name';
    nameLabel.textContent = `${name}:`;
    
    const valueLabel = document.createElement('span');
    valueLabel.className = 'property-value';
    valueLabel.textContent = value;
    
    propertyDiv.appendChild(nameLabel);
    propertyDiv.appendChild(valueLabel);
    
    container.appendChild(propertyDiv);
}
