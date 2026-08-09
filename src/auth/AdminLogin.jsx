import { useEffect, useState } from "react";
import logo from "../../Images/logo.png";
import Icon from "../components/Icon";

export default function AdminLogin({ checkingAuth, isAuthenticated, navigate, onSignIn }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!checkingAuth && isAuthenticated) navigate("/admin/menu", { replace: true });
  }, [checkingAuth, isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await onSignIn(password);
      if (!result.success) setError("Incorrect password.");
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth || isAuthenticated) {
    return <main className="admin-auth-loading" aria-live="polite">Checking admin session...</main>;
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login" aria-labelledby="admin-login-title">
        <img className="admin-login__mascot" src={logo} alt="GingerDish chef mascot" />
        <h1 id="admin-login-title"><span>GingerDish</span> Admin</h1>

        <form className="admin-login__card" onSubmit={handleSubmit} noValidate>
          <label htmlFor="admin-password">Password</label>
          <div className="admin-password-field">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => { setPassword(event.target.value); setError(""); }}
              autoComplete="current-password"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "admin-login-error" : undefined}
              autoFocus
            />
            <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"}>
              <Icon name={showPassword ? "eyeOff" : "eye"} size={20} />
            </button>
          </div>
          {error && <p className="admin-login__error" id="admin-login-error" role="alert">{error}</p>}
          <button className="admin-login__submit" type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
        </form>
      </section>
    </main>
  );
}
