const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const countDisplay = document.getElementById('count');
let session;

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 480 }
    });
    video.srcObject = stream;
    return new Promise(resolve => {
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            resolve();
        };
    });
}

async function loadModel() {
    countDisplay.innerText = '載入 YOLOv8 模型...';
    session = await ort.InferenceSession.create('models/yolov8n.onnx');
    countDisplay.innerText = '模型載入完成，開始推理...';
}

function drawBoxes(boxes) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let count = 0;
    boxes.forEach(([x,y,w,h]) => {
        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
        ctx.beginPath();
        ctx.arc(x + w/2, y + h/2, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'lime';
        ctx.fill();
        count++;
    });
    countDisplay.innerText = `偵測數量：${count}`;
}

async function runDetection() {
    if (!session) return requestAnimationFrame(runDetection);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // ⚠️ TODO: 推理邏輯需補齊
    drawBoxes([]);
    requestAnimationFrame(runDetection);
}

(async () => {
    await setupCamera();
    await loadModel();
    runDetection();
})();