import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-decoration register-decoration"><span>CREATE</span><span>SHARE</span><span>INSPIRE</span></div>
      <div className="auth-card">
        <Link to="/" className="brand auth-brand"><span className="brand-mark">H</span><span>hash<span>node</span></span></Link>
        <div className="auth-heading">
          <span className="section-kicker">JOIN THE COMMUNITY</span>
          <h1>Create your account.</h1>
          <p>Start publishing your technical ideas and connect with developers around the world.</p>
        </div>
        <form className="auth-form" onSubmit={submit}>
          <label className="field"><span>Display name</span><input required value={form.name} placeholder="Your name" onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="field"><span>Email address</span><input required type="email" value={form.email} placeholder="you@example.com" onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label className="field"><span>Password</span><input required minLength="6" type="password" value={form.password} placeholder="At least 6 characters" onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="button button-primary button-full" disabled={loading}>{loading ? "Creating account…" : "Create account →"}</button>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
}