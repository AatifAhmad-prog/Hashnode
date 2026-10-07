import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function ProfileSettings() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", bio: user?.bio || "", avatarUrl: user?.avatarUrl || "" });
  const [message, setMessage] = useState("");

  const save = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/users/me", form);
      setUser(data.user || data);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not update your profile.");
    }
  };

  return (
    <section className="settings-section">
      <div className="settings-header"><span className="section-kicker">ACCOUNT</span><h1>Profile settings</h1><p>Keep your public developer profile up to date.</p></div>
      <form className="settings-card" onSubmit={save}>
        <label className="field"><span>Display name</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label className="field"><span>Short bio</span><textarea maxLength="200" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell the community what you build…" /></label>
        <label className="field"><span>Avatar URL</span><input value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} placeholder="https://…" /></label>
        {message && <div className="save-message">{message}</div>}
        <button className="button button-primary">Save changes →</button>
      </form>
    </section>
  );
}