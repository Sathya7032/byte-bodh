import React, { useEffect } from "react";
import { FiAlertTriangle, FiInbox, FiRefreshCw, FiX } from "react-icons/fi";

/* ------------------------------------------------------------------
   Instagram Studio — shared UI primitives (Tailwind)
------------------------------------------------------------------- */

export const IG_GRADIENT = "bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600";

export const Card = ({ className = "", children, ...rest }) => (
  <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`} {...rest}>
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, action, icon }) => (
  <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
    <div className="flex items-start gap-3 min-w-0">
      {icon && <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">{icon}</div>}
      <div className="min-w-0">
        <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

export const Button = ({ variant = "primary", size = "md", loading = false, icon, children, className = "", disabled, ...rest }) => {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  const sizes = { sm: "text-xs px-3 py-1.5", md: "text-sm px-4 py-2.5", lg: "text-sm px-5 py-3" };
  const variants = {
    primary: `${IG_GRADIENT} text-white shadow-md shadow-pink-500/20 hover:shadow-lg hover:shadow-pink-500/30`,
    dark: "bg-slate-900 text-white hover:bg-slate-800",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} disabled={disabled || loading} {...rest}>
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : icon}
      {children}
    </button>
  );
};

export const Badge = ({ tone = "slate", children, className = "" }) => {
  const tones = {
    slate: "bg-slate-100 text-slate-600",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border border-amber-200",
    rose: "bg-rose-50 text-rose-700 border border-rose-200",
    pink: "bg-pink-50 text-pink-700 border border-pink-200",
    violet: "bg-violet-50 text-violet-700 border border-violet-200",
    dark: "bg-slate-900/80 text-white backdrop-blur",
  };
  return <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${tones[tone]} ${className}`}>{children}</span>;
};

export const Skeleton = ({ className = "", ...rest }) => <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} {...rest} />;

export const StatTile = ({ label, value, hint, icon, loading }) => (
  <Card className="p-4 sm:p-5">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
      {icon && <span className="text-slate-400">{icon}</span>}
    </div>
    {loading ? (
      <Skeleton className="h-8 w-24 mt-3" />
    ) : (
      <div className="text-[26px] leading-none font-extrabold text-slate-900 mt-3 tabular-nums tracking-tight">{value}</div>
    )}
    {hint && <p className="text-xs text-slate-500 mt-2 leading-snug">{hint}</p>}
  </Card>
);

export const EmptyState = ({ icon = <FiInbox size={22} />, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-14 px-6">
    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-4">{icon}</div>
    <h4 className="text-sm font-bold text-slate-800">{title}</h4>
    {description && <p className="text-sm text-slate-500 mt-1 max-w-sm">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const ErrorNotice = ({ error, onRetry, compact = false }) => {
  if (!error) return null;
  return (
    <div className={`flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/70 text-rose-800 ${compact ? "p-3" : "p-4"}`}>
      <FiAlertTriangle className="mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{error.message}</p>
        {error.requestId && <p className="text-[11px] text-rose-600/80 mt-1 font-mono">Ref: {error.requestId}</p>}
      </div>
      {onRetry && (
        <button onClick={onRetry} className="text-xs font-semibold inline-flex items-center gap-1 hover:underline flex-shrink-0">
          <FiRefreshCw size={12} /> Retry
        </button>
      )}
    </div>
  );
};

export const SegmentedControl = ({ options, value, onChange, size = "md" }) => (
  <div className="inline-flex p-1 bg-slate-100 rounded-xl" role="tablist">
    {options.map((o) => (
      <button
        key={o.value}
        role="tab"
        aria-selected={value === o.value}
        onClick={() => onChange(o.value)}
        className={`${size === "sm" ? "text-xs px-2.5 py-1" : "text-sm px-3.5 py-1.5"} font-semibold rounded-lg transition-all ${
          value === o.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

export const Toggle = ({ checked, onChange, label, description, disabled }) => (
  <label className={`flex items-start gap-3 ${disabled ? "opacity-50" : "cursor-pointer"}`}>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative mt-0.5 w-9 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-pink-500" : "bg-slate-300"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
    </button>
    {(label || description) && (
      <span>
        {label && <span className="block text-sm font-semibold text-slate-700">{label}</span>}
        {description && <span className="block text-xs text-slate-500 mt-0.5">{description}</span>}
      </span>
    )}
  </label>
);

/** Right-side drawer (full screen on mobile). */
export const Drawer = ({ open, onClose, title, children, width = "max-w-2xl" }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full ${width} bg-slate-50 shadow-2xl flex flex-col`}>
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-800 truncate">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Close">
            <FiX size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export const Avatar = ({ src, name, size = 40, ring = false }) => {
  const initials = (name || "?").replace(/^@/, "").slice(0, 2).toUpperCase();
  const inner = src ? (
    <img src={src} alt={name || ""} className="w-full h-full rounded-full object-cover bg-white" referrerPolicy="no-referrer" />
  ) : (
    <div className="w-full h-full rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center" style={{ fontSize: size * 0.36 }}>
      {initials}
    </div>
  );
  return (
    <div className={`flex-shrink-0 rounded-full ${ring ? `${IG_GRADIENT} p-[2.5px]` : ""}`} style={{ width: size, height: size }}>
      <div className={`w-full h-full rounded-full ${ring ? "bg-white p-[2px]" : ""}`}>{inner}</div>
    </div>
  );
};
