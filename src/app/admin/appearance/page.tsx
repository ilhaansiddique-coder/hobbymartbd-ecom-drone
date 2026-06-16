"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import { UploadDropzone } from "@/components/admin/local-upload";
import {
  DEFAULT_FOOTER_COLUMNS,
  DEFAULT_NAV_LINKS,
  type FooterColumn,
  type NavLink,
} from "@/lib/site-config";

type Appearance = {
  companyName: string;
  logoUrl: string | null;
  phone: string;
  email: string;
  topbarEnabled: boolean;
  topbarText: string;
  topbarShowContact: boolean;
  topbarShowTrackOrder: boolean;
  navLinks: NavLink[];
  footerColumns: FooterColumn[];
  copyrightText: string;
};

const EMPTY: Appearance = {
  companyName: "",
  logoUrl: "",
  phone: "",
  email: "",
  topbarEnabled: true,
  topbarText: "",
  topbarShowContact: true,
  topbarShowTrackOrder: true,
  navLinks: DEFAULT_NAV_LINKS,
  footerColumns: DEFAULT_FOOTER_COLUMNS,
  copyrightText: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

// Move an item within an array (immutably). dir = -1 up, +1 down.
function move<T>(arr: T[], i: number, dir: number): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = arr.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-300"}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
      <span>
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        {hint && <span className="block text-xs text-gray-400">{hint}</span>}
      </span>
    </label>
  );
}

export default function AdminAppearancePage() {
  const [form, setForm] = useState<Appearance>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          const s = d.settings;
          setForm({
            companyName: s.companyName ?? "",
            logoUrl: s.logoUrl ?? "",
            phone: s.phone ?? "",
            email: s.email ?? "",
            topbarEnabled: s.topbarEnabled ?? true,
            topbarText: s.topbarText ?? "",
            topbarShowContact: s.topbarShowContact ?? true,
            topbarShowTrackOrder: s.topbarShowTrackOrder ?? true,
            navLinks: Array.isArray(s.navLinks) && s.navLinks.length ? s.navLinks : DEFAULT_NAV_LINKS,
            footerColumns: Array.isArray(s.footerColumns) && s.footerColumns.length ? s.footerColumns : DEFAULT_FOOTER_COLUMNS,
            copyrightText: s.copyrightText ?? "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const set = <K extends keyof Appearance>(k: K, v: Appearance[K]) => setForm((p) => ({ ...p, [k]: v }));

  // ---- nav link helpers ----
  const setNav = (links: NavLink[]) => set("navLinks", links);
  const updateNav = (i: number, patch: Partial<NavLink>) =>
    setNav(form.navLinks.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  const addNav = () => setNav([...form.navLinks, { label: "", href: "" }]);
  const removeNav = (i: number) => setNav(form.navLinks.filter((_, idx) => idx !== i));

  // ---- footer column helpers ----
  const setCols = (cols: FooterColumn[]) => set("footerColumns", cols);
  const updateCol = (ci: number, patch: Partial<FooterColumn>) =>
    setCols(form.footerColumns.map((c, idx) => (idx === ci ? { ...c, ...patch } : c)));
  const addCol = () => setCols([...form.footerColumns, { title: "New column", links: [] }]);
  const removeCol = (ci: number) => setCols(form.footerColumns.filter((_, idx) => idx !== ci));
  const updateColLink = (ci: number, li: number, patch: Partial<NavLink>) =>
    updateCol(ci, { links: form.footerColumns[ci].links.map((l, idx) => (idx === li ? { ...l, ...patch } : l)) });
  const addColLink = (ci: number) => updateCol(ci, { links: [...form.footerColumns[ci].links, { label: "", href: "" }] });
  const removeColLink = (ci: number, li: number) =>
    updateCol(ci, { links: form.footerColumns[ci].links.filter((_, idx) => idx !== li) });

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          // strip blank rows so we don't persist empty links
          navLinks: form.navLinks.filter((l) => l.label.trim() && l.href.trim()),
          footerColumns: form.footerColumns
            .filter((c) => c.title.trim())
            .map((c) => ({ ...c, links: c.links.filter((l) => l.label.trim() && l.href.trim()) })),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Appearance saved — changes are live across the site");
    } catch {
      toast.error("Failed to save appearance");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const SaveBtn = ({ big }: { big?: boolean }) => (
    <button
      onClick={save}
      disabled={saving}
      className={`inline-flex items-center gap-2 rounded-lg bg-blue-600 font-medium text-white hover:bg-blue-700 disabled:opacity-60 ${big ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-sm"}`}
    >
      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Save changes
    </button>
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appearance</h1>
          <p className="mt-1 text-sm text-gray-500">Edit the top bar, header menu, logo and footer — applied across the whole site.</p>
        </div>
        <SaveBtn />
      </div>

      <div className="space-y-6">
        {/* ============ TOP HEADER ============ */}
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">Top Header Bar</h2>
          <p className="mb-4 text-sm text-gray-500">The thin strip above the main header (desktop only).</p>
          <div className="space-y-4">
            <Toggle checked={form.topbarEnabled} onChange={(v) => set("topbarEnabled", v)} label="Show the top bar" />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Announcement text</label>
              <input className={inputClass} value={form.topbarText} onChange={(e) => set("topbarText", e.target.value)} placeholder="Free shipping on orders over ৳5000!" />
              <p className="mt-1 text-xs text-gray-400">Optional message shown in the top bar. Leave empty to hide.</p>
            </div>
            <Toggle checked={form.topbarShowContact} onChange={(v) => set("topbarShowContact", v)} label="Show phone & email" />
            {form.topbarShowContact && (
              <div className="grid gap-4 rounded-xl border bg-gray-50/50 p-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
                  <input className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+880 1XXX XXXXXX" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                  <input className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="hello@hobbymart-bd.com" />
                </div>
                <p className="text-xs text-gray-400 sm:col-span-2">Shown in the top bar and footer “Find Us”. Shared with Site Settings.</p>
              </div>
            )}
            <Toggle checked={form.topbarShowTrackOrder} onChange={(v) => set("topbarShowTrackOrder", v)} label="Show “Track Order” link" />
          </div>
        </section>

        {/* ============ HEADER ============ */}
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">Header</h2>
          <p className="mb-4 text-sm text-gray-500">Logo, brand name and the main navigation menu.</p>

          {/* Logo + name */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Company name</label>
              <input className={inputClass} value={form.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="HobbyMart" />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Logo</label>
            <div className="flex items-center gap-4">
              {form.logoUrl ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-gray-50">
                  <Image src={form.logoUrl} alt="Logo" fill className="object-contain" />
                </div>
              ) : null}
              <div className="flex-1 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-3">
                <UploadDropzone
                  endpoint="blogImage"
                  onClientUploadComplete={(res) => { set("logoUrl", res[0].url); toast.success("Logo uploaded"); }}
                  onUploadError={(e: Error) => toast.error(e.message)}
                />
              </div>
              {form.logoUrl ? (
                <button onClick={() => set("logoUrl", "")} className="text-sm text-red-600 hover:underline">Remove</button>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-gray-400">Shown in the header and footer. PNG/SVG with transparent background works best.</p>
          </div>

          {/* Nav menu CRUD */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Navigation menu</label>
              <button onClick={addNav} className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                <Plus className="h-3.5 w-3.5" /> Add link
              </button>
            </div>
            <p className="mb-3 text-xs text-gray-400">The Categories dropdown is added automatically right after your “Shop” (/products) link.</p>
            <div className="space-y-2">
              {form.navLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border bg-gray-50/50 p-2">
                  <GripVertical className="h-4 w-4 shrink-0 text-gray-300" />
                  <input className={inputClass + " flex-1"} value={link.label} onChange={(e) => updateNav(i, { label: e.target.value })} placeholder="Label (e.g. Home)" />
                  <input className={inputClass + " flex-1"} value={link.href} onChange={(e) => updateNav(i, { href: e.target.value })} placeholder="/path or https://…" />
                  <div className="flex shrink-0 items-center">
                    <button onClick={() => setNav(move(form.navLinks, i, -1))} disabled={i === 0} className="rounded p-1.5 text-gray-400 hover:bg-gray-200 disabled:opacity-30" aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
                    <button onClick={() => setNav(move(form.navLinks, i, 1))} disabled={i === form.navLinks.length - 1} className="rounded p-1.5 text-gray-400 hover:bg-gray-200 disabled:opacity-30" aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
                    <button onClick={() => removeNav(i)} className="rounded p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
              {form.navLinks.length === 0 && <p className="rounded-lg border border-dashed p-4 text-center text-sm text-gray-400">No menu links. Click “Add link”.</p>}
            </div>
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">Footer</h2>
          <p className="mb-4 text-sm text-gray-500">Link columns and the copyright line. (Brand logo, tagline, social links & contact come from Site Settings.)</p>

          <div className="space-y-4">
            {form.footerColumns.map((col, ci) => (
              <div key={ci} className="rounded-xl border bg-gray-50/50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <input
                    className={inputClass + " flex-1 font-semibold"}
                    value={col.title}
                    onChange={(e) => updateCol(ci, { title: e.target.value })}
                    placeholder="Column title (e.g. Useful Links)"
                  />
                  <button onClick={() => setCols(move(form.footerColumns, ci, -1))} disabled={ci === 0} className="rounded p-1.5 text-gray-400 hover:bg-gray-200 disabled:opacity-30" aria-label="Move column up"><ArrowUp className="h-4 w-4" /></button>
                  <button onClick={() => setCols(move(form.footerColumns, ci, 1))} disabled={ci === form.footerColumns.length - 1} className="rounded p-1.5 text-gray-400 hover:bg-gray-200 disabled:opacity-30" aria-label="Move column down"><ArrowDown className="h-4 w-4" /></button>
                  <button onClick={() => removeCol(ci)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /> Column</button>
                </div>
                <div className="space-y-2">
                  {col.links.map((link, li) => (
                    <div key={li} className="flex items-center gap-2">
                      <input className={inputClass + " flex-1"} value={link.label} onChange={(e) => updateColLink(ci, li, { label: e.target.value })} placeholder="Label" />
                      <input className={inputClass + " flex-1"} value={link.href} onChange={(e) => updateColLink(ci, li, { href: e.target.value })} placeholder="/path or https://…" />
                      <button onClick={() => updateCol(ci, { links: move(col.links, li, -1) })} disabled={li === 0} className="rounded p-1.5 text-gray-400 hover:bg-gray-200 disabled:opacity-30" aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
                      <button onClick={() => updateCol(ci, { links: move(col.links, li, 1) })} disabled={li === col.links.length - 1} className="rounded p-1.5 text-gray-400 hover:bg-gray-200 disabled:opacity-30" aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
                      <button onClick={() => removeColLink(ci, li)} className="rounded p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete link"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => addColLink(ci)} className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-white">
                    <Plus className="h-3.5 w-3.5" /> Add link
                  </button>
                </div>
              </div>
            ))}
            <button onClick={addCol} className="inline-flex items-center gap-1 rounded-lg border border-dashed px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Plus className="h-4 w-4" /> Add column
            </button>
          </div>

          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Copyright text</label>
            <input className={inputClass} value={form.copyrightText} onChange={(e) => set("copyrightText", e.target.value)} placeholder="© {year} HobbyMart. All rights reserved." />
            <p className="mt-1 text-xs text-gray-400">Use <code>{"{year}"}</code> for the current year. Leave empty for the default line.</p>
          </div>
        </section>

        <div className="flex justify-end">
          <SaveBtn big />
        </div>
      </div>
    </div>
  );
}
