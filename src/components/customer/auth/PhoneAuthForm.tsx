"use client";

import { useState } from "react";

export function PhoneAuthForm({ onVerified }: { onVerified?: (userData: any) => void }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setStep("otp");
      }
    } catch (err: any) {
      setError("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });
      const payload = await res.json();

      if (payload.error) {
        setError(payload.error);
      } else {
        if (onVerified) onVerified(payload.data.user);
      }
    } catch (err: any) {
      setError("Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)]">
      <h2 className="text-xl font-sans text-[var(--text-primary)] font-semibold mb-4 text-center">
        {step === "phone" ? "Sign In" : "Verify OTP"}
      </h2>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-[var(--state-error)]/10 border border-[var(--state-error)]/20 text-[var(--state-error)] text-sm">
          {error}
        </div>
      )}

      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-1" htmlFor="phone">
              Phone Number (with country code)
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-md text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-md bg-[var(--accent-primary)] text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-1" htmlFor="otp">
              6-Digit Code
            </label>
            <input
              id="otp"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-md text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-md bg-[var(--accent-primary)] text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>

          <div className="text-center mt-4">
             <button
               type="button"
               onClick={() => setStep("phone")}
               className="text-sm text-[var(--accent-primary)] hover:underline"
             >
               Change phone number
             </button>
          </div>
        </form>
      )}
    </div>
  );
}
