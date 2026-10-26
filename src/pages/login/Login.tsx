
import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import usePageMetadata from "../../hooks/usePageMetadata";
import "../../styles/AdminTheme.css";

export default function Login() {
  usePageMetadata(
    "Sign In — Mustafa Portfolio",
    "Sign in to the private portfolio management workspace.",
    false,
  );
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const isAuthenticated =
    sessionStorage.getItem("isLoggedIn") === "true";

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const pass = import.meta.env.VITE_Admin_Pass;
    const mail = import.meta.env.VITE_Admin_Email;

    if (
      password === pass &&
      email.trim().toLowerCase() === String(mail).trim().toLowerCase()
    ) {
      sessionStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard", { replace: true });
    } else {
      setError("The email or password you entered is incorrect.");
    }
  }

  return (
    <main className="login-page">
      <form onSubmit={handleLogin} className="login-panel">
        <div className="login-mark" aria-hidden="true">MA</div>
        <p className="login-eyebrow">PRIVATE WORKSPACE</p>
        <h1 className="login-title">
          Welcome <em>back.</em>
        </h1>
        <p className="login-description">
          Sign in to manage your selected work and portfolio.
        </p>

        <div className="login-fields">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p className="login-error" role="alert">{error}</p>}

        <button type="submit" className="login-submit">
          Sign in <span aria-hidden="true">↗</span>
        </button>

        <p className="login-footer">AUTHORIZED ACCESS ONLY</p>
      </form>
    </main>
  );
}
