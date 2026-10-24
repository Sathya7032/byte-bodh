import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiFilm, FiGrid, FiHeart, FiLayers, FiMessageCircle, FiPlay, FiSearch } from "react-icons/fi";
import igStudioApi, { parseApiError } from "../../api/instagramStudioApi";
import { Button, Card, EmptyState, ErrorNotice, SegmentedControl, Skeleton } from "./ui";
import { formatNumber, mediaTypeLabel, timeAgo } from "./format";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "Post", label: "Posts" },
  { value: "Reel", label: "Reels" },
  { value: "Carousel", label: "Carousels" },
];

/** Grid of published content. Click a tile to see insights and manage comments. */
export default function ContentTab({ onOpenMedia, refreshKey, onError }) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await igStudioApi.getMedia(null, 24);
      setItems(res.items || []);
      setCursor(res.hasMore ? res.nextCursor : null);
    } catch (e) {
      const pe = parseApiError(e, "Couldn't load your posts.");
      setError(pe);
      onError?.(pe);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await igStudioApi.getMedia(cursor, 24);
      setItems((p) => [...p, ...(res.items || [])]);
      setCursor(res.hasMore ? res.nextCursor : null);
    } catch (e) {
      setError(parseApiError(e));
    } finally {
      setLoadingMore(false);
    }
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((m) => (filter === "all" || mediaTypeLabel(m) === filter || (filter === "Post" && mediaTypeLabel(m) === "Video")) && (!q || (m.caption || "").toLowerCase().includes(q)));
  }, [items, filter, query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} />
        <div className="relative md:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search captions"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
          />
        </div>
      </div>

      {error && <ErrorNotice error={error} onRetry={load} />}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <Card>
          <EmptyState icon={<FiGrid size={22} />} title={items.length ? "No posts match your filters" : "No posts yet"} description={items.length ? "Try another filter or search term." : "Your published posts and reels will show up here."} />
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {visible.map((m) => (
            <button key={m.id} onClick={() => onOpenMedia(m)} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500">
              {m.thumbnailUrl ? (
                <img src={m.thumbnailUrl} alt={(m.caption || "").slice(0, 80)} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400"><FiFilm size={28} /></div>
              )}
              <span className="absolute top-2.5 right-2.5 text-white drop-shadow">
                {mediaTypeLabel(m) === "Reel" || m.mediaType === "VIDEO" ? <FiPlay size={16} /> : m.mediaType === "CAROUSEL_ALBUM" ? <FiLayers size={16} /> : null}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 inset-x-0 p-3 flex items-center gap-3 text-white text-xs font-semibold opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <span className="inline-flex items-center gap-1"><FiHeart /> {formatNumber(m.likeCount)}</span>
                <span className="inline-flex items-center gap-1"><FiMessageCircle /> {formatNumber(m.commentsCount)}</span>
                <span className="ml-auto font-normal text-white/80">{timeAgo(m.timestamp)}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {cursor && !loading && (
        <div className="text-center pt-2">
          <Button variant="secondary" onClick={loadMore} loading={loadingMore}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
