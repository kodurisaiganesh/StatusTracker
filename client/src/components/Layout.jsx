import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { HiCheck, HiSun, HiMoon } from "react-icons/hi2";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem("dark") === "1");

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("dark", dark ? "1" : "0");
  }, [dark]);

  const signOut = () => { logout(); navigate("/login"); };
  const initial = user?.name?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <div className="brand-icon"><HiCheck /></div>
          TaskFlow
        </Link>
        <div className="topbar-nav">
          <button className="icon-btn" onClick={() => setDark(v => !v)} title="Toggle theme">
            {dark ? <HiSun /> : <HiMoon />}
          </button>
          <div className="user-pill">
            <div className="avatar">{initial}</div>
            <span>{user?.name}</span>
          </div>
          <button className="logout-btn" onClick={signOut}>Sign out</button>
        </div>
      </header>
      <main className="container"><Outlet /></main>
    </div>
  );
}