const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const status = document.getElementById("status");

let session = null;

// 啟動相機
async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            resolve();
        };
    });
}

// 載入 YOLOv8 ONNX 模型
async function loadModel() {
    try {
        if (typeof ort === "undefined") throw new Error("onnxruntime-web 載入失敗，請檢查 CDN");
        session = await ort.InferenceSession.create("./models/yolov8.onnx");
        status.textContent = "✅ 模型已載入，開始偵測...";
    } catch (e) {
        status.textContent = `模型載入失敗: ${e.message}`;
    }
}

// 偵測函式 (示範)
async function detect() {
    if (!session) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // TODO: 將影像轉換為Tensor並推論YOLOv8
    ctx.fillStyle = "lime";
    ctx.beginPath();
    ctx.arc(100, 100, 8, 0, 2 * Math.PI);
    ctx.fill();

    requestAnimationFrame(detect);
}

// 執行
(async () => {
    await setupCamera();
    await loadModel();
    detect();
})();