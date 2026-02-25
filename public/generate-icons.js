const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

function drawIcon(size, outPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#0d0d1a";
  ctx.fillRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.32;

  ctx.fillStyle = "#18d5c4";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = `${Math.floor(size * 0.38)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("🎤", cx, cy + size * 0.02);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outPath, buffer);
}

drawIcon(192, "public/icon-192.png");
drawIcon(512, "public/icon-512.png");
console.log("Icons generated.");
