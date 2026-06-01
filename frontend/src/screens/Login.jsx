import { Button, ErrorBox } from "../components/ui";

export default function Login({ auth, onGuest }) {
  const { signInGoogle, error, enabled } = auth;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-8 text-center">
      <div>
        <div className="text-6xl">🗺️</div>
        <h1 className="mt-3 text-3xl font-extrabold text-deep">เที่ยวหาดใหญ่</h1>
        <p className="mt-1 text-slate-500">เข้าสู่ระบบเพื่อเริ่มผจญภัยกับน้องเที่ยว</p>
      </div>

      <div className="w-full space-y-3">
        {enabled && (
          <button
            onClick={signInGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-deep shadow-sm transition active:scale-95 hover:bg-slate-50"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt=""
              className="h-5 w-5"
            />
            เข้าสู่ระบบด้วย Google
          </button>
        )}

        <Button variant={enabled ? "ghost" : "primary"} onClick={onGuest} className="w-full">
          {enabled ? "ข้ามไปก่อน (ใช้แบบ guest)" : "เริ่มเลย 🚀"}
        </Button>
      </div>

      <ErrorBox message={error} />
    </div>
  );
}
