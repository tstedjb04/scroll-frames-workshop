# Scroll Frames Lab Workshop

เป้าหมายของ workshop นี้คือทำให้ scroll progress เลือกภาพที่ถูกต้องจาก
image sequence และวาดภาพนั้นลงบน canvas เพื่อสร้างการเคลื่อนไหวแบบ
Apple-style product page

## ขั้นตอนสำหรับผู้เรียน

1. Clone repository นี้ หรือเปิด repository ที่ facilitator เตรียมไว้
2. ติดตั้ง dependencies และเริ่ม development server:

   ```bash
   pnpm i
   pnpm dev
   ```

3. สร้าง branch ของตัวเองก่อนเริ่มแก้โค้ด:

   ```bash
   git checkout -b workshop/<name>
   ```

   ใช้ชื่อภาษาอังกฤษ เช่น `workshop/anong` หรือ `workshop/somchai`

4. เปิด `src/lib/scrollFrames.ts` แล้วทำ TODO ให้เสร็จ
5. กลับไปที่ browser แล้ว scroll ผ่าน canvas section เพื่อตรวจว่าเลข
   `FRAME` เปลี่ยนตามตำแหน่ง scroll
6. หากต้องการตรวจสอบเพิ่มเติม ให้รัน:

   ```bash
   pnpm test
   ```

7. Commit งานของคุณ และถ้า facilitator ขอ ให้ push branch แล้วเปิด PR:

   ```bash
   git add src/lib/scrollFrames.ts
   git commit -m "feat: map scroll progress to frames"
   ```

## Hint

แปลง scroll `progress` จาก `0` ถึง `1` เป็น frame index ด้วยสูตรนี้:

```text
index = Math.round(progress * (frameCount - 1))
```

จากนั้น clamp ค่าให้อยู่ระหว่าง `0` และ `frameCount - 1` เสมอ

อย่า scrub `<video>` ด้วย `currentTime` เพราะอาจไม่ลื่นหรือไม่แม่นยำบนทุก
เครื่อง เราใช้ preloaded image frames และ canvas แทน

## Stretch goals

ทำได้แล้ว ลองเพิ่มความท้าทายต่อไปนี้:

- แสดง overlay เช่น progress percentage หรือ current frame index
- ปรับความสูงของ scroll section เพื่อเปลี่ยนความเร็วของ animation
- เพิ่ม overlay headline ที่ fade ตาม progress thresholds

## ก่อนจบ

- ห้าม push ตรงเข้า `main`
- ใช้ branch `workshop/<name>` ของตัวเอง
- `solution` branch มีคำตอบสำหรับดูหลังจบคลาส หรือใช้โดย facilitator
