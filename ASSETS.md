# 🎨 Asset prompts — โลโก้ & มาสคอต (เที่ยวสงขลา)

คู่มือสร้างรูปด้วย AI (Gemini / image generator ฟรี) ให้ตรงสไตล์แอป
แล้วเอามาวางแทน placeholder ที่โค้ดเตรียมไว้

## พาเลตต์สีของแอป (ใส่ในพรอมป์ให้ AI คุมโทน)
| สี | HEX | ใช้ตอน |
|---|---|---|
| น้ำเงินกรมท่า (deep) | `#1b2a4a` | พื้นหลัง/เส้นขอบ |
| ส้มมะม่วง (mango) | `#ffb020` | ไฮไลต์ |
| ส้มพระอาทิตย์ (sunset) | `#ff7a45` | ไล่เฉดหลัก |
| เขียวทะเล (lagoon) | `#0fb9b1` | สีรอง |
| ทองอ่อน | `#ffd27f` | แสง/ประกาย |

สไตล์รวม: **flat illustration / chibi น่ารัก, มุมโค้งมน, ไล่เฉดนุ่ม, เงาน้อย, สะอาดตา**

---

## 1) มาสคอต — น้องเที่ยว (นางเงือกทอง 🧜‍♀️)
> สัญลักษณ์ของสงขลาคือ "นางเงือกทอง" ที่หาดสมิหลา

**สไตล์เป้าหมาย: มาสคอตแบบ Duolingo** — รูปทรงโค้งกลม flat ชัด ๆ ตาโตมากมีประกาย
สีหน้าสื่ออารมณ์ชัด มีคาแรกเตอร์/บุคลิกเด่น น่ารักเป็นมิตร จำง่าย ใช้เป็น avatar ได้

**Prompt (EN — แนะนำให้ใช้กับ image AI):**
```
Duolingo-style mascot character: a friendly cute golden mermaid named "Nong Tiew",
inspired by the Golden Mermaid statue of Samila Beach, Songkhla Thailand.
Bold rounded flat-design shapes, oversized expressive sparkly eyes with big pupils
and highlights, rosy cheeks, big cheerful open smile, lots of personality.
Small pearl tiara, navy hair, seashell top, golden-orange fish tail with a gradient
from #ffd27f to #ffb020 to #ff7a45. Clean modern vector illustration, mostly flat
colors with subtle gradient on the tail, simple and friendly, very readable even small.
Centered, full body, facing forward, waving hello. Transparent background, square, high resolution.
```

**Prompt (TH):**
```
มาสคอตสไตล์ Duolingo: นางเงือกทองน่ารักเป็นมิตร ชื่อ น้องเที่ยว
ได้แรงบันดาลใจจากรูปปั้นนางเงือกทองหาดสมิหลา จังหวัดสงขลา
รูปทรงโค้งกลมแบบ flat design ชัด ๆ ตาโตมากเป็นประกาย ตาดำใหญ่มีไฮไลต์
แก้มชมพู ยิ้มกว้างสดใส มีบุคลิกเด่น มงกุฎไข่มุกเล็ก ผมสีน้ำเงินกรมท่า เปลือกหอยเป็นเสื้อ
หางปลาสีทองส้มไล่เฉดจาก #ffd27f ไป #ffb020 ไป #ff7a45
สไตล์เวกเตอร์โมเดิร์น สีแบนเป็นหลัก ไล่เฉดเล็กน้อยที่หาง เรียบง่าย จำง่าย ดูออกแม้ตัวเล็ก
หันหน้าตรง เต็มตัว โบกมือทักทาย พื้นหลังโปร่งใส สี่เหลี่ยมจัตุรัส ความละเอียดสูง
```

**ท่าทางเพิ่ม (gen แยกไฟล์ได้ ใช้ในจุดต่าง ๆ ของแอป):**
- `mascot.png` — โบกมือทักทาย (ค่าหลัก ใช้ทั่วแอป)
- `mascot-think.png` — เอามือแตะคาง คิด (ตอน AI กำลังคิด/โหลด)
- `mascot-cheer.png` — ชูแขนดีใจ (ตอนทำเควสสำเร็จ)
- `mascot-point.png` — ชี้มือ (ตอนแนะนำ/ทัวร์)

> เคล็ดลับ: ใส่ท้ายพรอมป์ว่า *"same character, same style, transparent background"* ทุกครั้ง เพื่อให้หน้าตาตรงกันทุกท่า

**สิ่งที่ไม่เอา (negative):** พื้นหลังทึบ, สมจริงเกินไป (photorealistic), น่ากลัว, ลายเส้นรก, ตัวอักษร/ข้อความบนรูป

---

## 2) โลโก้เกม (App icon)
**Prompt (EN):**
```
Modern app icon for a Songkhla travel adventure game called "Travel Songkhla".
Rounded square icon with deep navy #1b2a4a background. Centered emblem combining
a small cute golden mermaid tail/fin and a sunrise, inside a circular ring with
a gradient from #ffb020 to #ff7a45. Flat vector style, smooth gradients, bold and
simple, recognizable at small sizes, no text. Transparent or navy background, square.
```

> ถ้าอยากให้โลโก้กับมาสคอตเป็นชุดเดียวกัน ใช้ "นางเงือกทอง" เป็นแกนทั้งคู่

---

## 3) เอาไฟล์มาวางยังไง (หลังได้รูปจาก AI)
1. บันทึกรูปมาสคอตเป็น **PNG พื้นหลังโปร่งใส**
2. วางไฟล์ไว้ที่ `frontend/public/` เช่น `frontend/public/mascot.png`
3. เปิด `frontend/src/components/Mascot.jsx` แก้บรรทัดเดียว:
   ```js
   const SRC = "/mascot.png";   // จาก "/mascot.svg"
   ```
   เท่านี้มาสคอตใหม่จะขึ้นทุกจุดในแอป (Onboarding, Chat, Tutorial) อัตโนมัติ
4. โลโก้: วางทับ `frontend/public/logo.svg` (หรือถ้าเป็น PNG ให้ตั้งชื่อ `logo.png`
   แล้วบอกผม เดี๋ยวเปลี่ยน path ที่ `<img src="/logo.svg">` ให้ — มี 4 จุด: App, Landing, Onboarding, Login)
5. ไอคอน PWA (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `favicon-32.png`)
   ถ้าอยากเปลี่ยนตามโลโก้ใหม่ → export เป็นขนาดนั้น ๆ แล้ววางทับใน `public/`

> สถานะปัจจุบัน: มาสคอตจริงสร้างด้วย **Canva** แล้ว export เป็น PNG พื้นโปร่งใส →
> `frontend/public/mascot.png` (Mascot.jsx ชี้ไฟล์นี้อยู่) ส่วน `mascot.svg` ที่วาดมือ
> เก็บไว้เป็น fallback สำรอง
>
> Canva design (แก้ต่อได้): https://www.canva.com/d/URpgkQsxfpcM3G9
