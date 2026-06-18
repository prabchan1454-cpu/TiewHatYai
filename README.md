# เที่ยวหาดใหญ่ · TiewHatyai 🧜‍♀️🗺️

> ซูเปอร์แอป **ท่องเที่ยวและไลฟ์สไตล์ หาดใหญ่–สงขลา** พร้อม AI ส่วนตัว **"น้องเที่ยว"**,
> เควสที่ต้อง **ไปจริง–ถ่ายรูปจริง** (AI ตรวจรูป), **พาสปอร์ตเก็บดวงตราแลนด์มาร์ก**, **ฟีดเช็คอินชุมชน**,
> ข้อมูลคนเมือง **โรงพยาบาล–เหตุฉุกเฉิน–การเดินทาง**, **ตำนานและสถานที่ลึกลับ** และ **ไดเรกทอรีร้านค้าท้องถิ่น**  
> ส่งประกวดรายการ **I-New Gen 2027** กลุ่มการท่องเที่ยวและเศรษฐกิจสร้างสรรค์ — ดูกลยุทธ์เต็มที่ [`STRATEGY.md`](STRATEGY.md)

---

## ✨ จุดเด่น (ต่างจากแอปรีวิว/ข้อมูลท่องเที่ยวทั่วไป)

แอปท่องเที่ยวทั่วไป = **"เปิดดูข้อมูล"** (passive) · Travel Songkhla = **"เกมเที่ยวจริง"** (active)

- 🛡️ **ไปจริง พิสูจน์ได้ — กันโกง** ทำเควส/เก็บดวงตราต้องอัปโหลด **รูปถ่ายจริง** ให้ AI vision ตรวจว่าตรงสถานที่ (รูปปลอม/การ์ตูน/สกรีนช็อต ถูกปฏิเสธ)
- 🧜‍♀️ **พาสปอร์ตเที่ยวสงขลา** สะสมดวงตรา 12 แลนด์มาร์กทั่วจังหวัด → กระจายนักท่องเที่ยวสู่หลายอำเภอ/จุดรอง
- 👥 **เช็คอินชุมชน** โพสต์เช็คอินให้คนอื่นเห็น + แผนที่รวม → สังคมนักเที่ยวจริง ช่วยกันโปรโมตแบบออร์แกนิก
- 🎁 **เควสล่าของฝาก** ดันให้แวะร้าน/ของฝากท้องถิ่น → หนุนเศรษฐกิจชุมชน

![Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi) ![Groq](https://img.shields.io/badge/AI-Groq%20Free%20Tier-F55036) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

---

## ฟีเจอร์หลัก

| ฟีเจอร์ | รายละเอียด |
|---|---|
| 🏠 **หน้าหลัก** | Dashboard แสดง Level / XP / เควสที่กำลังทำ / ความคืบหน้าพาสปอร์ต |
| 💬 **น้องเที่ยว** | Chatbot AI ตอบทุกเรื่องสงขลา (หาดใหญ่–เมืองสงขลา–เกาะยอ) ไทย/อังกฤษ |
| 🎯 **เควสผจญภัย** | รับภารกิจ → ไปสถานที่จริง → **บังคับแนบรูป** → AI vision ตรวจ (กันโกง) |
| 🎁 **เควสล่าของฝาก** | เควสเฉพาะของฝาก/หัตถกรรมท้องถิ่น หนุนเศรษฐกิจชุมชน |
| 🧜‍♀️ **พาสปอร์ตเที่ยวสงขลา** | สะสมดวงตรา 12 แลนด์มาร์ก (ถ่ายรูป AI ตรวจ) + แผนที่หมุดทั่วจังหวัด |
| 👥 **เช็คอินชุมชน** | โพสต์เช็คอินพร้อมรูป ให้คนอื่นเห็นในฟีด + แผนที่รวม (Firebase) |
| ⭐ **แนะนำที่เที่ยว** | AI แนะนำ 3 สถานที่ตามสไตล์/วันเดินทาง/เทศกาล + แผนที่ |
| 🏆 **Leaderboard** | อันดับนักเที่ยวแบบ podium (ทอง–เงิน–ทองแดง) ตาม XP |
| 🏅 **รางวัล / Badge** | ปลดล็อก Badge หายาก 4 ระดับ (Common → Legendary) |
| 📈 **ระบบเลเวล** | สะสม XP อัปเลเวล 4 ขั้น มือใหม่ → เซียนสงขลา |

---

## Tech Stack

```
Frontend  │ React 18 + Vite 6 + TailwindCSS 3  (mobile-first, PWA)
Backend   │ Python FastAPI  (stateless AI proxy)
AI        │ Groq Free Tier — llama-3.3-70b-versatile (Thai text)
          │                  llama-4-scout-17b (vision / ตรวจรูปเควส-ดวงตรา)
Maps      │ Leaflet + OpenStreetMap (ฟรี — แผนที่พาสปอร์ต/เช็คอิน/แนะนำ)
Social    │ Firebase Auth (Google) + Firestore  (leaderboard + เช็คอินชุมชน)
State     │ localStorage  (โปรเกรสส่วนตัว — เล่นได้ทันทีแม้ไม่ล็อกอิน)
Deploy    │ Docker Compose  (frontend nginx + backend uvicorn)
```

---

## โครงสร้างโปรเจกต์

```
travel-songkhla/
├── docker-compose.yml
├── firestore.rules        # กฎ Firestore (leaderboard + checkins) — publish ใน console
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── main.py        # FastAPI routes
│       ├── ai_client.py   # Groq client + retry logic
│       ├── prompts.py     # system prompts (chat/quest/recommend/verify/badge…)
│       └── schemas.py     # Pydantic models
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── .env.example       # Firebase keys (optional — เปิด login/leaderboard/เช็คอิน)
    └── src/
        ├── App.jsx
        ├── screens/       # Landing · Login · Onboarding · Home · Chat · Quests
        │                  #   · Recommend · Achievements · Passport · Checkins
        ├── components/    # ui · Mascot · StampMap · CheckinMap · PlacesMap · …
        └── lib/           # api · progress · landmarks · checkins · leaderboard · firebase · …
```

---

## วิธีรัน (Docker — แนะนำ)

```bash
# 1. clone repo
git clone https://github.com/prabchan1454-cpu/TiewHatYai.git
cd TiewHatYai

# 2. ใส่ Groq API key (ฟรี สมัครที่ console.groq.com)
cp backend/.env.example backend/.env
# แก้ GROQ_API_KEY=gsk_...  ใน backend/.env

# 3. รัน
docker compose up --build

# เปิด http://localhost:5174
```

---

## วิธีรัน (Local — ไม่ใช้ Docker)

**Backend**
```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # ใส่ GROQ_API_KEY
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev   # http://localhost:5174
```

---

## API Endpoints

| Method | Path | ทำอะไร |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/onboard` | ทักทายผู้ใช้ครั้งแรก |
| POST | `/api/chat` | คุยกับน้องเที่ยว (multi-turn) |
| POST | `/api/quest` | สุ่มเควสตามเลเวล (รองรับ `focus:"souvenir"` = เควสของฝาก) |
| POST | `/api/recommend` | แนะนำสถานที่ตามความชอบ/วันเดินทาง/เทศกาล |
| POST | `/api/souvenirs` | แนะนำของฝากท้องถิ่น |
| POST | `/api/verify` | ตรวจรูปเควส/ดวงตราด้วย AI vision (บังคับรูป + กันโกง) |
| POST | `/api/badge` | สร้าง Badge หลังทำเควสสำเร็จ |

> Leaderboard และ "เช็คอินชุมชน" ใช้ **Firebase Firestore** จากฝั่งเว็บโดยตรง (ไม่ผ่าน backend)

---

## ระบบเลเวล

| Level | Thai | XP ที่ต้องการ |
|---|---|---|
| Beginner | นักเที่ยวมือใหม่ | 0 |
| Explorer | นักสำรวจ | 200 |
| Adventurer | นักผจญภัย | 600 |
| Master | เซียนสงขลา | 1,200 |

---

## ทีมผู้พัฒนา

โปรเจกต์นี้สร้างขึ้นเพื่อการแข่งขัน **I-New Gen** เพื่อส่งเสริมการท่องเที่ยวในจังหวัดสงขลา
