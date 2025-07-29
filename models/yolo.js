const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const countDisplay = document.getElementById('countDisplay');
let session;

// 啟動相機
async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
  video.srcObject = stream;
  return new Promise(resolve => video.onloadedmetadata = resolve);
}

// 載入 ONNX YOLOv8 模型
async function loadModel() {
  session = await ort.InferenceSession.create('yolov8n.onnx');
  countDisplay.textContent = "模型載入完成，開始偵測...";
}

// 模擬 YOLO 推理
async function detect() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  // 🔹這裡應該呼叫 YOLOv8 推理 → detections = await runYOLO(videoFrame)
  const detections = [
    {bbox: [100, 120, 50, 50]}, {bbox: [300, 200, 40, 40]}
  ];

  detections.forEach(det => {
    const [x, y, w, h] = det.bbox;
    const cx = x + w / 2;
    const cy = y + h / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "lime";
    ctx.fill();
  });

  countDisplay.textContent = `偵測數量：${detections.length}`;
  requestAnimationFrame(detect);
}

(async () => {
  await setupCamera();
  await loadModel();
  detect();
})();
