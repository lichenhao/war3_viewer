// 测试代理资源加载功能

// DOM elements
const testCommonJButton = document.getElementById('test-common-j');
const testBlizzardJButton = document.getElementById('test-blizzard-j');
const testMdxModelButton = document.getElementById('test-mdx-model');
const testResultElement = document.getElementById('test-result');

// 更新结果显示
function updateResult(message) {
  testResultElement.textContent = message;
  console.log(message);
}

// 测试common.j加载
testCommonJButton.addEventListener('click', async () => {
  try {
    updateResult('Loading common.j through proxy...');
    const response = await fetch('/resources/scripts/common.j');
    if (response.ok) {
      const data = await response.text();
      updateResult(`Successfully loaded common.j through proxy\nData type: ${typeof data}\nData length: ${data.length}`);
    } else {
      updateResult(`Error loading common.j: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    updateResult(`Error loading common.j: ${error.message}`);
  }
});

// 测试blizzard.j加载
testBlizzardJButton.addEventListener('click', async () => {
  try {
    updateResult('Loading blizzard.j through proxy...');
    const response = await fetch('/resources/scripts/blizzard.j');
    if (response.ok) {
      const data = await response.text();
      updateResult(`Successfully loaded blizzard.j through proxy\nData type: ${typeof data}\nData length: ${data.length}`);
    } else {
      updateResult(`Error loading blizzard.j: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    updateResult(`Error loading blizzard.j: ${error.message}`);
  }
});

// 测试MDX模型加载
testMdxModelButton.addEventListener('click', async () => {
  try {
    updateResult('Loading test MDX model through proxy...');
    // 使用示例中的一个模型文件
    const response = await fetch('/resources/Buildings/Undead/Necropolis/Necropolis.mdx');
    if (response.ok) {
      const data = await response.arrayBuffer();
      updateResult(`Successfully loaded Necropolis.mdx through proxy\nData type: ${typeof data}\nData length: ${data.byteLength}`);
    } else {
      updateResult(`Error loading MDX model: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    updateResult(`Error loading MDX model: ${error.message}`);
  }
});

// 初始消息
updateResult('Proxy Resource Loader Test Ready\nClick a button to test loading resources through the Vite proxy with local caching.');
