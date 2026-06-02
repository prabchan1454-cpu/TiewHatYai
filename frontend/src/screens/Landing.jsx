import { Button, LangToggle } from "../components/ui";
import { useT } from "../lib/i18n.jsx";

const FEATURES = [
  { icon: "💬", key: "chat" },
  { icon: "🎯", key: "quest" },
  { icon: "⭐", key: "places" },
  { icon: "🏅", key: "rewards" },
];

export default function Landing({ onStart }) {
  const { t } = useT();
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-gradient-to-b from-sunset via-mango to-lagoon px-6 py-10 text-white">
      <div className="flex justify-end">
        <LangToggle />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <img src="/logo.svg" alt="TiewHatyai" className="h-28 w-28 rounded-3xl shadow-lg" />
        <h1 className="mt-4 text-4xl font-extrabold drop-shadow">{t("app.title")}</h1>
        <p className="mt-2 text-lg font-medium text-white/90">{t("landing.subtitle")}</p>

        <div className="mt-8 grid w-full grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <div
              key={f.key}
              className="rounded-2xl bg-white/15 p-4 text-left backdrop-blur-sm"
            >
              <div className="text-2xl">{f.icon}</div>
              <p className="mt-1 font-bold">{t(`landing.feat.${f.key}.title`)}</p>
              <p className="text-xs text-white/80">{t(`landing.feat.${f.key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={onStart}
        variant="soft"
        className="w-full text-lg text-sunset"
      >
        {t("landing.cta")}
      </Button>
    </div>
  );
}
