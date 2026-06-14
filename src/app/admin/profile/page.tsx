"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, KeyRound } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", address: "", role: "" });
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => { if (d.user) setProfile({ ...d.user, name: d.user.name || "", phone: d.user.phone || "", address: d.user.address || "" }); })
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, phone: profile.phone, address: profile.address }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async () => {
    if (pw.newPassword.length < 6) return toast.error("New password must be at least 6 characters");
    if (pw.newPassword !== pw.confirm) return toast.error("Passwords do not match");
    setSavingPw(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pw.currentPassword, newPassword: pw.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success("Password changed");
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to change password");
    } finally {
      setSavingPw(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[40vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">My Profile</h1>
      <p className="mb-6 text-sm text-gray-500">Manage your account details and password.</p>

      <div className="space-y-6">
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Account details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
              <input className={inputClass} value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
              <input className={`${inputClass} bg-gray-50 text-gray-500`} value={profile.email} disabled />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
              <input className={inputClass} value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
              <input className={`${inputClass} bg-gray-50 text-gray-500`} value={profile.role} disabled />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Address</label>
              <input className={inputClass} value={profile.address} onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={saveProfile} disabled={savingProfile} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
              {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
            </button>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900"><KeyRound className="h-5 w-5" /> Change password</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Current password</label>
              <input type="password" className={inputClass} value={pw.currentPassword} onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">New password</label>
              <input type="password" className={inputClass} value={pw.newPassword} onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm new</label>
              <input type="password" className={inputClass} value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={changePassword} disabled={savingPw} className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60">
              {savingPw ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Change password
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
