import { Button } from "../components/ui";

const FEATURES = [
  { icon: "💬", title: "น้องเที่ยว", desc: "ไกด์ AI ตอบทุกเรื่องหาดใหญ่" },
  { icon: "🎯", title: "เควสผจญภัย", desc: "ทำภารกิจสะสม XP เลเวลอัป" },
  { icon: "⭐", title: "ที่เที่ยวเด็ด", desc: "แนะนำตามสไตล์ที่คุณชอบ" },
  { icon: "🏅", title: "สะสมรางวัล", desc: "ปลดล็อกตราสัญลักษณ์หายาก" },
];

export default function Landing({ onStart }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-gradient-to-b from-sunset via-mango to-lagoon px-6 py-10 text-white">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="text-7xl drop-shadow-lg">🗺️</div>
        <h1 className="mt-4 text-4xl font-extrabold drop-shadow">เที่ยวหาดใหญ่</h1>
        <p className="mt-2 text-lg font-medium text-white/90">
          ผจญภัยทั่วเมืองหาดใหญ่กับน้องเที่ยว ไกด์ AI ส่วนตัวของคุณ
        </p>

        <div className="mt-8 grid w-full grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-white/15 p-4 text-left backdrop-blur-sm"
            >
              <div className="text-2xl">{f.icon}</div>
              <p className="mt-1 font-bold">{f.title}</p>
              <p className="text-xs text-white/80">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={onStart}
        variant="soft"
        className="w-full text-lg text-sunset"
      >
        เริ่มผจญภัย 🚀
      </Button>
    </div>
  );
}
