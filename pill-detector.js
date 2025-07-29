import * as ort from 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');
const countEl = document.getElementById('count');

// ✅ 修改為使用公開 URL 載入模型 (請將此 URL 換成你自己的)
const MODEL_URL = "https://你的網址/yolov8.onnx";

async function initCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
  video.srcObject = stream;
  return new Promise(r => video.onloadedmetadata = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    r();
  });
}

async function loadModel() {
  try {
    const session = await ort.InferenceSession.create(MODEL_URL);
    statusEl.textContent = "模型載入成功，開始偵測...";
    return session;
  } catch (err) {
    statusEl.textContent = "模型載入失敗: " + err.message;
    throw err;
  }
}

function drawBox(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "lime";
  ctx.fill();
}

async function detect(session) {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  // 這裡應該放 YOLOv8 ONNX 推理的程式碼 (簡化示範)
  // 模擬隨機 3 個藥錠位置
  const detections = [{x:100,y:100},{x:200,y:150},{x:250,y:250}];
  detections.forEach(d => drawBox(d.x, d.y));
  countEl.textContent = "偵測數量：" + detections.length;
  requestAnimationFrame(() => detect(session));
}

(async () => {
  await initCamera();
  const session = await loadModel();
  detect(session);
})();
