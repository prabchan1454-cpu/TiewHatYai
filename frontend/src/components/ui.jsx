export function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-bold transition active:scale-95 disabled:opacity-50 disabled:active:scale-100";
  const variants = {
    primary: "bg-sunset text-white shadow-lg shadow-sunset/30 hover:brightness-105",
    soft: "bg-white text-deep border border-slate-200 hover:bg-slate-50",
    lagoon: "bg-lagoon text-white shadow-lg shadow-lagoon/30 hover:brightness-105",
    ghost: "text-deep hover:bg-slate-100",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-3xl bg-white p-5 shadow-sm shadow-slate-200/60 ${className}`}>
      {children}
    </div>
  );
}

const RARITY = {
  Common: "bg-slate-100 text-slate-600",
  Rare: "bg-sky-100 text-sky-700",
  Epic: "bg-violet-100 text-violet-700",
  Legendary: "bg-amber-100 text-amber-700",
};

const DIFFICULTY = {
  Easy: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-rose-100 text-rose-700",
};

export function Pill({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-600",
    sunset: "bg-orange-100 text-sunset",
    lagoon: "bg-teal-100 text-lagoon",
    ...RARITY,
    ...DIFFICULTY,
  };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${tones[children] || tones[tone]}`}>
      {children}
    </span>
  );
}

export function Spinner({ label = "น้องเที่ยวกำลังคิด..." }) {
  return (
    <div className="flex items-center gap-3 text-slate-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sunset" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</div>
  );
}
