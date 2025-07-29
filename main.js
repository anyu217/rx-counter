
import * as ort from 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');
const countDisplay = document.getElementById('count');

let session;

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    video.srcObject = stream;
    return new Promise(resolve => video.onloadedmetadata = () => resolve());
}

function preprocess(imageData) {
    // Placeholder preprocessing, real preprocessing needed
    const tensor = new ort.Tensor('float32', new Float32Array(640 * 640 * 3).fill(0), [1, 3, 640, 640]);
    return tensor;
}

function drawBoxes(predictions) {
    let count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const pred of predictions) {
        const [x, y, w, h] = pred;  // dummy
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#00FF00';
        ctx.fill();
        count++;
    }
    countDisplay.textContent = `偵測數量：${count}`;
}

async function detectLoop() {
    if (!session) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const inputTensor = preprocess();
    const feeds = { input: inputTensor };
    const results = await session.run(feeds);
    const output = results[Object.keys(results)[0]].data;
    drawBoxes([]);  // Replace with real logic
    requestAnimationFrame(detectLoop);
}

async function loadModel() {
    try {
        session = await ort.InferenceSession.create('./models/yolov8.onnx');
        status.textContent = '模型載入成功';
        await detectLoop();
    } catch (e) {
        console.error(e);
        status.textContent = '模型載入失敗: ' + e.message;
    }
}

await setupCamera();
await loadModel();
