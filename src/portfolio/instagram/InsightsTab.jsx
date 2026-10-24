import React, { useCallback, useEffect, useState } from "react";
import { FiRefreshCw, FiInfo, FiGlobe, FiMapPin, FiUsers, FiUser } from "react-icons/fi";
import igStudioApi, { parseApiError } from "../../api/instagramStudioApi";
import { Card, CardHeader, ErrorNotice, SegmentedControl, Skeleton, Button, EmptyState } from "./ui";
import { AreaChart, BarList } from "./charts";
import { countryName, formatFull, formatNumber, METRIC_HELP, METRIC_LABELS } from "./format";

const RANGES = [
  { value: 7, label: "7 days" },
  { value: 14, label: "14 days" },
  { value: 30, label: "30 days" },
];

const BREAKDOWNS = [
  { value: "country", label: "Countries", icon: <FiGlobe /> },
  { value: "city", label: "Cities", icon: <FiMapPin /> },
  { value: "age", label: "Age", icon: <FiUsers /> },
  { value: "gender", label: "Gender", icon: <FiUser /> },
];

const GENDER = { F: "Women", M: "Men", U: "Unspecified" };

const ORDER = ["views", "reach", "accounts_engaged", "total_interactions", "likes", "comments", "shares", "saves", "replies", "profile_links_taps"];

export default function InsightsTab({ onError }) {
  const [days, setDays] = useState(30);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chart, setChart] = useState("reach");

  const [audienceMetric, setAudienceMetric] = useState("follower_demographics");
  const [breakdown, setBreakdown] = useState("country");
  const [audience, setAudience] = useState(null);
  const [audLoading, setAudLoading] = useState(true);

  const load = useCallback(
    async (refresh = false) => {
      setLoading(true);
      setError(null);
      try {
        setInsights(await igStudioApi.getAccountInsights(days, refresh));
      } catch (e) {
        const pe = parseApiError(e, "Couldn't load account insights.");
        setError(pe);
        onError?.(pe);
      } finally {
        setLoading(false);
      }
    },
    [days, onError]
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    setAudLoading(true);
    igStudioApi
      .getAudience(breakdown, audienceMetric)
      .then((d) => !cancelled && setAudience(d))
      .catch((e) => !cancelled && setAudience({ available: false, note: parseApiError(e).message, buckets: [] }))
      .finally(() => !cancelled && setAudLoading(false));
    return () => {
      cancelled = true;
    };
  }, [breakdown, audienceMetric]);

  const totals = [...(insights?.totals || [])].sort((a, b) => ORDER.indexOf(a.name) - ORDER.indexOf(b.name));
  const series = insights?.series || {};
  const chartPoints = series[chart] || [];

  const formatAudienceLabel = (l) => {
    if (breakdown === "country") return countryName(l);
    if (breakdown === "gender") return GENDER[l] || l;
    return l;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Account performance</h2>
          <p className="text-sm text-slate-500">
            {insights ? `${insights.since} → ${insights.until}` : "Loading period…"} · data provided by Instagram, may be delayed up to 48h
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SegmentedControl options={RANGES} value={days} onChange={setDays} />
          <Button variant="secondary" size="sm" onClick={() => load(true)} disabled={loading} icon={<FiRefreshCw className={loading ? "animate-spin" : ""} />}>
            Refresh
          </Button>
        </div>
      </div>

      {error && error.code !== "INSTAGRAM_PERMISSION_DENIED" && <ErrorNotice error={error} onRetry={() => load(true)} />}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-[92px] rounded-2xl" />)
          : totals.map((m) => (
              <Card key={m.name} className="p-4" title={METRIC_HELP[m.name] || m.description || ""}>
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  {METRIC_LABELS[m.name] || m.title || m.name}
                  {METRIC_HELP[m.name] && <FiInfo size={11} className="text-slate-300" />}
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mt-2 tabular-nums" title={formatFull(m.value)}>
                  {formatNumber(m.value)}
                </div>
              </Card>
            ))}
      </div>

      {insights?.unavailableMetrics?.length > 0 && (
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <FiInfo /> Not available for this account yet: {insights.unavailableMetrics.map((m) => METRIC_LABELS[m] || m).join(", ")}
        </p>
      )}

      <Card>
        <CardHeader
          title={chart === "reach" ? "Daily reach" : "New followers per day"}
          subtitle={chart === "reach" ? "Unique accounts reached each day" : "Followers gained each day (Instagram reports the last 30 days)"}
          action={
            <SegmentedControl
              size="sm"
              value={chart}
              onChange={setChart}
              options={[
                { value: "reach", label: "Reach" },
                { value: "follower_count", label: "Followers" },
              ]}
            />
          }
        />
        <div className="px-3 pb-4">
          {loading ? (
            <Skeleton className="h-[240px] mx-2" />
          ) : chartPoints.length ? (
            <AreaChart points={chartPoints} height={240} valueLabel={chart === "reach" ? "Accounts reached" : "New followers"} />
          ) : (
            <EmptyState title="No data yet" description="Instagram returns follower growth only for accounts with 100+ followers." />
          )}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Audience"
          subtitle="Who follows and engages with you (this month)"
          action={
            <SegmentedControl
              size="sm"
              value={audienceMetric}
              onChange={setAudienceMetric}
              options={[
                { value: "follower_demographics", label: "Followers" },
                { value: "engaged_audience_demographics", label: "Engaged" },
              ]}
            />
          }
        />
        <div className="px-5 pb-5">
          <div className="flex flex-wrap gap-2 mb-5">
            {BREAKDOWNS.map((b) => (
              <button
                key={b.value}
                onClick={() => setBreakdown(b.value)}
                className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                  breakdown === b.value ? "border-pink-300 bg-pink-50 text-pink-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {b.icon} {b.label}
              </button>
            ))}
          </div>
          {audLoading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8" />
              ))}
            </div>
          ) : audience?.available ? (
            <div className="max-w-2xl">
              <BarList items={audience.buckets} formatLabel={formatAudienceLabel} max={breakdown === "age" ? 14 : 8} />
            </div>
          ) : (
            <EmptyState icon={<FiUsers size={22} />} title="Audience data not available yet" description={audience?.note} />
          )}
        </div>
      </Card>
    </div>
  );
}
