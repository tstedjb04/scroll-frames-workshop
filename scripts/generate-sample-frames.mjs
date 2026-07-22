import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../public/frames')
const FRAME_COUNT = 40
const W = 1280
const H = 720

fs.mkdirSync(outDir, { recursive: true })

for (let i = 1; i <= FRAME_COUNT; i++) {
  const t = (i - 1) / (FRAME_COUNT - 1)
  const hue = Math.round(200 + t * 80)
  const svg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0F172A"/>
      <rect x="340" y="160" width="600" height="400" rx="24"
        fill="hsl(${hue} 70% 45%)"/>
      <text x="50%" y="52%" text-anchor="middle" fill="white"
        font-family="system-ui,sans-serif" font-size="64" font-weight="600">
        FRAME ${String(i).padStart(2, '0')} / ${FRAME_COUNT}
      </text>
    </svg>`
  const file = path.join(outDir, `frame_${String(i).padStart(4, '0')}.webp`)
  await sharp(Buffer.from(svg)).webp({ quality: 85 }).toFile(file)
  console.log('wrote', file)
}
