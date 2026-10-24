import React, { useEffect, useState } from "react";
import { FiExternalLink, FiInfo } from "react-icons/fi";
import igStudioApi, { parseApiError } from "../../api/instagramStudioApi";
import { Badge, Card, Drawer, ErrorNotice, Skeleton } from "./ui";
import CommentsPanel from "./CommentsPanel";
import { formatDate, formatMetricValue, mediaTypeLabel, METRIC_LABELS } from "./format";

const METRIC_ORDER = [
  "views", "reach", "total_interactions", "likes", "comments", "shares", "saved", "replies",
  "profile_visits", "follows", "ig_reels_avg_watch_time", "ig_reels_video_view_total_time",
];

/** Post detail: preview, caption, per-post insights and comment moderation. */
export default function MediaDrawer({ media, onClose, onUpdate }) {
  const [detail, setDetail] = useState(media);
  const [slide, setSlide] = useState(0);
  const [insights, setInsights] = useState(null);
  const [insLoading, setInsLoading] = useState(true);
  const [insError, setInsError] = useState(null);

  const mediaId = media?.id;
  useEffect(() => {
    if (!media) return;
    setDetail(media);
    setSlide(0);
    setInsights(null);
    setInsError(null);
    setInsLoading(true);
    if (media.mediaType === "CAROUSEL_ALBUM") {
      igStudioApi.getMediaDetail(media.id).then(setDetail).catch(() => {});
    }
    igStudioApi
      .getMediaInsights(media.id)
      .then(setInsights)
      .catch((e) => setInsError(parseApiError(e, "Insights are not available for this post.")))
      .finally(() => setInsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaId]);

  if (!media) return null;

  // `detail` lags one render behind `media` when a new post is opened — fall back to `media`.
  const d = detail && detail.id === media.id ? detail : media;
  const slides = d.children?.length ? d.children : [{ id: d.id, mediaType: d.mediaType, mediaUrl: d.mediaUrl, thumbnailUrl: d.thumbnailUrl }];
  const current = slides[Math.min(slide, slides.length - 1)];
  const metrics = [...(insights?.metrics || [])].sort((a, b) => METRIC_ORDER.indexOf(a.name) - METRIC_ORDER.indexOf(b.name));

  return (
    <Drawer open={!!media} onClose={onClose} title={`${mediaTypeLabel(media)} · ${formatDate(media.timestamp)}`}>
      <div className="p-5 space-y-5">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="relative bg-slate-900 aspect-square">
              {current?.mediaType === "VIDEO" ? (
                <video key={current.id} src={current.mediaUrl} poster={current.thumbnailUrl} controls playsInline className="w-full h-full object-contain" />
              ) : (
                <img src={current?.mediaUrl || current?.thumbnailUrl} alt="" className="w-full h-full object-contain" />
              )}
              {slides.length > 1 && (
                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                  {slides.map((s, i) => (
                    <button key={s.id} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === slide ? "w-5 bg-white" : "w-1.5 bg-white/50"}`} />
                  ))}
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Badge tone="pink">{mediaTypeLabel(media)}</Badge>
                {media.commentsEnabled === false && <Badge tone="amber">Comments off</Badge>}
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap break-words flex-1 max-h-60 overflow-y-auto">{media.caption || <span className="text-slate-400 italic">No caption</span>}</p>
              {media.permalink && (
                <a href={media.permalink} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-pink-600 hover:text-pink-700">
                  View on Instagram <FiExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="text-sm font-bold text-slate-800 mb-4">Post insights</h4>
          {insError && <ErrorNotice error={insError} compact />}
          {insLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {metrics.map((m) => (
                  <div key={m.name} className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                    <div className="text-[11px] font-semibold text-slate-500">{METRIC_LABELS[m.name] || m.title || m.name}</div>
                    <div className="text-lg font-extrabold text-slate-900 tabular-nums mt-1">{formatMetricValue(m.name, m.value)}</div>
                  </div>
                ))}
              </div>
              {insights?.unavailableMetrics?.length > 0 && (
                <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                  <FiInfo /> Not reported for this post: {insights.unavailableMetrics.map((n) => METRIC_LABELS[n] || n).join(", ")}
                </p>
              )}
            </>
          )}
        </Card>

        <Card className="p-5">
          <CommentsPanel media={media} onCommentsEnabledChange={(enabled) => onUpdate?.({ ...media, commentsEnabled: enabled })} />
        </Card>
      </div>
    </Drawer>
  );
}
