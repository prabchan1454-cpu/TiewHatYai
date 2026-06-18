import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { ErrorBox } from "../components/ui";
import Mascot from "../components/Mascot";
import { useT } from "../lib/i18n.jsx";
import { Trash2, Send, ArrowRight, ImagePlus, X } from "lucide-react";

const CHAT_KEY = "travelsongkhla_chat_v1";
const MAX_HISTORY = 40;
const IMG_MAX_PX = 800;

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

async function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, IMG_MAX_PX / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
        resolve({
          dataUrl,
          base64: dataUrl.split(",")[1],
          mime: "image/jpeg",
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Inline bold/italic parser
function formatInline(text) {
  return String(text)
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
      if (part.startsWith("*") && part.endsWith("*"))
        return <em key={i}>{part.slice(1, -1)}</em>;
      return part;
    });
}

// Full markdown-lite renderer: headers, bullets, numbered lists, paragraphs
function renderRich(text) {
  const lines = String(text).split("\n");
  const out = [];
  let listBuf = [];
  let listType = null; // "ul" | "ol"

  function flushList() {
    if (!listBuf.length) return;
    const Tag = listType === "ol" ? "ol" : "ul";
    out.push(
      <Tag
        key={`list-${out.length}`}
        className={`my-1.5 space-y-0.5 pl-4 ${listType === "ol" ? "list-decimal" : "list-disc"}`}
      >
        {listBuf.map((item, j) => (
          <li key={j} className="leading-relaxed">{formatInline(item)}</li>
        ))}
      </Tag>
    );
    listBuf = [];
    listType = null;
  }

  lines.forEach((line, i) => {
    // h3
    if (line.startsWith("### ")) {
      flushList();
      out.push(
        <p key={i} className="mt-3 mb-0.5 font-bold text-lagoon text-[13px] tracking-wide uppercase">
          {formatInline(line.slice(4))}
        </p>
      );
    // h2
    } else if (line.startsWith("## ")) {
      flushList();
      out.push(
        <p key={i} className="mt-3 mb-1 font-extrabold text-sm">
          {formatInline(line.slice(3))}
        </p>
      );
    // unordered list
    } else if (/^[-•]\s/.test(line)) {
      if (listType !== "ul") { flushList(); listType = "ul"; }
      listBuf.push(line.replace(/^[-•]\s/, ""));
    // ordered list
    } else if (/^\d+\.\s/.test(line)) {
      if (listType !== "ol") { flushList(); listType = "ol"; }
      listBuf.push(line.replace(/^\d+\.\s/, ""));
    // blank line → spacer
    } else if (line.trim() === "") {
      flushList();
      if (out.length > 0) out.push(<div key={`sp-${i}`} className="h-1.5" />);
    // plain text
    } else {
      flushList();
      out.push(
        <p key={i} className="leading-relaxed">{formatInline(line)}</p>
      );
    }
  });
  flushList();
  return out;
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
  const [pendingImg, setPendingImg] = useState(null); // { dataUrl, base64, mime }
  const endRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => { saveMessages(messages); }, [messages]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send(text) {
    const content = (text ?? input).trim();
    if ((!content && !pendingImg) || loading) return;
    setInput("");
    setError("");
    const userMsg = {
      role: "user",
      content: content || (pendingImg ? "🖼️" : ""),
      ...(pendingImg ? { image_base64: pendingImg.base64, image_mime: pendingImg.mime, _thumb: pendingImg.dataUrl } : {}),
    };
    setPendingImg(null);
    const next = [...messages, userMsg];
    const trimmed = next.slice(-MAX_HISTORY);
    setMessages(trimmed);
    setLoading(true);
    try {
      const { reply } = await api.chat(trimmed.map(({ _thumb, ...m }) => m));
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setPendingImg(compressed);
    e.target.value = "";
  }

  function clearChat() {
    setMessages([]);
    setError("");
    setPendingImg(null);
    saveMessages([]);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
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
          <div
            key={i}
            className={`flex items-end gap-2 animate-float-up ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-lagoon/15 ring-1 ring-lagoon/30 shadow-[0_0_8px_rgba(15,185,177,0.3)]">
                <Mascot size={30} />
              </span>
            )}
            <div
              className={`max-w-[80%] rounded-3xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "rounded-br-md bg-gradient-to-br from-sunset to-orange-500 text-white shadow-[0_4px_12px_rgba(255,122,69,0.3)]"
                  : "rounded-bl-md bg-slate-100 text-slate-800 border border-lagoon/20 shadow-sm dark:bg-[#0f2033] dark:text-slate-200 dark:border-lagoon/15 dark:shadow-[0_0_12px_rgba(15,185,177,0.08)]"
              }`}
            >
              {/* Image thumbnail (user messages with photo) */}
              {m._thumb && (
                <img
                  src={m._thumb}
                  alt=""
                  className="mb-2 w-full max-w-[200px] rounded-2xl object-cover"
                />
              )}
              {m.role === "assistant" ? renderRich(m.content) : (
                m.content !== "🖼️" ? <p className="leading-relaxed">{m.content}</p> : null
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-end gap-2 justify-start animate-float-up">
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

        {/* Quick starter chips after first greeting */}
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

        {/* Image preview strip */}
        {pendingImg && (
          <div className="flex items-center gap-2 rounded-2xl border border-lagoon/30 bg-lagoon/8 px-3 py-2">
            <img src={pendingImg.dataUrl} alt="" className="h-14 w-14 rounded-xl object-cover shrink-0" />
            <p className="flex-1 text-xs text-lagoon font-medium">รูปภาพพร้อมส่ง</p>
            <button
              onClick={() => setPendingImg(null)}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-lagoon hover:bg-rose-500/20 hover:text-rose-400 transition"
              aria-label="ลบรูป"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Hidden file input */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {/* Image attach button */}
          <button
            onClick={() => fileRef.current?.click()}
            aria-label="แนบรูปภาพ"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:border-lagoon/60 hover:text-lagoon active:scale-95 dark:border-white/10 dark:text-slate-400"
          >
            <ImagePlus className="h-5 w-5" />
          </button>

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
            disabled={loading || (!input.trim() && !pendingImg)}
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
