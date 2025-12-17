// 测试并发资源加载功能

// DOM elements
const testConcurrentButton = document.getElementById('test-concurrent');
const testSequentialButton = document.getElementById('test-sequential');
const testResultElement = document.getElementById('test-result');
const progressFillElement = document.getElementById('progress-fill');

// 更新结果显示
function updateResult(message) {
  testResultElement.textContent += message + '\n';
  testResultElement.scrollTop = testResultElement.scrollHeight;
  console.log(message);
}

// 更新进度条
function updateProgress(percent) {
  progressFillElement.style.width = `${percent}%`;
}

// 测试资源列表
const testResources = [
  'scripts/common.j',
  'scripts/blizzard.j',
  'Buildings/Undead/Necropolis/Necropolis.mdx',
  'Doodads/Terrain/CliffDoodad/CliffDoodad0.mdx',
  'Doodads/Terrain/CliffDoodad/CliffDoodad1.mdx',
  'Doodads/Terrain/CliffDoodad/CliffDoodad2.mdx',
  'Doodads/Terrain/CliffDoodad/CliffDoodad3.mdx',
  'Doodads/Terrain/CliffDoodad/CliffDoodad4.mdx',
  'Doodads/Terrain/CliffDoodad/CliffDoodad5.mdx',
  'Doodads/Terrain/CliffDoodad/CliffDoodad6.mdx'
];

// 并发加载测试
async function testConcurrentLoading() {
  updateResult('Starting concurrent loading test...');
  updateProgress(0);
  
  const startTime = Date.now();
  
  try {
    // 并发加载所有资源
    const promises = testResources.map((resource, index) => {
      return fetch(`/resources/${resource}`)
        .then(response => {
          updateProgress(((index + 1) / testResources.length) * 100);
          return response;
        })
        .catch(error => {
          updateResult(`Error loading ${resource}: ${error.message}`);
          throw error;
        });
    });
    
    // 等待所有资源加载完成
    const responses = await Promise.all(promises);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    updateResult(`Concurrent loading completed in ${duration}ms`);
    updateResult(`Loaded ${responses.length} resources`);
    
    // 显示每个资源的信息
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      const resource = testResources[i];
      updateResult(`  ${resource}: ${response.status} (${response.headers.get('content-length') || 'unknown'} bytes)`);
    }
  } catch (error) {
    updateResult(`Concurrent loading failed: ${error.message}`);
  }
}

// 顺序加载测试
async function testSequentialLoading() {
  updateResult('Starting sequential loading test...');
  updateProgress(0);
  
  const startTime = Date.now();
  const responses = [];
  
  try {
    // 顺序加载所有资源
    for (let i = 0; i < testResources.length; i++) {
      const resource = testResources[i];
      updateResult(`Loading ${resource}...`);
      
      const response = await fetch(`/resources/${resource}`);
      responses.push(response);
      
      updateProgress(((i + 1) / testResources.length) * 100);
      updateResult(`  ${resource}: ${response.status} (${response.headers.get('content-length') || 'unknown'} bytes)`);
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    updateResult(`Sequential loading completed in ${duration}ms`);
    updateResult(`Loaded ${responses.length} resources`);
  } catch (error) {
    updateResult(`Sequential loading failed: ${error.message}`);
  }
}

// 绑定事件监听器
testConcurrentButton.addEventListener('click', testConcurrentLoading);
testSequentialButton.addEventListener('click', testSequentialLoading);

// 初始消息
updateResult('Concurrent Resource Loading Test Ready\nClick a button to test loading resources concurrently or sequentially.');
