import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { ErrorBox } from "../components/ui";

const STARTERS = [
  "แนะนำของกินเด็ดๆ หน่อย 🍜",
  "มีที่เที่ยวเงียบๆ ไหม",
  "ของฝากหาดใหญ่ซื้ออะไรดี",
];

export default function Chat({ greeting }) {
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
          <div className="mt-10 text-center text-slate-400">
            <div className="text-4xl">🐘</div>
            <p className="mt-2">ทักน้องเที่ยวได้เลย!</p>
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
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-deep"
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
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sunset"
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="rounded-2xl bg-sunset px-5 py-3 font-bold text-white disabled:opacity-50"
          >
            ส่ง
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
