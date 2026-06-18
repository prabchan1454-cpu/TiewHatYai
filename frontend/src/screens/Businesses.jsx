// Local business directory + self-service registration. The monetization &
// economic-value pillar: any owner can list a shop for free, add a photo and a
// promotion. Plan tiers (Free / Pro / Premium) are shown as the upsell.
import { useEffect, useState } from "react";
import { useT } from "../lib/i18n.jsx";
import { addBusiness, fetchBusinesses } from "../lib/businesses";
import { Button, ErrorBox, Spinner } from "../components/ui";
import { ArrowLeft, Store, Plus, Camera, X, Tag, Phone, MapPin, BadgePercent } from "lucide-react";

const CATS = [
  { id: "food", key: "biz.cat.food" },
  { id: "cafe", key: "biz.cat.cafe" },
  { id: "shop", key: "biz.cat.shop" },
  { id: "stay", key: "biz.cat.stay" },
  { id: "service", key: "biz.cat.service" },
];

function downscaleImage(file, max = 480, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function Businesses({ auth, onBack }) {
  const { t } = useT();
  const [list, setList] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("food");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [promo, setPromo] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setList(await fetchBusinesses(50));
  }
  useEffect(() => { load(); }, []);

  function reset() {
    setName(""); setCategory("food"); setArea(""); setDescription("");
    setPromo(""); setPhone(""); setPhoto(null); setError("");
  }

  async function submit() {
    if (!name.trim() || saving) return;
    setSaving(true); setError("");
    try {
      const image = photo ? await downscaleImage(photo) : null;
      const ok = await addBusiness({
        name: name.trim(), category, area: area.trim(), description: description.trim(),
        promo: promo.trim(), phone: phone.trim(), image,
        ownerUid: auth?.user?.uid || null, ownerName: auth?.user?.displayName || "",
      });
      if (!ok) { setError(t("biz.failed")); }
      else { reset(); setShowForm(false); await load(); }
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 p-4 pb-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} aria-label="back" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/8 dark:hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex-1">
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">{t("biz.title")}</h1>
          <p className="text-[11px] font-medium text-slate-500 dark:text-white/50">{t("biz.subtitle")}</p>
        </div>
      </div>

      {/* Register toggle */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sunset to-mango py-3.5 font-bold text-white shadow-[0_4px_16px_rgba(255,122,69,0.4)] transition active:scale-95"
        >
          <Plus className="h-5 w-5" /> {t("biz.register")}
        </button>
      )}

      {/* Registration form */}
      {showForm && (
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/8 dark:bg-[#0e1a2e]">
          <div className="flex items-center justify-between">
            <p className="font-bold text-slate-900 dark:text-white">{t("biz.formTitle")}</p>
            <button onClick={() => { setShowForm(false); reset(); }} className="text-xs font-semibold text-slate-500 hover:text-slate-700">{t("biz.cancel")}</button>
          </div>

          <Field label={t("biz.name")}>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} className={INPUT} placeholder={t("biz.name")} />
          </Field>

          <Field label={t("biz.category")}>
            <div className="flex flex-wrap gap-1.5">
              {CATS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    category === c.id ? "bg-lagoon text-white" : "border border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
                  }`}
                >
                  {t(c.key)}
                </button>
              ))}
            </div>
          </Field>

          <Field label={t("biz.area")}>
            <input value={area} onChange={(e) => setArea(e.target.value)} maxLength={40} className={INPUT} placeholder="เช่น หาดใหญ่ / เมืองเก่า" />
          </Field>

          <Field label={t("biz.desc")}>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} maxLength={160} className={INPUT} placeholder={t("biz.desc")} />
          </Field>

          <Field label={t("biz.promo")}>
            <input value={promo} onChange={(e) => setPromo(e.target.value)} maxLength={80} className={INPUT} placeholder={t("biz.promoPlaceholder")} />
          </Field>

          <Field label={t("biz.phone")}>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} inputMode="tel" className={INPUT} placeholder={t("biz.phone")} />
          </Field>

          {/* Photo */}
          {photo ? (
            <div className="relative overflow-hidden rounded-2xl">
              <img src={URL.createObjectURL(photo)} alt="" className="h-36 w-full object-cover" />
              <button onClick={() => setPhoto(null)} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                <Camera className="h-4 w-4" /> {t("biz.addPhoto")}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
            </label>
          )}

          <ErrorBox message={error} />
          <Button variant="game" onClick={submit} disabled={!name.trim() || saving} className="w-full">
            {saving ? t("biz.submitting") : t("biz.submit")}
          </Button>
          <p className="text-center text-[11px] text-slate-400 dark:text-white/35">{t("biz.tiers")}</p>
        </div>
      )}

      {/* Directory */}
      {list === null ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/8 dark:bg-[#0e1a2e]"><Spinner label="..." /></div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 dark:border-white/8 dark:bg-[#0e1a2e]">
          <Store className="mx-auto mb-2 h-8 w-8 text-slate-300" />
          {t("biz.empty")}
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((b) => (
            <div key={b.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/8 dark:bg-[#0e1a2e]">
              {b.image && <img src={b.image} alt="" className="max-h-44 w-full object-cover" />}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold leading-snug text-slate-900 dark:text-white">{b.name}</h3>
                  <span className="shrink-0 rounded-full bg-lagoon/12 px-2.5 py-0.5 text-[11px] font-bold text-lagoon">
                    {t(`biz.cat.${b.category}`)}
                  </span>
                </div>
                {b.area && <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-slate-500"><MapPin className="h-3 w-3" /> {b.area}</p>}
                {b.description && <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{b.description}</p>}
                {b.promo && (
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-sunset/12 px-2.5 py-1.5 text-xs font-bold text-sunset">
                    <BadgePercent className="h-3.5 w-3.5" /> {b.promo}
                  </p>
                )}
                <div className="mt-2.5 flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                  {b.phone && <a href={`tel:${b.phone}`} className="inline-flex items-center gap-1 text-lagoon"><Phone className="h-3 w-3" /> {b.phone}</a>}
                  <span className="ml-auto inline-flex items-center gap-1"><Tag className="h-3 w-3" /> {t("biz.views", { n: b.views || 0 })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const INPUT =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-lagoon/60 focus:ring-2 focus:ring-lagoon/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500";

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-slate-500 dark:text-slate-400">{label}</label>
      {children}
    </div>
  );
}
