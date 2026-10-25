const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const srcImage = path.resolve('public/app-logo.png');

if (!fs.existsSync(srcImage)) {
  console.error('Source logo not found at ' + srcImage);
  process.exit(1);
}

console.log('Generating web and PWA icons...');
// Web icons
execSync(`convert "${srcImage}" -resize 192x192 public/icon-192.png`);
execSync(`convert "${srcImage}" -resize 512x512 public/icon-512.png`);
execSync(`convert "${srcImage}" -resize 180x180 public/apple-touch-icon.png`);
execSync(`convert "${srcImage}" -resize 32x32 public/favicon-32x32.png`);
execSync(`convert "${srcImage}" -resize 16x16 public/favicon-16x16.png`);
execSync(`convert "${srcImage}" -resize 48x48 public/favicon.ico`);
execSync(`convert "${srcImage}" -resize 64x64 public/favicon.png`);

// Android mipmap sizes
const mipmapConfigs = [
  { dir: 'mipmap-mdpi', size: 48, fgSize: 108 },
  { dir: 'mipmap-hdpi', size: 72, fgSize: 162 },
  { dir: 'mipmap-xhdpi', size: 96, fgSize: 216 },
  { dir: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
  { dir: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
];

console.log('Generating Android mipmap launcher icons...');
const resBase = path.resolve('android/app/src/main/res');

for (const cfg of mipmapConfigs) {
  const targetDir = path.join(resBase, cfg.dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 1. Standard ic_launcher.png
  execSync(`convert "${srcImage}" -resize ${cfg.size}x${cfg.size} "${path.join(targetDir, 'ic_launcher.png')}"`);

  // 2. Round ic_launcher_round.png
  execSync(`convert "${srcImage}" -resize ${cfg.size}x${cfg.size} \\( +clone -alpha extract -draw "circle ${cfg.size/2},${cfg.size/2} ${cfg.size/2},1" \\) -alpha off -compose CopyOpacity -composite "${path.join(targetDir, 'ic_launcher_round.png')}"`);

  // 3. Adaptive foreground ic_launcher_foreground.png (Safe zone: ~70% of fgSize, centered on transparent canvas)
  const innerSize = Math.round(cfg.fgSize * 0.72);
  execSync(`convert -size ${cfg.fgSize}x${cfg.fgSize} xc:none \\( "${srcImage}" -resize ${innerSize}x${innerSize} \\) -gravity center -composite "${path.join(targetDir, 'ic_launcher_foreground.png')}"`);
}

// Android splash screens
console.log('Generating Android splash drawables...');
const splashConfigs = [
  { dir: 'drawable', w: 480, h: 320 },
  { dir: 'drawable-land-mdpi', w: 480, h: 320 },
  { dir: 'drawable-land-hdpi', w: 800, h: 480 },
  { dir: 'drawable-land-xhdpi', w: 1280, h: 720 },
  { dir: 'drawable-land-xxhdpi', w: 1600, h: 960 },
  { dir: 'drawable-land-xxxhdpi', w: 1920, h: 1280 },
  { dir: 'drawable-port-mdpi', w: 320, h: 480 },
  { dir: 'drawable-port-hdpi', w: 480, h: 800 },
  { dir: 'drawable-port-xhdpi', w: 720, h: 1280 },
  { dir: 'drawable-port-xxhdpi', w: 960, h: 1600 },
  { dir: 'drawable-port-xxxhdpi', w: 1280, h: 1920 },
];

for (const sc of splashConfigs) {
  const targetDir = path.join(resBase, sc.dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const minDim = Math.min(sc.w, sc.h);
  const logoSize = Math.round(minDim * 0.45);
  // Composite logo in the center on dark background #081e14
  execSync(`convert -size ${sc.w}x${sc.h} xc:"#081e14" \\( "${srcImage}" -resize ${logoSize}x${logoSize} \\) -gravity center -composite "${path.join(targetDir, 'splash.png')}"`);
}

console.log('Assets generation complete!');
