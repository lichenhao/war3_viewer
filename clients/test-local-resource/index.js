import localResourceLoader from '../shared/localresource.js';

// DOM elements
const testCommonJButton = document.getElementById('test-common-j');
const testBlizzardJButton = document.getElementById('test-blizzard-j');
const testMdxModelButton = document.getElementById('test-mdx-model');
const testResultElement = document.getElementById('test-result');

// Update result display
function updateResult(message) {
  testResultElement.textContent = message;
  console.log(message);
}

// Test common.j loading
testCommonJButton.addEventListener('click', async () => {
  try {
    updateResult('Loading common.j...');
    const data = await localResourceLoader.load('scripts/common.j');
    updateResult(`Successfully loaded common.j\nData type: ${typeof data}\nData length: ${data.length || data.byteLength}`);
  } catch (error) {
    updateResult(`Error loading common.j: ${error.message}`);
  }
});

// Test blizzard.j loading
testBlizzardJButton.addEventListener('click', async () => {
  try {
    updateResult('Loading blizzard.j...');
    const data = await localResourceLoader.load('scripts/blizzard.j');
    updateResult(`Successfully loaded blizzard.j\nData type: ${typeof data}\nData length: ${data.length || data.byteLength}`);
  } catch (error) {
    updateResult(`Error loading blizzard.j: ${error.message}`);
  }
});

// Test MDX model loading
testMdxModelButton.addEventListener('click', async () => {
  try {
    updateResult('Loading test MDX model...');
    // Using a known MDX model from the example
    const data = await localResourceLoader.load('DungeonRock0.mdl');
    updateResult(`Successfully loaded DungeonRock0.mdl\nData type: ${typeof data}\nData length: ${data.byteLength}`);
  } catch (error) {
    updateResult(`Error loading MDX model: ${error.message}`);
  }
});

// Initial message
updateResult('Local Resource Loader Test Ready\nClick a button to test loading resources with local caching.');
