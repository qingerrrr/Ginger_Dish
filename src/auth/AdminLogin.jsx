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
    return <main className="grid min-h-screen place-items-center bg-[#fff7df] p-6 text-center font-ginger-body text-[.85rem] leading-[1.4] font-semibold text-ginger-muted" aria-live="polite">Checking admin session...</main>;
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#fff4cf] pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <section className="w-[calc(100%-32px)] max-w-[400px] text-center max-[340px]:w-[calc(100%-24px)]" aria-labelledby="admin-login-title">
        <img className="mx-auto mb-2.5 aspect-square w-[clamp(92px,29vw,124px)] object-contain" src={logo} alt="GingerDish chef mascot" />
        <h1 className="mt-0 mb-[22px] flex flex-col items-center text-ginger-text font-ginger-heading text-[1.2rem] leading-[1.05] font-bold tracking-[.08em] uppercase" id="admin-login-title"><span className="text-ginger-red-dark text-[clamp(2rem,10vw,2.65rem)] tracking-[-.02em]">Ginger Dish</span> Admin</h1>

        <form className="rounded-[22px] border border-ginger-border bg-white px-5 py-6 text-left shadow-ginger-card max-[340px]:px-4 max-[340px]:py-[21px]" onSubmit={handleSubmit} noValidate>
          <label className="mb-2 block text-[.82rem] font-bold" htmlFor="admin-password">Password</label>
          <div className="relative">
            <input
              className="h-[50px] w-full rounded-full border-[1.5px] border-[#ead8bc] bg-[#fffefa] pr-12 pl-4 font-ginger-body text-[.9rem] leading-none text-ginger-text outline-0 focus:border-ginger-red focus:shadow-[0_0_0_3px_rgba(232,69,63,.1)] aria-invalid:border-ginger-red-dark"
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => { setPassword(event.target.value); setError(""); }}
              autoComplete="current-password"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "admin-login-error" : undefined}
              autoFocus
            />
            <button className="absolute top-1/2 right-[7px] grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-ginger-muted" type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"}>
              <Icon name={showPassword ? "eyeOff" : "eye"} size={20} />
            </button>
          </div>
          {error && <p className="mt-[7px] min-h-[17px] px-[3px] text-[.72rem] font-semibold text-ginger-red-dark" id="admin-login-error" role="alert">{error}</p>}
          <button className="mt-[18px] min-h-12 w-full cursor-pointer rounded-[14px] border-0 bg-ginger-red-dark px-4 font-ginger-body text-[.86rem] leading-none font-bold tracking-[.05em] text-white uppercase shadow-[0_7px_16px_rgba(202,47,44,.18)] disabled:cursor-wait disabled:opacity-[.68]" type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
        </form>
      </section>
    </main>
  );
}
