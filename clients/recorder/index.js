/* eslint-disable no-undef */
import localOrHive from '../shared/localorhive.js';
import {setupCamera} from '../shared/camera.js';

const common = ModelViewer.common;
const quat = common.glMatrix.quat;
const math = common.math;



var canvas = document.getElementById('canvas');
var viewer = new ModelViewer.viewer.ModelViewer(canvas, { alpha: true });
var instance;

viewer.on('error', (e) => console.error(e));

viewer.addHandler(ModelViewer.viewer.handlers.mdx, localOrHive);
viewer.addHandler(ModelViewer.viewer.handlers.blp);
viewer.addHandler(ModelViewer.viewer.handlers.tga);
viewer.addHandler(ModelViewer.viewer.handlers.dds);

let backgroundOpaque = true;

let turnTableSpeed = 0;
const turnTableQuat = quat.create();
let isRecording = false;
let recordingFrame = 0;
let oneTimeRecord = false;
let zip = new JSZip();

const frameCounterElement = document.getElementById('frame_counter');
const sequenceNameElement = document.getElementById('sequence_name');

(function step() {
  viewer.updateAndRender();

  if (instance) {
    instance.rotate(turnTableQuat);

    if (isRecording || oneTimeRecord) {
      oneTimeRecord = false;

      zip.file(
        `${recordingFrame++}_${instance.model.name}_${Math.floor(instance.frame)}.png`,
        viewer.canvas.toDataURL().substring(22),
        { base64: true }
      );

      frameCounterElement.textContent = recordingFrame;
    }
  }

  requestAnimationFrame(step);
})();

const scene = viewer.addScene();
scene.alpha = true;
setupCamera(scene, { distance: 500 });

console.log('Viewer version', ModelViewer.version);

// Log load starts to the console.
viewer.on('loadstart', target => {
  const path = target.fetchUrl;

  if (path) {
    console.log('Loading ' + target.fetchUrl);
  }
});

// Log load ends to the console.
viewer.on('load', target => {
  const path = target.fetchUrl;

  if (path) {
    console.log('Finished loading ' + target.fetchUrl);
  }
});

function normalizePath(path) {
  return path.toLocaleLowerCase().replace(/\\/g, '/');
}

// Load a local file
function onLocalFileLoaded(name, buffer) {
  if (name.endsWith('.mdx')) {
    const pathSolver = src => {
      if (src === buffer) {
        return src;
      } else {
        return localOrHive(normalizePath(src));
      }
    };

    turnTableSpeed = 0;
    quat.identity(turnTableQuat);
    isRecording = false;

    scene.clear();

    viewer.load(buffer, pathSolver)
      .then((model) => {
        instance = model.addInstance();

        instance.setSequenceLoopMode(2);
        instance.setSequence(0);

        sequenceNameElement.textContent = model.sequences[0].name;

        scene.addInstance(instance);
      });
  }
}

canvas.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});

canvas.addEventListener('selectstart', function (e) {
  e.preventDefault();
});

function onFileDrop(e) {
  const file = e.dataTransfer.files[0];

  if (file) {
    const name = file.name.toLowerCase();

    if (name.endsWith('.mdx') || name.endsWith('.blp')) {
      const reader = new FileReader();

      reader.addEventListener('loadend', e => onLocalFileLoaded(name, e.target.result));
      reader.readAsArrayBuffer(file);
    }
  }
}

document.addEventListener('dragover', e => {
  e.preventDefault();
});

document.addEventListener('dragend', e => {
  e.preventDefault();
  onFileDrop(e);
});

document.addEventListener('drop', e => {
  e.preventDefault();
  onFileDrop(e);
});

window.addEventListener('keydown', e => {
  const key = e.key;

  if (instance) {
    const model = instance.model;

    if (key === ' ') {
      isRecording = !isRecording;
    } else if (key === 'ArrowLeft') {
      if (instance.sequence === 0) {
        instance.setSequence(model.sequences.length - 1);
      } else {
        instance.setSequence(instance.sequence - 1);
      }

      sequenceNameElement.textContent = model.sequences[instance.sequence].name;
    } else if (key === 'ArrowRight') {
      if (instance.sequence === model.sequences.length - 1) {
        instance.setSequence(0);
      } else {
        instance.setSequence(instance.sequence + 1);
      }

      sequenceNameElement.textContent = model.sequences[instance.sequence].name;
    } else if (key === 'ArrowUp') {
      turnTableSpeed += 0.2;
      quat.setAxisAngle(turnTableQuat, [0, 0, 1], math.degToRad(turnTableSpeed));
    } else if (key === 'ArrowDown') {
      turnTableSpeed -= 0.2;
      quat.setAxisAngle(turnTableQuat, [0, 0, 1], math.degToRad(turnTableSpeed));
    } else if (key === 'Enter') {
      oneTimeRecord = true;
    } else if (key === 'Escape') {
      if (recordingFrame > 0) {
        zip.generateAsync({ type: 'blob' }).then(blob => {
          saveAs(blob, `recorded_frames_${recordingFrame}.zip`);

          zip = new JSZip();
          recordingFrame = 0;
          frameCounterElement.textContent = '';
        });
      }
    }
  }

  if (key === 'b') {
    backgroundOpaque = !backgroundOpaque;

    if (backgroundOpaque) {
      viewer.alpha = false;

      sequenceNameElement.style.color = 'white';
      frameCounterElement.style.color = 'white';
    } else {
      viewer.alpha = true;
      sequenceNameElement.style.color = 'black';
      frameCounterElement.style.color = 'black';
    }
  }
});
