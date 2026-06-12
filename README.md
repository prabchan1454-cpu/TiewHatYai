# เที่ยวสงขลา · Travel Songkhla 🧜‍♀️🗺️

> แอปไกด์ท่องเที่ยว **จังหวัดสงขลา** (หาดใหญ่ · เมืองเก่า · สมิหลา · เกาะยอ) พร้อม AI ส่วนตัว **"น้องเที่ยว"** ระบบเควสผจญภัย และสะสม Badge  
> ส่งประกวดรายการ **I-New Gen**

![Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi) ![Groq](https://img.shields.io/badge/AI-Groq%20Free%20Tier-F55036) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

---

## ฟีเจอร์หลัก

| ฟีเจอร์ | รายละเอียด |
|---|---|
| 🏠 **หน้าหลัก** | Dashboard แสดง Level / XP / เควสที่กำลังทำ / Badge ที่สะสม |
| 💬 **น้องเที่ยว** | Chatbot AI ตอบทุกเรื่องสงขลา (หาดใหญ่–เมืองสงขลา–เกาะยอ) ไทย/อังกฤษ |
| 🎯 **เควสผจญภัย** | รับภารกิจสำรวจเมือง ส่งหลักฐาน (รูปภาพ + คำอธิบาย) AI ตรวจสอบ |
| ⭐ **แนะนำที่เที่ยว** | AI แนะนำ 3 สถานที่ตามสไตล์และความชอบส่วนตัว |
| 🏅 **รางวัล / Badge** | ปลดล็อก Badge หายาก 4 ระดับ (Common → Legendary) |
| 📈 **ระบบเลเวล** | สะสม XP อัปเลเวล 4 ขั้น ตั้งแต่มือใหม่จนถึงเซียน |

---

## Tech Stack

```
Frontend  │ React 18 + Vite 6 + TailwindCSS 3  (mobile-first)
Backend   │ Python FastAPI  (stateless AI proxy)
AI        │ Groq Free Tier — llama-3.3-70b-versatile (Thai text)
          │                  llama-4-scout-17b (vision / รูปภาพ)
State     │ localStorage  (ไม่มี database — รันได้ทันที)
Deploy    │ Docker Compose  (frontend nginx + backend uvicorn)
```

---

## โครงสร้างโปรเจกต์

```
travel-songkhla/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── main.py        # FastAPI routes
│       ├── ai_client.py   # Groq client + retry logic
│       ├── prompts.py     # 6 system prompts
│       └── schemas.py     # Pydantic models
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── App.jsx
        ├── screens/       # Landing · Onboarding · Home · Chat · Quests · Recommend · Achievements
        ├── components/    # ui.jsx (Button · Card · Pill · Spinner)
        └── lib/           # api.js · progress.js
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
| POST | `/api/quest` | สุ่มเควสตามเลเวลและที่เที่ยว |
| POST | `/api/recommend` | แนะนำสถานที่ตามความชอบ |
| POST | `/api/verify` | ตรวจสอบการทำเควส (รองรับรูปภาพ) |
| POST | `/api/badge` | สร้าง Badge หลังทำเควสสำเร็จ |

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
