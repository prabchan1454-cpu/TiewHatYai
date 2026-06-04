# 🧜‍♀️ มาสคอตขยับแบบ Duolingo ด้วย Rive

โค้ดพร้อมแล้ว — เหลือแค่สร้างไฟล์ **`mascot.riv`** (ตัวละครที่ rig/ใส่โครง) แล้ววางใน
`frontend/public/mascot.riv` → แอปจะใช้ Rive อัตโนมัติทุกจุด (ถ้าไม่มีไฟล์ = ใช้ PNG เหมือนเดิม)

## ทำไมต้องทำไฟล์เอง
PNG เป็นภาพแบนแผ่นเดียว ขยับแยกส่วน (แขน/ตา/หาง) ไม่ได้ ต้อง "rig" ตัวละครก่อน
ซึ่งทำใน **Rive editor** (rive.app) — **ฟรี** ผมสร้างไฟล์นี้ให้ไม่ได้ (เป็นงานในเครื่องมือ Rive)

## ขั้นตอนสร้าง mascot.riv (ใน rive.app)
1. สมัคร/เข้า **https://rive.app** (ฟรี) → New File
2. **นำตัวละครเข้า:**
   - ลากไฟล์ `frontend/public/mascot.png` เข้าไป แล้วใช้เป็นภาพอ้างอิง วาด vector ทับ (Pen tool) แยกชิ้น: หัว, ตาซ้าย/ขวา, แขน, ตัว, หาง
   - หรือวาดใหม่ใน Rive เลย โดยยึดสไตล์/สีเดิม (กรมท่า #1b2a4a, ทอง #ffb020, ส้ม #ff7a45)
3. **ใส่โครง (rig):** ใช้ Bones ผูกแขน/หาง เพื่อให้ขยับได้
4. **สร้าง Animations** (แท็บ Animate):
   - `idle` — ลอย/หางแกว่ง/ตากระพริบ เป็นลูป (ตัวหลักที่เล่นตลอด)
   - `wave` — โบกมือ (เล่นตอนถูกแตะ)
5. **สร้าง State Machine** — **ตั้งชื่อให้ตรงเป๊ะว่า `State Machine 1`** (ค่า default ของ Rive):
   - ตั้ง `idle` เป็น state เริ่มต้น (loop)
   - เพิ่ม **Input แบบ Trigger ชื่อ `tap`** → ทำ transition `idle → wave → idle`
6. **Export:** เมนู → Export → **Runtime (.riv)** → ได้ไฟล์ `.riv`
7. เปลี่ยนชื่อเป็น **`mascot.riv`** วางที่ **`frontend/public/mascot.riv`**
8. เปิดแอป → มาสคอตจะขยับด้วย Rive อัตโนมัติ + แตะแล้วโบกมือ 🎉

> ชื่อที่โค้ดคาดหวัง (แก้ได้ใน `src/components/RiveMascot.jsx`):
> - State machine: `State Machine 1`
> - Trigger input: `tap`

## ทางลัด (ถ้าไม่อยากวาดเอง)
- **Rive Community** (rive.app/community) มีตัวละครฟรีที่ rig มาแล้ว ดาวน์โหลด `.riv` ได้
  แต่จะไม่ใช่นางเงือกของเรา — เหมาะถ้าอยากลองให้เห็นว่า Rive ทำงานยังไงก่อน
  (ถ้าใช้ของคนอื่น เช็ก license + ชื่อ state machine/input ให้ตรง หรือแก้ใน RiveMascot.jsx)

## สถานะโค้ด (ทำให้แล้ว)
- ลงไลบรารี `@rive-app/react-canvas` ✅ (โหลดเป็น chunk แยก เฉพาะตอนมี .riv)
- `RiveMascot.jsx` — เล่น .riv + แตะยิง trigger `tap` ✅
- `Mascot.jsx` — เช็คว่ามี `/mascot.riv` ไหม: มี→Rive, ไม่มี→PNG (CSS idle/wiggle) ✅
- ไม่มีไฟล์ = ไม่พัง, ไม่เพิ่มขนาด bundle ✅
