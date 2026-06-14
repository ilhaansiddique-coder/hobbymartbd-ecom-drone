"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { UploadDropzone } from "@/components/admin/local-upload";
import { FONT_OPTIONS } from "@/lib/site-config";

type Settings = {
  companyName: string;
  logoUrl: string | null;
  email: string;
  phone: string;
  address: string;
  whatsappNumber: string;
  whatsappText: string;
  primaryColor: string;
  fontFamily: string;
  footerTagline: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
};

const EMPTY: Settings = {
  companyName: "", logoUrl: "", email: "", phone: "", address: "",
  whatsappNumber: "", whatsappText: "", primaryColor: "#2563eb", fontFamily: "sans",
  footerTagline: "", facebookUrl: "", instagramUrl: "", youtubeUrl: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Settings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => { if (d.settings) setForm({ ...EMPTY, ...d.settings }); })
      .finally(() => setLoading(false));
  }, []);

  const set = (k: keyof Settings, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Settings saved — changes are live across the site");
    } catch {
      toast.error("Failed to save settings");
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

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Branding, contact info, theme, and WhatsApp — applied across the whole site.</p>
        </div>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
      </div>

      <div className="space-y-6">
        {/* Branding */}
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Branding</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Company name</label>
              <input className={inputClass} value={form.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="HobbyMart" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Footer tagline</label>
              <input className={inputClass} value={form.footerTagline} onChange={(e) => set("footerTagline", e.target.value)} placeholder="Bangladesh's premier drone shop" />
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
          </div>
        </section>

        {/* Theme */}
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Theme & Fonts</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Primary color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.primaryColor} onChange={(e) => set("primaryColor", e.target.value)} className="h-10 w-14 cursor-pointer rounded border" />
                <input className={inputClass} value={form.primaryColor} onChange={(e) => set("primaryColor", e.target.value)} placeholder="#2563eb" />
              </div>
              <p className="mt-1 text-xs text-gray-400">Buttons, links and accents use this color.</p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Font</label>
              <select className={inputClass} value={form.fontFamily} onChange={(e) => set("fontFamily", e.target.value)}>
                {FONT_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
              <input className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="hello@hobbymart-bd.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
              <input className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+880 1XXX XXXXXX" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Address</label>
              <input className={inputClass} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Shop, Level, Area, City" />
            </div>
          </div>
        </section>

        {/* WhatsApp */}
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">WhatsApp Chat</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">WhatsApp number</label>
              <input className={inputClass} value={form.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} placeholder="8801XXXXXXXXX (country code, no +)" />
              <p className="mt-1 text-xs text-gray-400">Leave empty to hide the chat button.</p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Pre-filled message</label>
              <input className={inputClass} value={form.whatsappText} onChange={(e) => set("whatsappText", e.target.value)} placeholder="Hello! I have a question..." />
            </div>
          </div>
        </section>

        {/* Social */}
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Social Links</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Facebook</label>
              <input className={inputClass} value={form.facebookUrl || ""} onChange={(e) => set("facebookUrl", e.target.value)} placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Instagram</label>
              <input className={inputClass} value={form.instagramUrl || ""} onChange={(e) => set("instagramUrl", e.target.value)} placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">YouTube</label>
              <input className={inputClass} value={form.youtubeUrl || ""} onChange={(e) => set("youtubeUrl", e.target.value)} placeholder="https://youtube.com/..." />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
