import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import { forgotPassword } from "../services/auth";
import AuthLayout from "./AuthLayout";
import { EMAIL_RE, FormAlert, SubmitButton, TextField } from "./AuthFields";

const RESEND_COOLDOWN = 60;

const ForgotPassword = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    const t = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(t);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const send = async (e) => {
    e?.preventDefault();
    const value = email.trim();
    if (!value) return setError("Enter your email address");
    if (!EMAIL_RE.test(value)) return setError("Enter a valid email address");
    setLoading(true);
    setFormError("");
    const res = await forgotPassword(value);
    setLoading(false);
    if (res.success) {
      setSentTo(value);
      startCooldown();
    } else {
      setFormError(res.message);
    }
  };

  const backToLogin = (
    <Link to="/login" state={{ email }} className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
      <FiArrowLeft size={14} /> Back to sign in
    </Link>
  );

  if (sentTo) {
    return (
      <AuthLayout title="Check your email" footer={backToLogin}>
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
            <FiMail size={26} />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            If an account exists for <span className="font-semibold text-slate-900">{sentTo}</span>, we've sent a link to reset your password.
            The link expires in <span className="font-semibold">15 minutes</span>.
          </p>
          <p className="text-xs text-slate-500 mt-4">Didn't get it? Check your spam folder, or make sure you signed up with email (not Google or Apple).</p>
          <button
            type="button"
            onClick={() => send()}
            disabled={cooldown > 0 || loading}
            className="mt-6 text-sm font-semibold text-emerald-600 hover:text-emerald-700 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            {loading ? "Sending…" : cooldown > 0 ? `Resend link in ${cooldown}s` : "Resend link"}
          </button>
          <div className="mt-3">
            <button type="button" onClick={() => setSentTo(null)} className="text-xs text-slate-500 hover:text-slate-700 underline">
              Use a different email
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Forgot your password?" subtitle="Enter the email you signed up with and we'll send you a reset link." footer={backToLogin}>
      <form onSubmit={send} noValidate className="space-y-4">
        <FormAlert>{formError}</FormAlert>
        <TextField
          id="fp-email"
          label="Email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
            setFormError("");
          }}
          error={error}
          disabled={loading}
        />
        <SubmitButton loading={loading} loadingText="Sending link…">
          Send reset link
        </SubmitButton>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
