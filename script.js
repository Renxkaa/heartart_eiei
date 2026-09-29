import * as QrCodeModule from "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/+esm";

const QRCode = QrCodeModule.default || QrCodeModule;
const MUSIC_URL = "https://youtu.be/1OMZrYHIim8?si=urEb5Yy6XQHI7Q6Y";

const qrCanvas = document.querySelector("#qr-canvas");
const ambientCanvas = document.querySelector("#ambient-canvas");
const ambientContext = ambientCanvas.getContext("2d");

function getQrValue() {
  if (MUSIC_URL.trim()) return MUSIC_URL.trim();
  return `${window.location.origin}${window.location.pathname}?music=pending`;
}

function drawQrCode() {
  if (!QRCode || !qrCanvas) return;
  QRCode.toCanvas(qrCanvas, getQrValue(), {
    errorCorrectionLevel: "H",
    margin: 1,
    scale: 8,
    color: {
      dark: "#180611",
      light: "#fff9fc",
    },
  }, (error) => {
    if (error) console.error("QR code could not be generated", error);
  });
}

const particles = [];
const particleColors = ["#ff4f96", "#ff9bc3", "#b879ff", "#ffe3ef"];

function createAmbientParticles() {
  for (let i = 0; i < 86; i += 1) {
    particles.push({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.8 + 0.3,
      speed: Math.random() * 0.00022 + 0.00008,
      drift: Math.random() * Math.PI * 2,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      alpha: Math.random() * 0.5 + 0.16,
    });
  }
}

function resizeAmbientCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  ambientCanvas.width = window.innerWidth * pixelRatio;
  ambientCanvas.height = window.innerHeight * pixelRatio;
  ambientCanvas.style.width = `${window.innerWidth}px`;
  ambientCanvas.style.height = `${window.innerHeight}px`;
  ambientContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function animateAmbient(time = 0) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  ambientContext.clearRect(0, 0, width, height);

  particles.forEach((particle) => {
    particle.y -= particle.speed;
    if (particle.y < -0.02) particle.y = 1.02;
    const x = particle.x * width + Math.sin(time * 0.00035 + particle.drift) * 18;
    const y = particle.y * height;
    const pulse = 0.65 + Math.sin(time * 0.002 + particle.drift) * 0.35;
    ambientContext.globalAlpha = particle.alpha * pulse;
    ambientContext.fillStyle = particle.color;
    ambientContext.beginPath();
    ambientContext.arc(x, y, particle.radius, 0, Math.PI * 2);
    ambientContext.fill();
  });
  ambientContext.globalAlpha = 1;
  requestAnimationFrame(animateAmbient);
}

createAmbientParticles();
resizeAmbientCanvas();
drawQrCode();
window.addEventListener("resize", resizeAmbientCanvas);
requestAnimationFrame(animateAmbient);
