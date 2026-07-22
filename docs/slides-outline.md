# Scroll Frames Lab — Gamma Slide Outline

Copy this outline into Gamma to create the workshop deck. Instruction is in
Thai with English technical terms retained for code and concepts.

## Slide 1 — Scroll-driven Product UI Workshop

- สร้าง scroll-driven product animation แบบ Apple-style
- ใช้ image sequence, sticky canvas และ scroll progress
- เป้าหมายวันนี้: เข้าใจ concept และทำ scrub ที่ใช้งานได้จริง

## Slide 2 — Goals

- เข้าใจว่าทำไม video scrubbing จึงรู้สึก janky
- รู้จัก architecture: frames + canvas + sticky section
- ทำ TODO ให้ scroll map ไปยัง frame ที่ถูกต้อง
- เวลารวมประมาณ 70–80 นาที

## Slide 3 — Why It Feels Premium

- Apple product-page style motion เชื่อมการ scroll กับ visual story
- ผู้ใช้ควบคุมจังหวะ animation ได้ด้วยตัวเอง
- การเปลี่ยน frame ที่ต่อเนื่องช่วยให้ product reveal ดูมีคุณภาพ

## Slide 4 — Wrong Path: `<video>.currentTime`

- การเปลี่ยน `currentTime` ระหว่าง scroll อาจ decode ไม่ทัน
- แต่ละ browser และเครื่องมีพฤติกรรมต่างกัน
- ผลลัพธ์คือการกระตุก, frame กระโดด, หรือ response ที่ช้า
- อย่าใช้ video scrub เป็น core solution ของ workshop นี้

## Slide 5 — Right Path: Flipbook

- เตรียม image frames ล่วงหน้า
- ใช้ sticky section ให้ canvas อยู่ใน viewport
- แปลง scroll progress เป็น `frameIndex`
- วาด frame ที่เลือกลงบน canvas

## Slide 6 — Pipeline Overview

- Start frame → End frame → Video → Extract frames → Scroll map
- Facilitator จะ demo pipeline แบบสั้น
- ผู้เรียนใช้ sample frames ที่ bundle มาแล้ว
- โฟกัสของ hands-on คือ scroll mapping ไม่ใช่การสร้าง assets

## Slide 7 — Code Anatomy

- `sticky` — canvas อยู่ตำแหน่งเดิมขณะ scroll
- `progress` — ค่า scroll range จาก `0` ถึง `1`
- `frameIndex` — index ที่เลือกจาก image sequence
- `draw` — วาดภาพลง canvas ด้วย `requestAnimationFrame`

## Slide 8 — Setup

```bash
pnpm i
git checkout -b workshop/<name>
pnpm dev
```

- ใช้ branch ของตัวเอง: `workshop/anong`
- ห้าม push ตรงเข้า `main`

## Slide 9 — Challenge

- เปิด `src/lib/scrollFrames.ts`
- ทำ TODO ให้ scroll progress map ไปยัง frame index
- Scroll ใน browser แล้วตรวจว่า `FRAME` เปลี่ยนอย่างถูกต้อง
- หากต้องการ ให้รัน `pnpm test`

## Slide 10 — Hint Formula

```text
index = Math.round(progress * (frameCount - 1))
```

- `progress` อยู่ระหว่าง `0` และ `1`
- ผลลัพธ์ต้องอยู่ระหว่าง `0` และ `frameCount - 1`
- Clamp ค่าให้ปลอดภัยก่อนนำไปใช้

## Slide 11 — Stretch + Share

- แสดง progress % หรือ current frame number
- ปรับ scroll section height เพื่อเปลี่ยน animation pacing
- เพิ่ม overlay headline ที่ fade ตาม progress thresholds
- อาสาสมัคร 2–3 คนแชร์ผลงานและสิ่งที่เรียนรู้

## Slide 12 — Resources

- `README.md` — setup, commands และ branch rules
- `WORKSHOP.md` — learner steps และ hint
- `solution` branch — completed reference หลังจบคลาส
- Commit งานบน `workshop/<name>` และเปิด PR หาก facilitator ขอ
