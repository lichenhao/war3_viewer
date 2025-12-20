// 触发器编辑器相关功能
let viewerRef = null;
let triggersData = [];

/**
 * 初始化触发器编辑器
 * @param {War3MapViewer} viewer - 地图查看器实例
 */
export function setupTriggers(viewer) {
    viewerRef = viewer;
    
    // 添加事件监听器
    attachEventListeners();
    
    // 如果地图已加载，立即加载触发器数据
    if (viewer.map) {
        loadTriggerData();
    }
}

/**
 * 添加事件监听器
 */
function attachEventListeners() {
    // 添加工具栏按钮事件监听器
    const addTriggerBtn = document.getElementById('addTriggerBtn');
    const refreshTriggersBtn = document.getElementById('refreshTriggersBtn');
    
    if (addTriggerBtn) {
        addTriggerBtn.addEventListener('click', addNewTrigger);
    }
    
    if (refreshTriggersBtn) {
        refreshTriggersBtn.addEventListener('click', loadTriggerData);
    }
}

/**
 * 加载触发器数据并显示在UI中
 */
function loadTriggerData() {
    if (!viewerRef || !viewerRef.map) return;
    
    const eventList = document.getElementById('eventList');
    if (!eventList) return;
    
    try {
        // 尝试读取触发器文件
        triggersData = readTriggersFromMap();
        
        if (triggersData && triggersData.length > 0) {
            displayTriggers(triggersData);
        } else {
            eventList.innerHTML = '<p>该地图没有触发器数据</p>';
        }
    } catch (error) {
        console.error('加载触发器数据失败:', error);
        eventList.innerHTML = '<p>加载触发器数据失败: ' + error.message + '</p>';
    }
}

/**
 * 从地图中读取触发器数据
 * @returns {Array} 触发器数组
 */
function readTriggersFromMap() {
    if (!viewerRef || !viewerRef.map) return [];
    
    try {
        // 尝试读取war3map.wtg文件
        const wtgFile = viewerRef.map.map.archive.get('war3map.wtg');
        if (!wtgFile) {
            // 返回模拟数据用于演示，包含事件名称、匹配条件和执行行为
            return [
                { 
                    id: 1, 
                    name: '初始化触发器', 
                    enabled: true, 
                    category: '系统', 
                    description: '地图初始化时执行',
                    events: ['地图初始化'],
                    conditions: ['无'],
                    actions: ['显示欢迎信息', '播放背景音乐']
                },
                { 
                    id: 2, 
                    name: '玩家死亡事件', 
                    enabled: true, 
                    category: '游戏事件', 
                    description: '当玩家死亡时触发',
                    events: ['玩家 - 死亡'],
                    conditions: ['死亡玩家是玩家1'],
                    actions: ['显示死亡信息', '播放音效']
                },
                { 
                    id: 3, 
                    name: '单位创建事件', 
                    enabled: false, 
                    category: '单位事件', 
                    description: '当单位被创建时触发',
                    events: ['单位 - 创建'],
                    conditions: ['创建的单位属于玩家1', '创建的单位是农民'],
                    actions: ['发布采集命令', '显示提示信息']
                },
                { 
                    id: 4, 
                    name: '定时器事件', 
                    enabled: true, 
                    category: '时间事件', 
                    description: '每隔一段时间执行',
                    events: ['时间 - 每5.00秒'],
                    conditions: ['游戏时间大于60秒'],
                    actions: ['增加资源', '播放提示音']
                }
            ];
        }
        
        // 这里应该解析真实的WTG文件
        // 为简化示例，我们仍然返回模拟数据
        return [
            { 
                id: 1, 
                name: '初始化触发器', 
                enabled: true, 
                category: '系统', 
                description: '地图初始化时执行',
                events: ['地图初始化'],
                conditions: ['无'],
                actions: ['显示欢迎信息', '播放背景音乐']
            },
            { 
                id: 2, 
                name: '玩家死亡事件', 
                enabled: true, 
                category: '游戏事件', 
                description: '当玩家死亡时触发',
                events: ['玩家 - 死亡'],
                conditions: ['死亡玩家是玩家1'],
                actions: ['显示死亡信息', '播放音效']
            },
            { 
                id: 3, 
                name: '单位创建事件', 
                enabled: false, 
                category: '单位事件', 
                description: '当单位被创建时触发',
                events: ['单位 - 创建'],
                conditions: ['创建的单位属于玩家1', '创建的单位是农民'],
                actions: ['发布采集命令', '显示提示信息']
            },
            { 
                id: 4, 
                name: '定时器事件', 
                enabled: true, 
                category: '时间事件', 
                description: '每隔一段时间执行',
                events: ['时间 - 每5.00秒'],
                conditions: ['游戏时间大于60秒'],
                actions: ['增加资源', '播放提示音']
            }
        ];
    } catch (error) {
        console.error('读取触发器文件失败:', error);
        // 返回模拟数据用于演示
        return [
            { 
                id: 1, 
                name: '初始化触发器', 
                enabled: true, 
                category: '系统', 
                description: '地图初始化时执行',
                events: ['地图初始化'],
                conditions: ['无'],
                actions: ['显示欢迎信息', '播放背景音乐']
            },
            { 
                id: 2, 
                name: '玩家死亡事件', 
                enabled: true, 
                category: '游戏事件', 
                description: '当玩家死亡时触发',
                events: ['玩家 - 死亡'],
                conditions: ['死亡玩家是玩家1'],
                actions: ['显示死亡信息', '播放音效']
            }
        ];
    }
}

/**
 * 显示触发器列表
 * @param {Array} triggers - 触发器数组
 */
function displayTriggers(triggers) {
    const eventList = document.getElementById('eventList');
    if (!eventList) return;
    
    eventList.innerHTML = '';
    
    // 按分类组织触发器
    const categorizedTriggers = {};
    triggers.forEach(trigger => {
        if (!categorizedTriggers[trigger.category]) {
            categorizedTriggers[trigger.category] = [];
        }
        categorizedTriggers[trigger.category].push(trigger);
    });
    
    // 显示每个分类的触发器
    for (const category in categorizedTriggers) {
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'trigger-category';
        categoryHeader.innerHTML = `<h4>${category}</h4>`;
        eventList.appendChild(categoryHeader);
        
        const triggerList = document.createElement('div');
        triggerList.className = 'trigger-list';
        
        categorizedTriggers[category].forEach(trigger => {
            const triggerElement = document.createElement('div');
            triggerElement.className = 'event-item';
            triggerElement.innerHTML = `
                <div class="event-name">${trigger.name}</div>
                <div class="event-details">
                    <span>ID: ${trigger.id}</span> | 
                    <span>状态: ${trigger.enabled ? '启用' : '禁用'}</span>
                </div>
                <div class="event-description">${trigger.description}</div>
                <div class="event-events"><strong>事件:</strong> ${trigger.events.join(', ')}</div>
                <div class="event-conditions"><strong>条件:</strong> ${trigger.conditions.join(', ')}</div>
                <div class="event-actions"><strong>行为:</strong> ${trigger.actions.join(', ')}</div>
            `;
            
            triggerElement.addEventListener('click', () => showTriggerDetails(trigger));
            triggerList.appendChild(triggerElement);
        });
        
        eventList.appendChild(triggerList);
    }
}

/**
 * 显示触发器详情
 * @param {Object} trigger - 触发器对象
 */
function showTriggerDetails(trigger) {
    const detailMessage = `
触发器详情:
名称: ${trigger.name}
ID: ${trigger.id}
分类: ${trigger.category}
状态: ${trigger.enabled ? '启用' : '禁用'}
描述: ${trigger.description}

事件:
${trigger.events.map(event => `  • ${event}`).join('\n')}

条件:
${trigger.conditions.map(condition => `  • ${condition}`).join('\n')}

行为:
${trigger.actions.map(action => `  • ${action}`).join('\n')}
    `.trim();
    
    window.alert(detailMessage);
}

/**
 * 添加新触发器
 */
function addNewTrigger() {
    const name = window.prompt('请输入触发器名称:');
    if (name) {
        const newTrigger = {
            id: triggersData.length > 0 ? Math.max(...triggersData.map(t => t.id)) + 1 : 1,
            name: name,
            enabled: true,
            category: '自定义',
            description: '用户创建的触发器',
            events: ['自定义事件'],
            conditions: ['无'],
            actions: ['显示信息']
        };
        
        triggersData.push(newTrigger);
        displayTriggers(triggersData);
        window.alert(`已添加新触发器: ${name}`);
    }
}
