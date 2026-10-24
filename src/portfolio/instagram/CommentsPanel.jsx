import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiCornerDownRight, FiEye, FiEyeOff, FiHeart, FiMail, FiMessageSquare, FiTrash2, FiSend } from "react-icons/fi";
import igStudioApi, { parseApiError } from "../../api/instagramStudioApi";
import { Avatar, Badge, Button, EmptyState, ErrorNotice, Skeleton, Toggle } from "./ui";
import { formatNumber, timeAgo } from "./format";

/**
 * Comment moderation for one media: read, reply publicly, reply privately (DM),
 * hide / unhide, delete, and switch commenting on/off.
 */
export default function CommentsPanel({ media, onCommentsEnabledChange }) {
  const [comments, setComments] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [composer, setComposer] = useState(null); // { commentId, mode: 'public'|'private', username }
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(null);
  const [commentsEnabled, setCommentsEnabled] = useState(media.commentsEnabled !== false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await igStudioApi.getComments(media.id);
      setComments(res.items || []);
      setCursor(res.hasMore ? res.nextCursor : null);
    } catch (e) {
      setError(parseApiError(e, "Couldn't load comments."));
    } finally {
      setLoading(false);
    }
  }, [media.id]);

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await igStudioApi.getComments(media.id, cursor);
      setComments((c) => [...c, ...(res.items || [])]);
      setCursor(res.hasMore ? res.nextCursor : null);
    } catch (e) {
      toast.error(parseApiError(e).message);
    } finally {
      setLoadingMore(false);
    }
  };

  const updateComment = (id, patch) =>
    setComments((list) =>
      list.map((c) =>
        c.id === id ? { ...c, ...patch } : { ...c, replies: (c.replies || []).map((r) => (r.id === id ? { ...r, ...patch } : r)) }
      )
    );

  const removeComment = (id) =>
    setComments((list) => list.filter((c) => c.id !== id).map((c) => ({ ...c, replies: (c.replies || []).filter((r) => r.id !== id) })));

  const toggleHidden = async (c) => {
    setBusy(c.id);
    try {
      await igStudioApi.setCommentHidden(c.id, !c.hidden);
      updateComment(c.id, { hidden: !c.hidden });
      toast.success(c.hidden ? "Comment is visible again" : "Comment hidden from your post");
    } catch (e) {
      toast.error(parseApiError(e).message);
    } finally {
      setBusy(null);
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete this comment by @${c.username}? This cannot be undone.`)) return;
    setBusy(c.id);
    try {
      await igStudioApi.deleteComment(c.id);
      removeComment(c.id);
      toast.success("Comment deleted");
    } catch (e) {
      toast.error(parseApiError(e).message);
    } finally {
      setBusy(null);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !composer) return;
    setBusy(`send-${composer.commentId}`);
    try {
      if (composer.mode === "public") {
        const res = await igStudioApi.replyToComment(composer.commentId, text.trim());
        setComments((list) =>
          list.map((c) =>
            c.id === composer.commentId
              ? { ...c, replies: [...(c.replies || []), { id: res.id || `tmp-${Date.now()}`, text: text.trim(), username: "You", timestamp: new Date().toISOString(), likeCount: 0 }] }
              : c
          )
        );
        toast.success("Reply posted");
      } else {
        await igStudioApi.privateReply(composer.commentId, text.trim());
        toast.success(`Private message sent to @${composer.username}`);
      }
      setText("");
      setComposer(null);
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setBusy(null);
    }
  };

  const toggleComments = async (enabled) => {
    setCommentsEnabled(enabled);
    try {
      await igStudioApi.setCommentsEnabled(media.id, enabled);
      onCommentsEnabledChange?.(enabled);
      toast.success(enabled ? "Comments turned on" : "Comments turned off for this post");
    } catch (e) {
      setCommentsEnabled(!enabled);
      toast.error(parseApiError(e).message);
    }
  };

  const renderComment = (c, isReply = false) => (
    <div key={c.id} className={`flex gap-3 ${isReply ? "mt-3" : ""} ${c.hidden ? "opacity-60" : ""}`}>
      <Avatar name={c.username} size={isReply ? 28 : 34} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-slate-800">@{c.username || "user"}</span>
          <span className="text-xs text-slate-400">{timeAgo(c.timestamp)}</span>
          {c.hidden && <Badge tone="amber"><FiEyeOff size={10} /> Hidden</Badge>}
        </div>
        <p className="text-sm text-slate-700 mt-0.5 whitespace-pre-wrap break-words">{c.text}</p>
        <div className="flex items-center gap-1 mt-1.5 -ml-2 text-xs">
          {c.likeCount > 0 && (
            <span className="inline-flex items-center gap-1 text-slate-500 px-2">
              <FiHeart size={11} /> {formatNumber(c.likeCount)}
            </span>
          )}
          {!isReply && (
            <>
              <ActionBtn icon={<FiCornerDownRight size={12} />} onClick={() => setComposer({ commentId: c.id, mode: "public", username: c.username })}>
                Reply
              </ActionBtn>
              <ActionBtn icon={<FiMail size={12} />} onClick={() => setComposer({ commentId: c.id, mode: "private", username: c.username })}>
                Message privately
              </ActionBtn>
            </>
          )}
          <ActionBtn icon={c.hidden ? <FiEye size={12} /> : <FiEyeOff size={12} />} onClick={() => toggleHidden(c)} disabled={busy === c.id}>
            {c.hidden ? "Unhide" : "Hide"}
          </ActionBtn>
          <ActionBtn icon={<FiTrash2 size={12} />} onClick={() => remove(c)} disabled={busy === c.id} danger>
            Delete
          </ActionBtn>
        </div>

        {composer?.commentId === c.id && (
          <form onSubmit={submit} className="mt-2 rounded-xl border border-slate-200 bg-white p-2 focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100">
            <div className="text-[11px] font-semibold text-slate-500 px-1 pb-1">
              {composer.mode === "public" ? `Public reply to @${c.username}` : `Private DM to @${c.username} — they'll receive it in their inbox`}
            </div>
            <div className="flex items-end gap-2">
              <textarea
                autoFocus
                rows={2}
                maxLength={composer.mode === "public" ? 2200 : 1000}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={composer.mode === "public" ? "Write a reply…" : "Write a private message…"}
                className="flex-1 resize-none text-sm outline-none px-1 py-1 text-slate-700 placeholder:text-slate-400"
              />
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="sm" onClick={() => setComposer(null)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" loading={busy === `send-${c.id}`} disabled={!text.trim()} icon={<FiSend size={12} />}>
                  Send
                </Button>
              </div>
            </div>
          </form>
        )}

        {(c.replies || []).map((r) => renderComment(r, true))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <FiMessageSquare /> Comments {media.commentsCount ? <span className="text-slate-400 font-medium">({formatNumber(media.commentsCount)})</span> : null}
        </h4>
        <Toggle checked={commentsEnabled} onChange={toggleComments} label="Allow comments" />
      </div>

      {error && <ErrorNotice error={error} onRetry={load} compact />}

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 && !error ? (
        <EmptyState icon={<FiMessageSquare size={20} />} title="No comments yet" description="When people comment on this post, you can reply and moderate them here." />
      ) : (
        <div className="space-y-5">{comments.map((c) => renderComment(c))}</div>
      )}

      {cursor && (
        <div className="mt-5 text-center">
          <Button variant="secondary" size="sm" onClick={loadMore} loading={loadingMore}>
            Load more comments
          </Button>
        </div>
      )}
    </div>
  );
}

const ActionBtn = ({ children, icon, onClick, disabled, danger }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md font-semibold transition-colors disabled:opacity-40 ${
      danger ? "text-slate-500 hover:text-rose-600 hover:bg-rose-50" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
    }`}
  >
    {icon}
    {children}
  </button>
);
