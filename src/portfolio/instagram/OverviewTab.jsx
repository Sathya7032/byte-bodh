import React, { useCallback, useEffect, useState } from "react";
import { FiEye, FiUsers, FiHeart, FiActivity, FiArrowRight, FiSend, FiMessageCircle, FiBarChart2, FiGrid } from "react-icons/fi";
import igStudioApi, { parseApiError } from "../../api/instagramStudioApi";
import { Card, CardHeader, ErrorNotice, Skeleton, StatTile, Button } from "./ui";
import { AreaChart, Sparkline } from "./charts";
import { formatNumber, mediaTypeLabel, timeAgo } from "./format";

const pick = (totals, name) => totals?.find((t) => t.name === name)?.value ?? null;

export default function OverviewTab({ onNavigate, onOpenMedia, onError }) {
  const [insights, setInsights] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [ins, med] = await Promise.allSettled([igStudioApi.getAccountInsights(28), igStudioApi.getMedia(null, 12)]);
    if (ins.status === "fulfilled") setInsights(ins.value);
    else {
      const e = parseApiError(ins.reason, "Couldn't load insights.");
      setError(e);
      onError?.(e);
    }
    if (med.status === "fulfilled") setMedia(med.value.items || []);
    setLoading(false);
  }, [onError]);

  useEffect(() => {
    load();
  }, [load]);

  const totals = insights?.totals || [];
  const reachSeries = insights?.series?.reach || [];
  const followerSeries = insights?.series?.follower_count || [];
  const newFollowers = followerSeries.reduce((s, p) => s + (p.value || 0), 0);

  const topPosts = [...media]
    .sort((a, b) => (b.likeCount || 0) + (b.commentsCount || 0) * 2 - ((a.likeCount || 0) + (a.commentsCount || 0) * 2))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {error && error.code !== "INSTAGRAM_PERMISSION_DENIED" && <ErrorNotice error={error} onRetry={load} />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatTile label="Views" icon={<FiEye />} loading={loading} value={formatNumber(pick(totals, "views"))} hint="Last 28 days" />
        <StatTile label="Accounts reached" icon={<FiUsers />} loading={loading} value={formatNumber(pick(totals, "reach"))} hint="Unique accounts" />
        <StatTile label="Interactions" icon={<FiHeart />} loading={loading} value={formatNumber(pick(totals, "total_interactions"))} hint="Likes, comments, saves, shares" />
        <StatTile
          label="New followers"
          icon={<FiActivity />}
          loading={loading}
          value={followerSeries.length ? `+${formatNumber(newFollowers)}` : "—"}
          hint={
            followerSeries.length ? (
              <span className="flex items-center justify-between">
                Last 28 days <Sparkline points={followerSeries} width={72} height={20} />
              </span>
            ) : (
              "Available at 100+ followers"
            )
          }
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Daily reach"
            subtitle="Unique accounts that saw your content each day"
            action={
              <Button variant="ghost" size="sm" onClick={() => onNavigate("insights")}>
                Full insights <FiArrowRight />
              </Button>
            }
          />
          <div className="px-3 pb-4">{loading ? <Skeleton className="h-[220px] mx-2" /> : <AreaChart points={reachSeries} valueLabel="Accounts reached" />}</div>
        </Card>

        <Card>
          <CardHeader title="Quick actions" subtitle="Jump straight into your work" />
          <div className="px-5 pb-5 grid grid-cols-1 gap-2.5">
            {[
              { id: "publish", icon: <FiSend />, title: "Create a post", desc: "Publish a photo, reel, story or carousel" },
              { id: "inbox", icon: <FiMessageCircle />, title: "Reply to messages", desc: "Answer DMs from your followers" },
              { id: "content", icon: <FiGrid />, title: "Moderate comments", desc: "Reply, hide or remove comments" },
              { id: "insights", icon: <FiBarChart2 />, title: "Know your audience", desc: "Top countries, cities, age & gender" },
            ].map((a) => (
              <button
                key={a.id}
                onClick={() => onNavigate(a.id)}
                className="w-full min-w-0 flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/40 text-left transition-colors group"
              >
                <span className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-white text-slate-600 group-hover:text-pink-600 flex items-center justify-center">{a.icon}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-slate-800">{a.title}</span>
                  <span className="block text-xs text-slate-500 truncate">{a.desc}</span>
                </span>
                <FiArrowRight className="text-slate-300 group-hover:text-pink-500" />
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Top recent posts"
          subtitle="Ranked by likes and comments from your latest 12 posts"
          action={
            <Button variant="ghost" size="sm" onClick={() => onNavigate("content")}>
              All content <FiArrowRight />
            </Button>
          }
        />
        <div className="px-5 pb-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading
            ? [0, 1, 2, 3].map((i) => <Skeleton key={i} className="aspect-square" />)
            : topPosts.map((m) => (
                <button key={m.id} onClick={() => onOpenMedia(m)} className="text-left group">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                    {m.thumbnailUrl && <img src={m.thumbnailUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />}
                    <span className="absolute top-2 left-2 text-[10px] font-bold uppercase bg-black/60 text-white px-2 py-0.5 rounded-full">{mediaTypeLabel(m)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1"><FiHeart size={12} /> {formatNumber(m.likeCount)}</span>
                    <span className="inline-flex items-center gap-1"><FiMessageCircle size={12} /> {formatNumber(m.commentsCount)}</span>
                    <span className="ml-auto text-slate-400">{timeAgo(m.timestamp)}</span>
                  </div>
                </button>
              ))}
          {!loading && topPosts.length === 0 && <p className="col-span-full text-sm text-slate-500 py-6 text-center">No posts yet. Publish your first one from the Publish tab.</p>}
        </div>
      </Card>
    </div>
  );
}
