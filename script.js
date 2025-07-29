import * as ort from 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js';

const MODEL_URL = './models/yolov8.onnx'; // 可改成雲端 URL
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');
const countEl = document.getElementById('count');

async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  video.srcObject = stream;
  await new Promise(r => video.onloadedmetadata = r);
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
}

async function loadModel() {
  try {
    const session = await ort.InferenceSession.create(MODEL_URL);
    statusEl.textContent = "模型載入完成，開始偵測...";
    return session;
  } catch (err) {
    statusEl.textContent = "模型載入失敗: " + err.message;
    throw err;
  }
}

function drawDetections(dets) {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  let count = 0;
  dets.forEach(det => {
    const [x,y,w,h] = det;
    const cx = x + w/2, cy = y + h/2;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, 2*Math.PI);
    ctx.fillStyle = 'lime';
    ctx.fill();
    count++;
  });
  countEl.textContent = `偵測數量：${count}`;
}

async function detectLoop(session) {
  const dummy = [[50,50,80,80]]; // 🔹示範用，需改為真正推理結果
  drawDetections(dummy);
  requestAnimationFrame(()=>detectLoop(session));
}

(async ()=>{
  await setupCamera();
  const model = await loadModel();
  detectLoop(model);
})();
