import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { ErrorBox } from "../components/ui";
import Mascot from "../components/Mascot";
import { useT } from "../lib/i18n.jsx";
import { Trash2 } from "lucide-react";

const CHAT_KEY = "travelsongkhla_chat_v1";
// Keep at most this many messages in memory & localStorage to prevent the
// context window from ballooning. We always keep the most-recent messages.
const MAX_HISTORY = 40;

function loadMessages() {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* corrupted — start fresh */ }
  return [];
}

function saveMessages(msgs) {
  try {
    localStorage.setItem(CHAT_KEY, JSON.stringify(msgs));
  } catch { /* storage full — silently skip */ }
}

export default function Chat({ greeting }) {
  const { t } = useT();
  const STARTERS = [t("chat.starter.1"), t("chat.starter.2"), t("chat.starter.3")];

  const [messages, setMessages] = useState(() => {
    const saved = loadMessages();
    if (saved.length > 0) return saved;
    return greeting ? [{ role: "assistant", content: greeting }] : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  // Persist every time messages change.
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    setError("");
    const next = [...messages, { role: "user", content }];
    // Trim before sending so we never blow the context window.
    const trimmed = next.slice(-MAX_HISTORY);
    setMessages(trimmed);
    setLoading(true);
    try {
      const { reply } = await api.chat(trimmed);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
    setError("");
    saveMessages([]);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 no-scrollbar">
        {messages.length === 0 && (
          <div className="mt-12 flex flex-col items-center text-center text-slate-500 dark:text-slate-400">
            <Mascot size={104} float interactive />
            <p className="mt-3 max-w-[16rem] text-sm">{t("chat.empty")}</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm dark:bg-slate-800 dark:shadow-none">
                <Mascot size={30} />
              </span>
            )}
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-3xl px-4 py-2.5 leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-md bg-sunset text-white"
                  : "rounded-bl-md bg-white text-deep shadow-sm dark:bg-slate-800 dark:text-slate-100 dark:shadow-none"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm dark:bg-slate-800 dark:shadow-none">
              <Mascot size={30} />
            </span>
            <div className="rounded-3xl rounded-bl-md bg-white px-4 py-3 shadow-sm dark:bg-slate-800 dark:shadow-none">
              <span className="flex gap-1">
                <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="space-y-2 border-t border-slate-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <ErrorBox message={error} />
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-deep transition duration-200 hover:border-sunset hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              aria-label={t("chat.clear")}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-slate-400 transition hover:border-rose-300 hover:text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 dark:border-slate-700 dark:text-slate-500 dark:hover:text-rose-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t("chat.placeholder")}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-deep outline-none transition placeholder:text-slate-400 focus:border-sunset focus:ring-2 focus:ring-sunset/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
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
      className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"
      style={{ animationDelay: delay }}
    />
  );
}
