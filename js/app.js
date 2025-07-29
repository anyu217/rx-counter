const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');
const countText = document.getElementById('count');

const modelURL = './models/yolov8.onnx';

async function initCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
    return new Promise(resolve => video.onloadedmetadata = () => resolve());
}

async function loadModel() {
    try {
        statusText.innerText = "載入模型...";
        const session = await ort.InferenceSession.create(modelURL);
        statusText.innerText = "模型載入完成 ✅";
        return session;
    } catch (err) {
        statusText.innerText = "模型載入失敗: " + err.message;
        throw err;
    }
}

async function detectPills(session) {
    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = 640;
    tmpCanvas.height = 480;
    tmpCtx.drawImage(video, 0, 0, tmpCanvas.width, tmpCanvas.height);
    // 這裡應該進行YOLOv8推理（需額外實作），目前先假設隨機數
    const count = Math.floor(Math.random() * 10) + 5;
    countText.innerText = count;
    ctx.drawImage(tmpCanvas, 0, 0, canvas.width, canvas.height);
}

(async () => {
    await initCamera();
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const session = await loadModel();
    setInterval(() => detectPills(session), 1000);
})();
