import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const configuredAdminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase();

function isConfiguredAdmin(user) {
  return Boolean(configuredAdminEmail && user?.email?.toLowerCase() === configuredAdminEmail);
}

export default function useAdminAuth() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const validSession = isConfiguredAdmin(data.session?.user) ? data.session : null;
      setSession(validSession);
      setCheckingAuth(false);
      if (data.session && !validSession) void supabase.auth.signOut();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      const validSession = isConfiguredAdmin(nextSession?.user) ? nextSession : null;
      setSession(validSession);
      setCheckingAuth(false);
      if (nextSession && !validSession) window.setTimeout(() => { void supabase.auth.signOut(); }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (password) => {
    if (!configuredAdminEmail) return { success: false };

    const { data, error } = await supabase.auth.signInWithPassword({
      email: configuredAdminEmail,
      password,
    });

    if (error || !isConfiguredAdmin(data.user)) {
      if (data.session) await supabase.auth.signOut();
      return { success: false };
    }

    setSession(data.session);
    return { success: true };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  return {
    checkingAuth,
    isAuthenticated: Boolean(session),
    signIn,
    signOut,
  };
}
