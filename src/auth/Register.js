import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isAuthenticated, registerUser } from "../services/auth";
import AuthLayout from "./AuthLayout";
import { Divider, EMAIL_RE, FormAlert, PasswordField, PasswordStrength, SocialSignIn, SubmitButton, TextField, validateNewPassword } from "./AuthFields";
import useSocialAuth from "./useSocialAuth";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [existingAccount, setExistingAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const refs = { name: useRef(null), email: useRef(null), password: useRef(null), confirmPassword: useRef(null) };

  useEffect(() => {
    if (isAuthenticated()) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const onAuthenticated = (user, isNewUser) => {
    const name = user?.fullName?.split(" ")[0] || "there";
    toast.success(isNewUser === false ? `Welcome back, ${name}!` : `Welcome to ByteBodh, ${name}! 🎉`);
    navigate("/dashboard", { replace: true });
  };

  const social = useSocialAuth(onAuthenticated);
  const busy = loading || social.googleLoading || social.appleLoading;

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: null }));
    if (formError) {
      setFormError("");
      setExistingAccount(false);
    }
  };

  const validate = () => {
    const next = {};
    const name = form.name.trim();
    if (!name) next.name = "Enter your full name";
    else if (name.length < 2) next.name = "Name looks too short";
    else if (name.length > 100) next.name = "Use 100 characters or fewer";
    if (!form.email.trim()) next.email = "Enter your email address";
    else if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address";
    const pwError = validateNewPassword(form.password);
    if (pwError) next.password = pwError;
    if (!form.confirmPassword) next.confirmPassword = "Confirm your password";
    else if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords don't match";
    if (!agreed) next.terms = "Please accept the Terms and Privacy Policy";
    setErrors(next);
    const first = ["name", "email", "password", "confirmPassword"].find((k) => next[k]);
    if (first) refs[first].current?.focus();
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy || !validate()) return;
    setLoading(true);
    setFormError("");
    const res = await registerUser(form);
    setLoading(false);
    if (res.success) {
      onAuthenticated(res.data?.user, true);
    } else {
      setFormError(res.message);
      setExistingAccount(/already (registered|exists)/i.test(res.message || ""));
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Build your portfolio and bio link page in minutes"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SocialSignIn {...social} disabled={busy} googleText="signup_with" />

      <Divider>or sign up with email</Divider>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
        <FormAlert>
          {formError}
          {existingAccount && (
            <>
              {" "}
              <Link to="/login" state={{ email: form.email }} className="underline font-bold">
                Sign in instead
              </Link>
            </>
          )}
        </FormAlert>
        )}

        <TextField ref={refs.name} id="reg-name" label="Full name" autoComplete="name" autoFocus placeholder="Priya Sharma" maxLength={100}
          value={form.name} onChange={update("name")} error={errors.name} disabled={busy} />

        <TextField ref={refs.email} id="reg-email" label="Email address" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com"
          value={form.email} onChange={update("email")} error={errors.email} disabled={busy} />

        <div>
          <PasswordField ref={refs.password} id="reg-password" label="Password" autoComplete="new-password" placeholder="Create a strong password" maxLength={100}
            value={form.password} onChange={update("password")} error={errors.password} disabled={busy} />
          <PasswordStrength password={form.password} />
        </div>

        <PasswordField ref={refs.confirmPassword} id="reg-confirm" label="Confirm password" autoComplete="new-password" placeholder="Re-enter your password" maxLength={100}
          value={form.confirmPassword} onChange={update("confirmPassword")} error={errors.confirmPassword} disabled={busy} />

        <div>
          <label className="flex items-start gap-2.5 text-sm text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (errors.terms) setErrors((er) => ({ ...er, terms: null }));
              }}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-emerald-600"
              disabled={busy}
            />
            <span>
              I agree to the{" "}
              <Link to="/terms-and-conditions" target="_blank" className="font-semibold text-emerald-600 hover:underline">Terms</Link> and{" "}
              <Link to="/privacy-policy" target="_blank" className="font-semibold text-emerald-600 hover:underline">Privacy Policy</Link>
            </span>
          </label>
          {errors.terms && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.terms}</p>}
        </div>

        <SubmitButton loading={loading} loadingText="Creating account…" disabled={busy && !loading}>
          Create account
        </SubmitButton>
      </form>
    </AuthLayout>
  );
};

export default Register;
