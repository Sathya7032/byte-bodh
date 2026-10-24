import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { resetPassword } from "../services/auth";
import AuthLayout from "./AuthLayout";
import { FormAlert, PasswordField, PasswordStrength, SubmitButton, TextField, validateNewPassword } from "./AuthFields";

/** Reached from the email link: /reset-password?token=... (token can also be pasted manually). */
const ResetPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const tokenFromUrl = params.get("token") || "";
  const [token, setToken] = useState(tokenFromUrl);
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Remove the token from the address bar / browser history once read.
  useEffect(() => {
    if (tokenFromUrl) window.history.replaceState({}, document.title, "/reset-password");
  }, [tokenFromUrl]);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: null }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!token.trim()) next.token = "Paste the reset code from your email";
    const pw = validateNewPassword(form.password);
    if (pw) next.password = pw;
    if (!form.confirm) next.confirm = "Confirm your new password";
    else if (form.confirm !== form.password) next.confirm = "Passwords don't match";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    const res = await resetPassword(token, form.password, form.confirm);
    setLoading(false);
    if (res.success) {
      setDone(true);
      toast.success("Password updated. Please sign in.");
    } else {
      setFormError(res.message);
    }
  };

  if (done) {
    return (
      <AuthLayout title="Password updated">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
            <FiCheckCircle size={26} />
          </div>
          <p className="text-sm text-slate-600">Your password has been changed and you've been signed out of all devices for security.</p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="mt-6 w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-md shadow-emerald-500/20"
          >
            Sign in with new password
          </button>
        </div>
      </AuthLayout>
    );
  }

  const expired = /expired|invalid/i.test(formError);

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before."
      footer={
        <Link to="/login" className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
          <FiArrowLeft size={14} /> Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
        <FormAlert>
          {formError}
          {expired && (
            <>
              {" "}
              <Link to="/forgot-password" className="underline font-bold">Request a new link</Link>
            </>
          )}
        </FormAlert>
        )}

        {!tokenFromUrl && (
          <TextField id="rp-token" label="Reset code" placeholder="Paste the code from your email" autoComplete="one-time-code"
            value={token} onChange={(e) => { setToken(e.target.value); setErrors((er) => ({ ...er, token: null })); setFormError(""); }}
            error={errors.token} disabled={loading} />
        )}

        <div>
          <PasswordField id="rp-password" label="New password" autoComplete="new-password" autoFocus placeholder="Create a strong password" maxLength={100}
            value={form.password} onChange={update("password")} error={errors.password} disabled={loading} />
          <PasswordStrength password={form.password} />
        </div>

        <PasswordField id="rp-confirm" label="Confirm new password" autoComplete="new-password" placeholder="Re-enter your new password" maxLength={100}
          value={form.confirm} onChange={update("confirm")} error={errors.confirm} disabled={loading} />

        <SubmitButton loading={loading} loadingText="Updating password…">
          Update password
        </SubmitButton>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
