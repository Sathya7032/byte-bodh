import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isAuthenticated, loginUser } from "../services/auth";
import AuthLayout from "./AuthLayout";
import { Divider, EMAIL_RE, FormAlert, PasswordField, SocialSignIn, SubmitButton, TextField } from "./AuthFields";
import useSocialAuth from "./useSocialAuth";

const resolveRedirect = (state) => {
  const from = state?.from;
  const path = typeof from === "string" ? from : from?.pathname ? `${from.pathname}${from.search || ""}` : null;
  // Only allow in-app relative paths (prevents open redirects)
  return path && path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/login") ? path : "/dashboard";
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = resolveRedirect(location.state);

  const [form, setForm] = useState({ email: location.state?.email || "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const sessionExpired = new URLSearchParams(location.search).get("session") === "expired";
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated()) navigate(redirectTo, { replace: true });
  }, [navigate, redirectTo]);

  const onAuthenticated = (user) => {
    const name = user?.fullName?.split(" ")[0] || user?.username || "there";
    toast.success(`Welcome back, ${name}!`);
    navigate(redirectTo, { replace: true });
  };

  const social = useSocialAuth(onAuthenticated);
  const busy = loading || social.googleLoading || social.appleLoading;

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: null }));
    if (formError) setFormError("");
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Enter your email address";
    else if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address";
    if (!form.password) next.password = "Enter your password";
    setErrors(next);
    if (next.email) emailRef.current?.focus();
    else if (next.password) passwordRef.current?.focus();
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy || !validate()) return;
    setLoading(true);
    setFormError("");
    const res = await loginUser(form);
    setLoading(false);
    if (res.success) {
      onAuthenticated(res.data?.user);
    } else {
      setFormError(res.message);
      setForm((f) => ({ ...f, password: "" }));
      passwordRef.current?.focus();
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your portfolio and bio links"
      footer={
        <>
          New to ByteBodh?{" "}
          <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <SocialSignIn {...social} disabled={busy} />

      <Divider>or sign in with email</Divider>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError ? (
          <FormAlert>{formError}</FormAlert>
        ) : sessionExpired ? (
          <FormAlert type="info">Your session has expired. Please sign in again.</FormAlert>
        ) : null}

        <TextField
          ref={emailRef}
          id="login-email"
          label="Email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus={!form.email}
          placeholder="you@example.com"
          value={form.email}
          onChange={update("email")}
          error={errors.email}
          disabled={busy}
        />

        <PasswordField
          ref={passwordRef}
          id="login-password"
          label="Password"
          autoComplete="current-password"
          autoFocus={Boolean(form.email)}
          placeholder="Enter your password"
          value={form.password}
          onChange={update("password")}
          error={errors.password}
          disabled={busy}
          right={
            <Link to="/forgot-password" state={{ email: form.email }} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
              Forgot password?
            </Link>
          }
        />

        <SubmitButton loading={loading} loadingText="Signing in…" disabled={busy && !loading}>
          Sign in
        </SubmitButton>
      </form>

      <p className="mt-5 text-center text-xs text-slate-400">
        By continuing you agree to our{" "}
        <Link to="/terms-and-conditions" className="underline hover:text-slate-600">Terms</Link> and{" "}
        <Link to="/privacy-policy" className="underline hover:text-slate-600">Privacy Policy</Link>.
      </p>
    </AuthLayout>
  );
};

export default Login;
