import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const requestReset = async () => {
    setError("");
    setForgotMessage("");
    if (!form.email.trim()) {
      setError("Enter your email address first.");
      return;
    }
    try {
      await api.post("/auth/forgot-password", { email: form.email });
      setForgotMessage("If an account exists, reset instructions will be sent to that email.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to request a password reset.");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back." subtitle="Sign in to continue publishing and learning with the community.">
      <form className="auth-form" onSubmit={submit}>
        <Field label="Email address" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@example.com" />
        <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} placeholder="••••••••" />
        <button type="button" className="auth-forgot" onClick={() => setForgotOpen((open) => !open)}>
          Forgot password?
        </button>
        {forgotOpen && <div className="forgot-panel">
          <p>Enter your email and we’ll send reset instructions if an account exists.</p>
          <button type="button" className="button button-ghost button-small" onClick={requestReset}>Send reset instructions</button>
        </div>}
        {forgotMessage && <div className="form-success">{forgotMessage}</div>}
        {error && <div className="form-error">{error}</div>}
        <button className="button button-primary button-full" disabled={loading}>{loading ? "Signing in…" : "Sign in →"}</button>
        <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </AuthLayout>
  );
}

function Field({ label, type, value, onChange, placeholder }) {
  return <label className="field"><span>{label}</span><input required type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} /></label>;
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-decoration"><span>01</span><span>WRITE</span><span>LEARN</span><span>BUILD</span></div>
      <div className="auth-card">
        <Link to="/" className="brand auth-brand"><span className="brand-mark">H</span><span>hash<span>node</span></span></Link>
        <div className="auth-heading"><span className="section-kicker">DEVELOPER PUBLISHING</span><h1>{title}</h1><p>{subtitle}</p></div>
        {children}
      </div>
    </div>
  );
}
