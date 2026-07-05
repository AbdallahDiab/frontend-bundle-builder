/**
 * Generates simple colored PNG placeholders for product images.
 * Run: node scripts/generate-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const productsDir = join(__dirname, '../src/assets/products')

const PRODUCT_SLUGS = [
  'wyze-cam-v4',
  'wyze-cam-v4-white',
  'wyze-cam-v4-grey',
  'wyze-cam-v4-black',
  'wyze-cam-pan-v3',
  'wyze-cam-pan-v3-white',
  'wyze-cam-pan-v3-black',
  'wyze-cam-floodlight-v2',
  'wyze-cam-floodlight-v2-white',
  'wyze-cam-floodlight-v2-black',
  'wyze-duo-cam-doorbell',
  'wyze-battery-cam-pro',
  'wyze-battery-cam-pro-white',
  'wyze-battery-cam-pro-black',
  'wyze-sense-motion-sensor',
  'wyze-sense-hub',
  'wyze-microsd-card-256gb',
  'cam-unlimited',
]

function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

function slugToColor(slug) {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  }
  const r = 180 + (hash % 60)
  const g = 180 + ((hash >> 8) % 60)
  const b = 180 + ((hash >> 16) % 60)
  return [r, g, b]
}

function createSolidPng(width, height, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const rowSize = width * 3 + 1
  const raw = Buffer.alloc(rowSize * height)
  for (let y = 0; y < height; y++) {
    raw[y * rowSize] = 0
    for (let x = 0; x < width; x++) {
      const i = y * rowSize + 1 + x * 3
      raw[i] = r
      raw[i + 1] = g
      raw[i + 2] = b
    }
  }

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

mkdirSync(productsDir, { recursive: true })

for (const slug of PRODUCT_SLUGS) {
  const [r, g, b] = slugToColor(slug)
  const png = createSolidPng(200, 200, r, g, b)
  writeFileSync(join(productsDir, `${slug}.png`), png)
}

console.log(`Generated ${PRODUCT_SLUGS.length} placeholder PNGs in ${productsDir}`)
