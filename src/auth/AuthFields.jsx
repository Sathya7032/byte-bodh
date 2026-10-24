import React, { forwardRef, useEffect, useRef, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff, FiInfo } from "react-icons/fi";
import { FaApple } from "react-icons/fa";
import { GoogleLogin, useGoogleOAuth } from "@react-oauth/google";

/* ------------------------------------------------------------------
   Form primitives for the auth screens (accessible, consistent).
------------------------------------------------------------------- */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const inputBase =
  "w-full h-11 rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500";
const inputState = (error) =>
  error
    ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
    : "border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export const TextField = forwardRef(({ id, label, error, hint, right, className = "", ...props }, ref) => (
  <div className={className}>
    <div className="flex items-center justify-between mb-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-slate-700">
        {label}
      </label>
      {right}
    </div>
    <input
      ref={ref}
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      className={`${inputBase} ${inputState(error)}`}
      {...props}
    />
    {error ? (
      <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1">
        <FiAlertCircle size={12} /> {error}
      </p>
    ) : hint ? (
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
        {hint}
      </p>
    ) : null}
  </div>
));

export const PasswordField = forwardRef(({ id, label, error, hint, right, className = "", ...props }, ref) => {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const checkCaps = (e) => setCapsLock(Boolean(e.getModifierState && e.getModifierState("CapsLock")));
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="text-[13px] font-semibold text-slate-700">
          {label}
        </label>
        {right}
      </div>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onKeyUp={checkCaps}
          onKeyDown={checkCaps}
          onBlur={() => setCapsLock(false)}
          className={`${inputBase} ${inputState(error)} pr-11`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-r-xl focus:outline-none focus-visible:text-emerald-600"
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={0}
        >
          {visible ? <FiEyeOff size={17} /> : <FiEye size={17} />}
        </button>
      </div>
      {capsLock && !error && (
        <p className="mt-1.5 text-xs font-medium text-amber-600 flex items-center gap-1">
          <FiInfo size={12} /> Caps Lock is on
        </p>
      )}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1">
          <FiAlertCircle size={12} /> {error}
        </p>
      ) : hint && !capsLock ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
});

/** Password rules used for sign-up and reset (backend minimum is 6; we ask for a bit more). */
export const passwordChecks = (pw = "") => [
  { label: "At least 8 characters", ok: pw.length >= 8 },
  { label: "A letter and a number", ok: /[A-Za-z]/.test(pw) && /\d/.test(pw) },
  { label: "An uppercase letter or symbol", ok: /[A-Z]/.test(pw) || /[^A-Za-z0-9]/.test(pw) },
];

export const validateNewPassword = (pw) => {
  if (!pw) return "Create a password";
  if (pw.length < 8) return "Use at least 8 characters";
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return "Include at least one letter and one number";
  if (pw.length > 100) return "Use 100 characters or fewer";
  return null;
};

export const PasswordStrength = ({ password }) => {
  const checks = passwordChecks(password);
  const score = checks.filter((c) => c.ok).length;
  const levels = [
    { label: "Too weak", bar: "bg-rose-500", text: "text-rose-600" },
    { label: "Weak", bar: "bg-rose-500", text: "text-rose-600" },
    { label: "Good", bar: "bg-amber-500", text: "text-amber-600" },
    { label: "Strong", bar: "bg-emerald-500", text: "text-emerald-600" },
  ];
  const level = levels[score];
  if (!password) return null;
  return (
    <div className="mt-2.5" aria-live="polite">
      <div className="flex items-center gap-2">
        <div className="flex-1 grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-1.5 rounded-full transition-colors ${i < score ? level.bar : "bg-slate-200"}`} />
          ))}
        </div>
        <span className={`text-xs font-semibold w-16 text-right ${level.text}`}>{level.label}</span>
      </div>
      <ul className="mt-2 space-y-1">
        {checks.map((c) => (
          <li key={c.label} className={`text-xs flex items-center gap-1.5 ${c.ok ? "text-emerald-600" : "text-slate-500"}`}>
            {c.ok ? <FiCheckCircle size={12} /> : <span className="w-3 h-3 rounded-full border border-slate-300 inline-block" />}
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const FormAlert = ({ type = "error", children }) => {
  if (!children) return null;
  const styles =
    type === "success"
      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
      : type === "info"
      ? "bg-sky-50 border-sky-200 text-sky-800"
      : "bg-rose-50 border-rose-200 text-rose-800";
  const Icon = type === "success" ? FiCheckCircle : type === "info" ? FiInfo : FiAlertCircle;
  return (
    <div role={type === "error" ? "alert" : "status"} className={`flex gap-2.5 items-start rounded-xl border px-3.5 py-3 text-sm ${styles}`}>
      <Icon className="mt-0.5 flex-shrink-0" size={16} />
      <div className="font-medium leading-snug">{children}</div>
    </div>
  );
};

export const SubmitButton = ({ loading, children, loadingText, ...props }) => (
  <button
    type="submit"
    disabled={loading || props.disabled}
    className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
    {...props}
  >
    {loading && <span className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" aria-hidden="true" />}
    {loading ? loadingText || children : children}
  </button>
);

export const Divider = ({ children }) => (
  <div className="relative my-6" role="separator">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-slate-200" />
    </div>
    <div className="relative flex justify-center">
      <span className="bg-white px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{children}</span>
    </div>
  </div>
);

const GoogleMark = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

/**
 * Official Google Identity button. While Google's script loads we show a same-size placeholder;
 * if it can't load (ad-blocker, network, privacy extension) we say so instead of leaving a gap.
 */
const GoogleButton = ({ onSuccess, onError, text, disabled }) => {
  const { scriptLoadedSuccessfully } = useGoogleOAuth();
  const [timedOut, setTimedOut] = useState(false);
  const [renderFailed, setRenderFailed] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (scriptLoadedSuccessfully) return undefined;
    const t = setTimeout(() => setTimedOut(true), 8000);
    return () => clearTimeout(t);
  }, [scriptLoadedSuccessfully]);

  // Script loaded but Google drew no button (e.g. this domain isn't an authorized JS origin in Google Cloud)
  useEffect(() => {
    if (!scriptLoadedSuccessfully) return undefined;
    const t = setTimeout(() => {
      if (wrapRef.current && !wrapRef.current.querySelector("iframe, [role=button]")) setRenderFailed(true);
    }, 4000);
    return () => clearTimeout(t);
  }, [scriptLoadedSuccessfully]);

  const label = text === "signup_with" ? "Sign up with Google" : "Continue with Google";

  if (!scriptLoadedSuccessfully || renderFailed) {
    const failed = timedOut || renderFailed;
    return (
      <div className="w-full max-w-[340px]">
        <div className="h-10 w-full rounded-full border border-slate-300 bg-white flex items-center justify-center gap-2.5 text-sm font-medium text-slate-500">
          <GoogleMark />
          {failed ? "Google sign-in unavailable" : label}
          {!failed && <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" aria-hidden="true" />}
        </div>
        {failed && (
          <p className="mt-1.5 text-[11px] text-center text-slate-500">
            Google couldn't load. Disable ad/privacy blockers for this site or use email below.
          </p>
        )}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={`w-full flex justify-center min-h-[40px] ${disabled ? "pointer-events-none opacity-60" : ""}`}>
      <GoogleLogin onSuccess={onSuccess} onError={onError} theme="outline" size="large" shape="pill" text={text} logo_alignment="center" width="340" />
    </div>
  );
};

/** Google + Apple buttons, identical size. */
export const SocialSignIn = ({ onGoogleSuccess, onGoogleError, onApple, appleLoading, disabled, isApple, googleText = "continue_with" }) => (
  <div className="flex flex-col items-center gap-3">
    <GoogleButton onSuccess={onGoogleSuccess} onError={onGoogleError} text={googleText} disabled={disabled} />
    <button
      type="button"
      onClick={onApple}
      disabled={disabled || appleLoading}
      className="w-full max-w-[340px] h-10 flex items-center justify-center gap-2.5 bg-black hover:bg-neutral-800 text-white rounded-full transition-colors text-sm font-medium disabled:opacity-60 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
    >
      <FaApple className="text-lg" />
      <span>{appleLoading ? "Connecting to Apple…" : "Continue with Apple"}</span>
      {isApple && <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">Mac</span>}
    </button>
  </div>
);
