"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function OwnerLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/staff-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await res.json();

      if (payload.error) {
        setError(payload.error);
      } else {
        // Set cookie so middleware can detect session on subsequent page loads
        document.cookie = `supabase-session=${payload.data.session.access_token}; path=/; max-age=${payload.data.session.expires_in}; samesite=lax`;
        // Redirect to dashboard shell
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError("Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)]">
      <h2 className="text-xl font-sans text-[var(--text-primary)] font-semibold mb-4 text-center">
        Staff Login
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-[var(--state-error)]/10 border border-[var(--state-error)]/20 text-[var(--state-error)] text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="staff@tableqr.pro"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-md text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-md text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 rounded-md bg-[var(--accent-primary)] text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
