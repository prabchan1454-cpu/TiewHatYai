# เที่ยวหาดใหญ่ · TiewHatyai 🗺️

แอปแนะนำที่เที่ยวหาดใหญ่ พร้อมไกด์ AI **"น้องเที่ยว"** ระบบเควส และ Achievement
ส่งประกวดรายการ **I-New Gen**

- **Frontend**: React 18 + Vite + TailwindCSS (มือถือเป็นหลัก)
- **Backend**: FastAPI — proxy เรียก Google Gemini API (`gemini-2.5-flash`, ฟรีทีเออร์)
- **AI**: Google Gemini — 6 prompts (chat / quest / recommend / verify / onboard / badge)
- ความคืบหน้าผู้ใช้ (level, XP, เควส, badge) เก็บใน `localStorage` — backend ไม่มี state

## โครงสร้าง

```
TiewHatyai/
├── backend/   FastAPI + Anthropic SDK
│   └── app/   main.py · prompts.py · schemas.py · claude_client.py
└── frontend/  React + Vite + Tailwind
    └── src/   screens/ · components/ · lib/
```

## วิธีรัน

### 1) Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env        # แล้วใส่ GEMINI_API_KEY ของจริง
uvicorn app.main:app --reload --port 8000
```

> รับ API key ฟรีที่ https://aistudio.google.com/app/apikey

### 2) Frontend

```bash
cd frontend
npm install
npm run dev      # เปิด http://localhost:5174
```

Vite proxy ส่ง `/api/*` ไปที่ backend `localhost:8000` อัตโนมัติ

## API Endpoints

| Method | Path | Prompt | ใช้ตอน |
|---|---|---|---|
| POST | `/api/onboard` | 5 | เปิดแอปครั้งแรก (ทักทาย) |
| POST | `/api/chat` | 1 | คุยกับน้องเที่ยว |
| POST | `/api/quest` | 2 | สุ่มเควสตามเลเวล |
| POST | `/api/recommend` | 3 | แนะนำ 3 ที่ตามความชอบ |
| POST | `/api/verify` | 4 | ยืนยันทำเควสสำเร็จ (แนบรูปได้) |
| POST | `/api/badge` | 6 | สร้างคำอธิบาย badge |

## ระบบเลเวล

| เลเวล | XP | ความยากเควส |
|---|---|---|
| Beginner (นักเที่ยวมือใหม่) | 0 | Easy |
| Explorer (นักสำรวจ) | 200 | Medium |
| Adventurer (นักผจญภัย) | 600 | Hard |
| Master (เซียนหาดใหญ่) | 1200 | Hard |
