import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { ErrorBox } from "../components/ui";
import Mascot from "../components/Mascot";
import { useT } from "../lib/i18n.jsx";
import { Trash2, Send, ArrowRight } from "lucide-react";

const CHAT_KEY = "travelsongkhla_chat_v1";
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

function renderRich(text) {
  return String(text)
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    );
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

  useEffect(() => { saveMessages(messages); }, [messages]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    setError("");
    const next = [...messages, { role: "user", content }];
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
      {/* NPC nameplate header */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-quest-light px-4 py-3 dark:border-white/8 dark:bg-quest-dark">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-lagoon/20 ring-2 ring-lagoon/40 shadow-[0_0_10px_rgba(15,185,177,0.4)]">
          <Mascot size={38} />
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-100 bg-emerald-400 dark:border-[#0e1a2e]" />
        </div>
        <div className="flex-1">
          <p className="font-extrabold text-slate-900 leading-tight dark:text-white">น้องเที่ยว</p>
          <p className="text-[11px] text-lagoon">ไกด์สงขลา · ออนไลน์</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            aria-label={t("chat.clear")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-rose-500/40 hover:text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40 dark:border-white/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Message list */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 no-scrollbar">
        {messages.length === 0 && (
          <div className="mt-10 flex flex-col items-center text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-lagoon/20 blur-xl animate-glow-pulse" />
              <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-lagoon/10 ring-2 ring-lagoon/30">
                <Mascot size={88} float interactive />
              </div>
            </div>
            <p className="mt-4 max-w-[15rem] text-sm text-slate-500 dark:text-slate-400">{t("chat.empty")}</p>
            <div className="mt-5 flex flex-col gap-2 w-full px-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="flex items-center gap-2.5 rounded-2xl border border-lagoon/20 bg-lagoon/8 px-4 py-2.5 text-left text-sm font-semibold text-lagoon transition hover:bg-lagoon/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon/40"
                >
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-lagoon/15 ring-1 ring-lagoon/30 shadow-[0_0_8px_rgba(15,185,177,0.3)]">
                <Mascot size={30} />
              </span>
            )}
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-3xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-md bg-gradient-to-br from-sunset to-orange-500 text-white shadow-[0_4px_12px_rgba(255,122,69,0.3)]"
                  : "rounded-bl-md bg-slate-100 text-slate-800 border border-lagoon/20 shadow-sm dark:bg-[#0f2033] dark:text-slate-200 dark:border-lagoon/15 dark:shadow-[0_0_12px_rgba(15,185,177,0.08)]"
              }`}
            >
              {m.role === "assistant" ? renderRich(m.content) : m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-lagoon/15 ring-1 ring-lagoon/30">
              <Mascot size={30} />
            </span>
            <div className="rounded-3xl rounded-bl-md bg-slate-100 border border-lagoon/20 px-4 py-3 dark:bg-[#0f2033] dark:border-lagoon/15">
              <span className="flex gap-1">
                <Dot color="bg-lagoon/60" /> <Dot color="bg-lagoon/60" delay="150ms" /> <Dot color="bg-lagoon/60" delay="300ms" />
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md space-y-2 dark:border-white/8 dark:bg-deep/80">
        <ErrorBox message={error} />
        {messages.length === 1 && (
          <div className="flex flex-col gap-1.5">
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="flex items-center gap-2 rounded-xl border border-lagoon/20 bg-lagoon/8 px-3 py-2 text-left text-xs font-semibold text-lagoon transition hover:bg-lagoon/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon/40"
              >
                <ArrowRight className="h-3 w-3 shrink-0" /> {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            aria-label={t("chat.placeholder")}
            placeholder={t("chat.placeholder")}
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-lagoon/60 focus:ring-2 focus:ring-lagoon/20 dark:border-white/10 dark:bg-white/6 dark:text-white dark:placeholder:text-slate-500"
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sunset to-mango shadow-[0_4px_12px_rgba(255,122,69,0.35)] transition duration-200 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Dot({ color = "bg-slate-400", delay = "0ms" }) {
  return (
    <span
      className={`h-2 w-2 animate-bounce rounded-full ${color}`}
      style={{ animationDelay: delay }}
    />
  );
}
