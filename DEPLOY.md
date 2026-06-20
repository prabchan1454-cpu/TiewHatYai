# Demo-Ready Deploy Runbook — เที่ยวสงขลา / Travel Songkhla

เป้าหมาย: ทำให้แอปใช้งานได้จริงบน production สำหรับนำเสนอประกวด **ภายใน 1 สัปดาห์**

สถาปัตยกรรม: Frontend (React+Vite → nginx) · Backend (FastAPI+uvicorn) · Gemini 2.0 Flash · Firebase Auth+Firestore

ความหมายของเครื่องหมาย: 🧑 = คุณต้องทำเอง (console/บัญชี/billing) · 🤖 = Claude ทำให้ได้แล้ว/ทำให้ได้

---

## ลำดับความสำคัญ (ทำตามนี้)

### ✅ STEP 0 — Gemini quota (แก้แล้ว 2026-06-19) 🤖
อาการเดิม: `gemini-2.0-flash` ขึ้น `429 ... limit: 0` (project ไม่มีโควต้าฟรีสำหรับ model นี้)
**วิธีแก้ที่ใช้:** เปลี่ยน model เป็น **`gemini-2.5-flash`** (มีโควต้าฟรี ใช้ key เดิมได้) + ปิด thinking (`thinking_budget=0`)
ใน `backend/app/ai_client.py` — เพราะ 2.5-flash เป็น thinking model ที่กิน budget จน JSON ถูกตัด
- ✅ ทดสอบ local ครบทุก endpoint แล้ว (chat multi-turn, chat+รูป, quest, recommend, verify-vision, badge, onboard) — ผ่านหมด
- เผื่อ quota: ถ้าซ้อมเยอะจน 2.5-flash โดน limit ลองสลับ `gemini-2.5-flash-lite` หรือเปิด billing

### ✅ STEP 1 — บั๊กโค้ดที่แก้แล้ว (รอ deploy) 🤖
- แชทต่อเนื่อง: map role `assistant→model` ใน `backend/app/ai_client.py` (Gemini รับแค่ user/model)
- แชทแนบรูป: ส่ง `image_base64`/`image_mime` ใน `backend/app/main.py`
- เสียง reward ไม่ถูกบล็อก (audio unlock) + Firebase bundle split + Home grid + wordmark
- → ทั้งหมดอยู่ใน local แล้ว ต้อง **deploy ใหม่ทั้ง backend และ frontend**

### 🚀 STEP 2 — Deploy Backend 🧑 (Claude เตรียม config ได้)
- มี `backend/Dockerfile` พร้อม เคย deploy ที่ Render (`tiewhatyai.onrender.com`)
- Push โค้ดล่าสุด → Render auto-deploy (หรือกด Manual Deploy)
- ตั้ง env บน Render: `GEMINI_API_KEY` (จาก STEP 0)
- ตรวจ: เปิด `https://<backend>/api/health` → ต้องได้ `{"status":"ok"}`
- ⚠️ Render free tier sleep ~50s ตอน request แรก → **ก่อนนำเสนอให้ยิง /api/health อุ่นเครื่องไว้** (หรือ upgrade เป็น paid กันหลับ)

### 🚀 STEP 3 — Deploy Frontend 🧑
- ตั้ง env บน host (Netlify/Vercel) ให้ครบ:
  - `VITE_API_BASE_URL` = URL backend จาก STEP 2 (ไม่งั้น API 404 ทั้งหมด)
  - `VITE_FIREBASE_API_KEY` / `VITE_FIREBASE_AUTH_DOMAIN` / `VITE_FIREBASE_PROJECT_ID` / `VITE_FIREBASE_APP_ID`
- `npm run build` ผ่านสะอาดแล้ว (ยืนยัน) → deploy `dist/`

### 🔥 STEP 4 — Publish Firestore Rules 🧑
- Firebase Console → Firestore Database → Rules → วางเนื้อหาจาก `firestore.rules` → **Publish**
- ถ้าไม่ทำ: Leaderboard อ่านไม่ได้ (ว่าง), Check-in โพสต์ไม่ได้/feed ว่าง
  (Businesses + likes/replies มี localStorage fallback ยัง demo ได้)

### 🔐 STEP 5 — Firebase Authorized Domain 🧑
- Firebase Console → Authentication → Settings → Authorized domains → **เพิ่มโดเมน production**
- ถ้าไม่ทำ: Google Sign-in จะเด้ง error บนเว็บจริง (localhost ใช้ได้อยู่แล้ว)

### 🧪 STEP 6 — Smoke Test ก่อนนำเสนอ (ทำซ้ำได้) 🤖+🧑
ไล่ทีละข้อบนเว็บ production จริง:
1. เปิดเว็บ → Landing แสดง "TRAVEL SONGKHLA" + เริ่มผจญภัย
2. **Chat:** ทักน้องเที่ยว → ตอบได้ → ถามต่ออีก 2-3 รอบ (ทดสอบ multi-turn) → แนบรูป → วิเคราะห์ได้
3. **Quest:** รับเควส → ถ่ายรูป → ตรวจผ่าน → ได้ XP + เสียง + stamp
4. **Passport:** เก็บ stamp → เห็น animation + เสียง + "+XP"
5. **Recommend:** ขอคำแนะนำ → ได้ 3 ที่
6. **Login Google** (ถ้าโชว์) → เข้าได้ → Leaderboard เห็นชื่อ
7. **Essentials/Legends/Quiz/Businesses/Impact** เปิดได้ครบ
8. สลับ TH/EN ทุกหน้า ไม่มี key หาย · ลอง dark/light

---

## สรุป Owner
- 🧑 **คุณ:** STEP 0 (Gemini key/billing) · STEP 2-5 (deploy + Firebase console)
- 🤖 **Claude:** STEP 1 (แก้บั๊ก เสร็จแล้ว) · ช่วยเตรียม deploy config · ช่วยรัน smoke test ใน local

## Blocker เรียงตามความเสี่ยง demo
1. 🚨 Gemini quota = 0 → AI ตายหมด (STEP 0)
2. ⚠️ Render cold-start ~50s → request แรกช้า/ดูเหมือนค้าง (อุ่นเครื่องก่อน)
3. ⚠️ Firestore rules ไม่ publish → leaderboard/checkin ว่าง
4. ⚠️ ลืม env บน host → API 404 / login พัง
