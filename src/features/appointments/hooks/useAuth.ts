"use client";

import { useEffect, useState } from "react";

const AUTH_KEY = "schedula-auth";

type AuthState = { email: string } | null;

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(AUTH_KEY);
      setAuth(stored ? (JSON.parse(stored) as AuthState) : null);
    } catch {
      setAuth(null);
    } finally {
      setReady(true);
    }
  }, []);

  const login = (email: string) => {
    const next = { email };
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(next));
    setAuth(next);
  };

  const logout = () => {
    window.localStorage.removeItem(AUTH_KEY);
    setAuth(null);
  };

  return { auth, ready, login, logout };
}
