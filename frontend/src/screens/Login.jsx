import { Button, ErrorBox, LangToggle } from "../components/ui";
import { useT } from "../lib/i18n.jsx";

export default function Login({ auth, onGuest }) {
  const { signInGoogle, error, enabled } = auth;
  const { t } = useT();

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-8 text-center">
      <div className="absolute right-4 top-4">
        <LangToggle />
      </div>
      <div>
        <img src="/logo.svg" alt="TiewHatyai" className="mx-auto h-20 w-20 rounded-2xl shadow-md" />
        <h1 className="mt-3 text-3xl font-extrabold text-deep">{t("app.title")}</h1>
        <p className="mt-1 text-slate-500">{t("login.subtitle")}</p>
      </div>

      <div className="w-full space-y-3">
        {enabled && (
          <button
            onClick={signInGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-deep shadow-sm transition duration-200 hover:bg-slate-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep/40 focus-visible:ring-offset-2"
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
