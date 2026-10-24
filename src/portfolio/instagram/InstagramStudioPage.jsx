import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiBarChart2, FiCheckCircle, FiExternalLink, FiGrid, FiHome, FiInstagram, FiMessageCircle, FiRefreshCw, FiSend, FiShield, FiZap,
} from "react-icons/fi";
import DashboardLayout from "../components/DashboardLayout";
import igStudioApi, { parseApiError, RECONNECT_CODES } from "../../api/instagramStudioApi";
import { Avatar, Button, Card, ErrorNotice, IG_GRADIENT, Skeleton } from "./ui";
import { formatNumber } from "./format";
import OverviewTab from "./OverviewTab";
import ContentTab from "./ContentTab";
import PublishTab from "./PublishTab";
import InboxTab from "./InboxTab";
import InsightsTab from "./InsightsTab";
import MediaDrawer from "./MediaDrawer";

const TABS = [
  { id: "overview", label: "Overview", icon: <FiHome /> },
  { id: "content", label: "Content", icon: <FiGrid /> },
  { id: "publish", label: "Publish", icon: <FiSend /> },
  { id: "inbox", label: "Inbox", icon: <FiMessageCircle /> },
  { id: "insights", label: "Insights", icon: <FiBarChart2 /> },
];

const PERMISSIONS = [
  { icon: <FiInstagram />, title: "Profile & posts", desc: "See your profile, followers and published content" },
  { icon: <FiMessageCircle />, title: "Messages", desc: "Read and reply to DMs, including Human Agent replies" },
  { icon: <FiGrid />, title: "Comments", desc: "Reply to, hide and remove comments on your posts" },
  { icon: <FiSend />, title: "Publishing", desc: "Post photos, reels, stories and carousels" },
  { icon: <FiBarChart2 />, title: "Insights", desc: "Views, reach, engagement and audience demographics" },
];

export default function InstagramStudioPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.id === params.get("tab")) ? params.get("tab") : "overview";

  const [profile, setProfile] = useState(null);
  const [state, setState] = useState("loading"); // loading | ready | not_connected | reconnect | error
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [openMedia, setOpenMedia] = useState(null);
  const [contentKey, setContentKey] = useState(0);
  // Account works, but some features need permissions granted after it was first connected
  const [missingPermission, setMissingPermission] = useState(null);

  const loadProfile = useCallback(async (silent = false) => {
    if (!silent) setState("loading");
    setError(null);
    try {
      const p = await igStudioApi.getProfile();
      setProfile(p);
      setState("ready");
    } catch (e) {
      const pe = parseApiError(e, "Couldn't reach Instagram.");
      if (silent && !RECONNECT_CODES.includes(pe.code)) return; // keep current view on background refresh failures
      setError(pe);
      if (pe.status === 404 || pe.code === "RESOURCE_NOT_FOUND" || pe.code === "INSTAGRAM_ACCOUNT_DISCONNECTED") setState("not_connected");
      else if (RECONNECT_CODES.includes(pe.code)) setState("reconnect");
      else setState("error");
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Tab-level errors: an expired/revoked token locks the Studio; a missing permission only shows a banner
  const handleTabError = useCallback((pe) => {
    if (!pe) return;
    if (pe.code === "INSTAGRAM_PERMISSION_DENIED") {
      setMissingPermission(pe.message);
    } else if (RECONNECT_CODES.includes(pe.code)) {
      setError(pe);
      setState("reconnect");
    }
  }, []);

  // Back from Instagram OAuth (?status=success|error) — show the result and clean the URL
  useEffect(() => {
    const status = params.get("status");
    if (!status) return;
    if (status === "success") {
      toast.success(`🎉 Instagram ${params.get("username") ? `@${params.get("username")} ` : ""}connected!`);
      setMissingPermission(null);
    } else {
      toast.error(params.get("message") || "Instagram connection was cancelled or failed.");
    }
    const keepTab = params.get("tab");
    setParams(keepTab ? { tab: keepTab } : {}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTab = (id) => {
    setParams(id === "overview" ? {} : { tab: id }, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const connect = async () => {
    setConnecting(true);
    try {
      // The OAuth callback lands on the Automation page; it forwards back here when this is set.
      try {
        sessionStorage.setItem("ig_return_to", `/instagram-studio${tab !== "overview" ? `?tab=${tab}` : ""}`);
        sessionStorage.setItem("ig_return_to_at", String(Date.now()));
      } catch {
        /* storage unavailable — user just lands on Automation */
      }
      const res = await igStudioApi.getConnectUrl();
      if (res?.authorizationUrl) window.location.href = res.authorizationUrl;
      else throw new Error("No authorization URL");
    } catch (e) {
      toast.error(parseApiError(e, "Could not start Instagram connection.").message);
      setConnecting(false);
    }
  };

  /* ---------------------------- Not connected / reconnect ---------------------------- */
  if (state === "not_connected" || state === "reconnect") {
    const reconnect = state === "reconnect";
    return (
      <DashboardLayout containerClassName="">
        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden">
            <div className={`${IG_GRADIENT} px-6 sm:px-10 py-10 text-white`}>
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-5">
                <FiInstagram size={28} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{reconnect ? "Reconnect your Instagram account" : "Connect Instagram to ByteBodh Studio"}</h1>
              <p className="text-white/85 mt-2 max-w-xl text-sm sm:text-base">
                {reconnect
                  ? error?.message || "Your Instagram session expired or new permissions are needed. Reconnect to keep everything working."
                  : "Manage posts, comments, DMs and analytics for your Instagram professional account — all from one dashboard."}
              </p>
            </div>
            <div className="p-6 sm:p-10">
              <h2 className="text-sm font-bold text-slate-800 mb-4">ByteBodh will be able to:</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {PERMISSIONS.map((p) => (
                  <div key={p.title} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-pink-600 flex items-center justify-center flex-shrink-0">{p.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{p.title}</div>
                      <div className="text-xs text-slate-500">{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <Button size="lg" onClick={connect} loading={connecting} icon={<FiInstagram />}>
                  {reconnect ? "Reconnect Instagram" : "Connect Instagram"}
                </Button>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <FiShield /> Requires a Business or Creator account. You can disconnect anytime. We never see your password.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  /* ---------------------------------- Connected ---------------------------------- */
  return (
    <DashboardLayout containerClassName="">
      <div className="space-y-6">
        {/* Profile header */}
        <Card className="overflow-hidden">
          <div className={`${IG_GRADIENT} h-20 sm:h-24`} />
          <div className="px-5 sm:px-6 pb-5">
            <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-5">
              <div className="-mt-10 sm:-mt-12 flex-shrink-0">
                {state === "loading" ? (
                  <Skeleton className="w-24 h-24 rounded-full border-4 border-white" />
                ) : (
                  <div className="rounded-full border-4 border-white bg-white shadow-sm w-fit">
                    <Avatar src={profile?.profilePictureUrl} name={profile?.username} size={88} ring />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 md:pt-3">
                {state === "loading" ? (
                  <>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-72 mt-2" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl font-black text-slate-900 tracking-tight">{profile?.name || profile?.username}</h1>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <FiCheckCircle size={11} /> Connected
                      </span>
                      {profile?.accountType && <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full capitalize">{profile.accountType.toLowerCase().replace("_", " ")}</span>}
                    </div>
                    <a href={`https://instagram.com/${profile?.username}`} target="_blank" rel="noreferrer" className="text-sm text-slate-500 hover:text-pink-600 inline-flex items-center gap-1">
                      @{profile?.username} <FiExternalLink size={12} />
                    </a>
                    {profile?.biography && <p className="text-sm text-slate-600 mt-1 line-clamp-2 max-w-2xl">{profile.biography}</p>}
                  </>
                )}
              </div>
              <div className="flex items-center gap-6 md:pt-3">
                {[
                  { label: "Posts", value: profile?.mediaCount },
                  { label: "Followers", value: profile?.followersCount },
                  { label: "Following", value: profile?.followsCount },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-lg font-extrabold text-slate-900 tabular-nums">{state === "loading" ? "–" : formatNumber(s.value)}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-slate-200 px-2 sm:px-4 flex items-center gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  tab === t.id ? "border-pink-500 text-pink-600" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1 pl-2">
              <button onClick={() => navigate("/instagram-automation")} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-500 hover:text-pink-600 rounded-lg whitespace-nowrap" title="Comment-to-DM automation rules">
                <FiZap /> Automation
              </button>
              <button onClick={() => loadProfile(true)} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg" aria-label="Refresh profile" title="Refresh">
                <FiRefreshCw size={15} />
              </button>
            </div>
          </div>
        </Card>

        {state === "error" && <ErrorNotice error={error} onRetry={() => loadProfile()} />}

        {state === "ready" && missingPermission && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-900">Some features need extra Instagram permissions</p>
              <p className="text-xs text-amber-800 mt-0.5">
                Your account is connected and Automation keeps working. To use Publishing and Insights, reconnect once and approve the new permissions.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={() => setMissingPermission(null)}>
                Dismiss
              </Button>
              <Button size="sm" onClick={connect} loading={connecting} icon={<FiInstagram />}>
                Reconnect Instagram
              </Button>
            </div>
          </div>
        )}

        {state === "ready" && (
          <div>
            {tab === "overview" && <OverviewTab onNavigate={setTab} onOpenMedia={setOpenMedia} onError={handleTabError} />}
            {tab === "content" && <ContentTab onOpenMedia={setOpenMedia} refreshKey={contentKey} onError={handleTabError} />}
            {tab === "publish" && <PublishTab profile={profile} onError={handleTabError} onPublished={() => { setContentKey((k) => k + 1); loadProfile(true); }} />}
            {tab === "inbox" && <InboxTab onError={handleTabError} />}
            {tab === "insights" && <InsightsTab onError={handleTabError} />}
          </div>
        )}
      </div>

      <MediaDrawer media={openMedia} onClose={() => setOpenMedia(null)} onUpdate={setOpenMedia} />
    </DashboardLayout>
  );
}
