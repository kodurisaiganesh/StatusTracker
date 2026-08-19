import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { HiCheck, HiArrowRight } from "react-icons/hi2";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault(); setError(""); setLoading(true);
    try { await signup(form); navigate("/"); }
    catch (err) { setError(err.response?.data?.message || "Signup failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><HiCheck /></div>
          <span className="auth-logo-text">TaskFlow</span>
        </div>
        <h1>Create account</h1>
        <p className="auth-sub">Start organizing your work today.</p>
        <form onSubmit={submit} className="auth-form">
          {error && <div className="error-box" style={{ marginBottom: 16 }}>{error}</div>}
          <div className="field">
            <label>Full name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" minLength="2" required />
          </div>
          <div className="field">
            <label>Email address</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 characters" minLength="8" required />
          </div>
          <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? "Creating..." : <><span>Create account</span> <HiArrowRight /></>}
          </button>
        </form>
        <p className="auth-footer">Already registered? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}