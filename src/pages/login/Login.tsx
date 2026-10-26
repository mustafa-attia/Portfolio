
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import usePageMetadata from "../../hooks/usePageMetadata";
import RouteLoadingFallback from "../../components/RouteLoadingFallback";
import { checkAuthSession, signIn } from "../../services/auth";
import "../../styles/AdminTheme.css";

export default function Login() {
  usePageMetadata(
    "Sign In — Mustafa Portfolio",
    "Sign in to the private portfolio management workspace.",
    false,
  );
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    checkAuthSession()
      .then((authenticated) => {
        if (active) setIsAuthenticated(authenticated);
      })
      .catch((authError: unknown) => {
        if (active) {
          setError(
            authError instanceof Error
              ? authError.message
              : "Unable to verify your session.",
          );
        }
      })
      .finally(() => {
        if (active) setIsCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (await signIn(email, password)) {
        setIsAuthenticated(true);
      } else {
        setError("The email or password you entered is incorrect.");
      }
    } catch (authError: unknown) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Unable to sign in right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCheckingSession) return <RouteLoadingFallback />;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function clearError() {
    setError("");
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    clearError();
  }

  function handlePasswordChange(value: string) {
    setPassword(value);
    clearError();
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
            onChange={(event) => handleEmailChange(event.target.value)}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => handlePasswordChange(event.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p className="login-error" role="alert">{error}</p>}

        <button
          type="submit"
          className="login-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}{" "}
          <span aria-hidden="true">↗</span>
        </button>

        <p className="login-footer">AUTHORIZED ACCESS ONLY</p>
      </form>
    </main>
  );
}
