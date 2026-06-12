import { Button, ErrorBox, LangToggle, ThemeToggle } from "../components/ui";
import Mascot from "../components/Mascot";
import { useT } from "../lib/i18n.jsx";

export default function Login({ auth, onGuest }) {
  const { signInGoogle, error, enabled } = auth;
  const { t } = useT();

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-8 text-center">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <ThemeToggle />
        <LangToggle />
      </div>
      <div className="animate-fade-in">
        {/* น้องเที่ยว greets here too — same warm sunrise treatment as Landing */}
        <div className="relative mx-auto w-fit">
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-mango/30 to-sunset/15"
          />
          <Mascot size={120} float className="relative drop-shadow-[0_8px_14px_rgba(27,42,74,0.18)]" />
        </div>
        <h1 className="mt-3 text-3xl font-extrabold text-deep dark:text-slate-100">{t("app.title")}</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{t("login.subtitle")}</p>
      </div>

      <div className="w-full space-y-3">
        {enabled && (
          <button
            onClick={signInGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-deep shadow-sm transition duration-200 hover:bg-slate-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep/40 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:shadow-none dark:focus-visible:ring-offset-[#0e1525]"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt=""
              className="h-5 w-5"
            />
            {t("login.google")}
          </button>
        )}

        <Button variant={enabled ? "ghost" : "primary"} onClick={onGuest} className="w-full">
          {enabled ? t("login.guestGhost") : t("login.guestPrimary")}
        </Button>
      </div>

      <ErrorBox message={error} />
    </div>
  );
}
