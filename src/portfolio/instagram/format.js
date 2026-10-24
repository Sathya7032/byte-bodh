// Formatting helpers for Instagram Studio

export const formatNumber = (n) => {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "—";
  const v = Number(n);
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(v >= 10_000_000 ? 0 : 1).replace(/\.0$/, "")}M`;
  if (Math.abs(v) >= 10_000) return `${(v / 1000).toFixed(v >= 100_000 ? 0 : 1).replace(/\.0$/, "")}K`;
  return v.toLocaleString();
};

export const formatFull = (n) => (n === null || n === undefined ? "—" : Number(n).toLocaleString());

/** Meta timestamps use +0000; normalise so every browser parses them. */
export const parseMetaDate = (value) => {
  if (!value) return null;
  const iso = String(value).replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const timeAgo = (value) => {
  const d = value instanceof Date ? value : parseMetaDate(value);
  if (!d) return "";
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: s > 31536000 ? "numeric" : undefined });
};

export const formatDate = (value, opts = { day: "numeric", month: "short", year: "numeric" }) => {
  const d = value instanceof Date ? value : parseMetaDate(value);
  return d ? d.toLocaleDateString(undefined, opts) : "";
};

export const timeLeft = (value) => {
  const d = value instanceof Date ? value : parseMetaDate(value);
  if (!d) return "";
  const s = Math.max(0, Math.floor((d.getTime() - Date.now()) / 1000));
  if (s >= 86400) return `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h left`;
  if (s >= 3600) return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m left`;
  return `${Math.floor(s / 60)}m left`;
};

export const METRIC_LABELS = {
  views: "Views",
  reach: "Accounts reached",
  accounts_engaged: "Accounts engaged",
  total_interactions: "Interactions",
  likes: "Likes",
  comments: "Comments",
  shares: "Shares",
  saves: "Saves",
  saved: "Saves",
  replies: "Replies",
  profile_links_taps: "Link taps",
  profile_visits: "Profile visits",
  follows: "Follows",
  follower_count: "New followers",
  ig_reels_avg_watch_time: "Avg. watch time",
  ig_reels_video_view_total_time: "Total watch time",
};

export const METRIC_HELP = {
  views: "Times your content was played or displayed.",
  reach: "Unique accounts that saw your content at least once.",
  accounts_engaged: "Unique accounts that interacted with your content.",
  total_interactions: "Likes, comments, saves, shares and replies combined.",
  profile_links_taps: "Taps on your bio link, email, call or directions buttons.",
};

export const formatMetricValue = (name, value) => {
  if (value === null || value === undefined) return "—";
  if (name === "ig_reels_avg_watch_time" || name === "ig_reels_video_view_total_time") {
    const sec = Math.round(Number(value) / 1000);
    if (sec >= 3600) return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
    if (sec >= 60) return `${Math.floor(sec / 60)}m ${sec % 60}s`;
    return `${sec}s`;
  }
  return formatNumber(value);
};

const COUNTRY_NAMES = typeof Intl !== "undefined" && Intl.DisplayNames ? new Intl.DisplayNames(["en"], { type: "region" }) : null;
export const countryName = (code) => {
  try {
    return (COUNTRY_NAMES && code && code.length === 2 && COUNTRY_NAMES.of(code)) || code;
  } catch {
    return code;
  }
};

export const mediaTypeLabel = (item) => {
  if (!item) return "";
  if (item.mediaProductType === "REELS") return "Reel";
  if (item.mediaProductType === "STORY") return "Story";
  if (item.mediaType === "CAROUSEL_ALBUM") return "Carousel";
  if (item.mediaType === "VIDEO") return "Video";
  return "Post";
};
