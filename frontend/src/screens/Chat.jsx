import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { ErrorBox } from "../components/ui";
import { useT } from "../lib/i18n.jsx";

export default function Chat({ greeting }) {
  const { t } = useT();
  const STARTERS = [t("chat.starter.1"), t("chat.starter.2"), t("chat.starter.3")];
  const [messages, setMessages] = useState(() =>
    greeting ? [{ role: "assistant", content: greeting }] : []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    setError("");
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setLoading(true);
    try {
      const { reply } = await api.chat(next);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 no-scrollbar">
        {messages.length === 0 && (
          <div className="mt-12 flex flex-col items-center text-center text-slate-500">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-4xl shadow-card">
              🐘
            </span>
            <p className="mt-3 max-w-[16rem] text-sm">{t("chat.empty")}</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-3xl px-4 py-2.5 leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-md bg-sunset text-white"
                  : "rounded-bl-md bg-white text-deep shadow-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-3xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
              <span className="flex gap-1">
                <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="space-y-2 border-t border-slate-200 bg-white/80 px-4 py-3 backdrop-blur">
        <ErrorBox message={error} />
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-deep transition duration-200 hover:border-sunset hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/40"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t("chat.placeholder")}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-deep outline-none transition placeholder:text-slate-400 focus:border-sunset focus:ring-2 focus:ring-sunset/30"
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="rounded-2xl bg-sunset px-5 py-3 font-bold text-white shadow-lg shadow-sunset/30 transition duration-200 hover:brightness-105 active:scale-95 disabled:opacity-50 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset focus-visible:ring-offset-2"
          >
            {t("chat.send")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Dot({ delay = "0ms" }) {
  return (
    <span
      className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
      style={{ animationDelay: delay }}
    />
  );
}
