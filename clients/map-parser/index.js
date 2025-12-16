import { War3MapParser } from './parser.js';

// DOM elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const statusElement = document.getElementById('status');
const outputElement = document.getElementById('output');
const jsonViewerElement = document.getElementById('json-viewer');

// Create parser instance
const parser = new War3MapParser();

// Event listeners for drag and drop
dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('drag-over');
  
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
});

// Event listener for file input
fileInput.addEventListener('change', (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
});

/**
 * Handle file processing
 * @param {File} file - The uploaded file
 */
async function handleFile(file) {
  // Check file extension
  const extension = file.name.split('.').pop().toLowerCase();
  if (extension !== 'w3x' && extension !== 'w3m') {
    updateStatus('Invalid file type. Please upload a .w3x or .w3m file.', 'error');
    return;
  }

  updateStatus(`Processing ${file.name}...`, 'info');
  
  try {
    // Read file as ArrayBuffer
    const buffer = await readFileAsArrayBuffer(file);
    
    // Parse the map
    const parsedData = parser.parse(buffer);
    
    // Display the parsed data
    displayParsedData(parsedData);
    
    updateStatus(`Successfully parsed ${file.name}`, 'success');
  } catch (error) {
    console.error('Error processing file:', error);
    updateStatus(`Error: ${error.message}`, 'error');
    outputElement.textContent = `Error: ${error.message}`;
  }
}

/**
 * Read file as ArrayBuffer
 * @param {File} file - The file to read
 * @returns {Promise<ArrayBuffer>}
 */
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Update status message
 * @param {string} message - The status message
 * @param {string} type - The message type (info, success, error)
 */
function updateStatus(message, type = 'info') {
  statusElement.textContent = message;
  statusElement.className = type;
}

/**
 * Display parsed data in the output element
 * @param {Object} data - The parsed data
 */
function displayParsedData(data) {
  // Clear the viewer element
  jsonViewerElement.innerHTML = JSON.stringify(data, null, 2);
  
  // Hide the old output element
  outputElement.style.display = 'none';
  
  // Show the JSON viewer
  jsonViewerElement.style.display = 'block';
  
  // Scroll to the top of the output
  jsonViewerElement.parentElement.scrollTop = 0;
}

// Initialize
updateStatus('Ready. Upload a .w3x or .w3m file to begin parsing.');
