import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FiArrowLeft, FiClock, FiImage, FiInfo, FiLock, FiMessageCircle, FiRefreshCw, FiSearch, FiSend, FiUserCheck, FiX } from "react-icons/fi";
import igStudioApi, { parseApiError } from "../../api/instagramStudioApi";
import { Avatar, Badge, Button, Card, EmptyState, ErrorNotice, Skeleton } from "./ui";
import { parseMetaDate, timeAgo, timeLeft } from "./format";

const LIST_REFRESH_MS = 30000;
const THREAD_REFRESH_MS = 12000;

const WindowBadge = ({ window }) => {
  if (!window) return null;
  if (window.status === "OPEN") return <Badge tone="green"><FiClock size={10} /> {timeLeft(window.standardWindowEndsAt)}</Badge>;
  if (window.status === "HUMAN_AGENT") return <Badge tone="amber"><FiUserCheck size={10} /> Human agent</Badge>;
  return <Badge tone="slate"><FiLock size={10} /> Closed</Badge>;
};

/**
 * DM inbox. Messaging policy (enforced on the server too):
 *  OPEN        → within 24h of the customer's last message: normal replies
 *  HUMAN_AGENT → 24h–7d: replies must be written by a person and are tagged HUMAN_AGENT
 *  CLOSED      → >7d: replying is not allowed
 */
export default function InboxTab({ onError }) {
  const [conversations, setConversations] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState(null);

  const [thread, setThread] = useState(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadError, setThreadError] = useState(null);

  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [agentConfirmed, setAgentConfirmed] = useState(false);
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  const loadList = useCallback(async (silent = false) => {
    if (!silent) setListLoading(true);
    try {
      const res = await igStudioApi.getConversations();
      setConversations(res.items || []);
      setCursor(res.hasMore ? res.nextCursor : null);
      setListError(null);
    } catch (e) {
      if (!silent) {
        const pe = parseApiError(e, "Couldn't load your inbox.");
        setListError(pe);
        onError?.(pe);
      }
    } finally {
      if (!silent) setListLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadThread = useCallback(async (id, silent = false) => {
    if (!id) return;
    if (!silent) {
      setThreadLoading(true);
      setThreadError(null);
    }
    try {
      const t = await igStudioApi.getThread(id);
      setThread((prev) => (prev && prev.conversationId === id && silent && prev.messages.length === t.messages.length ? { ...prev, window: t.window } : t));
    } catch (e) {
      if (!silent) setThreadError(parseApiError(e, "Couldn't load this conversation."));
    } finally {
      if (!silent) setThreadLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
    const t = setInterval(() => document.visibilityState === "visible" && loadList(true), LIST_REFRESH_MS);
    return () => clearInterval(t);
  }, [loadList]);

  useEffect(() => {
    if (!activeId) return undefined;
    setThread(null);
    setText("");
    setImageUrl("");
    setShowImage(false);
    setAgentConfirmed(false);
    loadThread(activeId);
    const t = setInterval(() => document.visibilityState === "visible" && loadThread(activeId, true), THREAD_REFRESH_MS);
    return () => clearInterval(t);
  }, [activeId, loadThread]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [thread?.messages?.length]);

  const loadMore = async () => {
    try {
      const res = await igStudioApi.getConversations(cursor);
      setConversations((c) => [...c, ...(res.items || [])]);
      setCursor(res.hasMore ? res.nextCursor : null);
    } catch (e) {
      toast.error(parseApiError(e).message);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? conversations.filter((c) => (c.participantUsername || "").toLowerCase().includes(q) || (c.lastMessage || "").toLowerCase().includes(q)) : conversations;
  }, [conversations, search]);

  const active = conversations.find((c) => c.id === activeId);
  const windowState = thread?.window || active?.window;
  const isHumanAgent = windowState?.status === "HUMAN_AGENT";
  const isClosed = windowState?.status === "CLOSED";
  const canSend = !sending && !isClosed && (text.trim() || imageUrl.trim()) && (!isHumanAgent || agentConfirmed);

  const send = async (e) => {
    e?.preventDefault();
    if (!canSend || !thread) return;
    setSending(true);
    const optimistic = { id: `tmp-${Date.now()}`, text: text.trim(), createdTime: new Date().toISOString(), fromBusiness: true, attachmentUrls: imageUrl ? [imageUrl.trim()] : [], pending: true };
    setThread((t) => ({ ...t, messages: [...t.messages, optimistic] }));
    const payload = {
      recipientId: thread.participantId,
      conversationId: thread.conversationId,
      text: text.trim() || null,
      imageUrl: imageUrl.trim() || null,
      humanAgent: isHumanAgent ? true : null,
    };
    setText("");
    setImageUrl("");
    setShowImage(false);
    try {
      const res = await igStudioApi.sendMessage(payload);
      setThread((t) => ({ ...t, messages: t.messages.map((m) => (m.id === optimistic.id ? { ...m, id: res.messageId || m.id, pending: false, mode: res.deliveryMode } : m)) }));
      if (res.deliveryMode === "HUMAN_AGENT") toast.info("Sent as a Human Agent reply");
      loadList(true);
    } catch (err) {
      setThread((t) => ({ ...t, messages: t.messages.filter((m) => m.id !== optimistic.id) }));
      setText(payload.text || "");
      toast.error(parseApiError(err, "Message not sent.").message);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] h-[calc(100vh-150px)] min-h-[520px] max-h-[760px]">
        {/* Conversation list */}
        <div className={`border-r border-slate-200 flex flex-col min-h-0 ${activeId ? "hidden md:flex" : "flex"}`}>
          <div className="p-3 border-b border-slate-200 flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages"
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-slate-100 outline-none focus:bg-white focus:ring-2 focus:ring-pink-100"
              />
            </div>
            <button onClick={() => loadList()} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Refresh inbox" title="Refresh">
              <FiRefreshCw size={15} className={listLoading ? "animate-spin" : ""} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {listError && <div className="p-3"><ErrorNotice error={listError} onRetry={() => loadList()} compact /></div>}
            {listLoading && !conversations.length ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-3">
                  <Skeleton className="w-11 h-11 rounded-full" />
                  <div className="flex-1 space-y-2 py-1">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 && !listError ? (
              <EmptyState icon={<FiMessageCircle size={20} />} title={search ? "No matches" : "No conversations yet"} description={search ? "Try a different name." : "When someone sends you a DM it will appear here."} />
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full flex gap-3 p-3 text-left border-l-[3px] transition-colors ${activeId === c.id ? "bg-pink-50/60 border-pink-500" : "border-transparent hover:bg-slate-50"}`}
                >
                  <Avatar name={c.participantUsername} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm truncate ${c.lastMessageFromCustomer ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>@{c.participantUsername || "instagram user"}</span>
                      <span className="text-[11px] text-slate-400 flex-shrink-0">{timeAgo(c.lastMessageTime)}</span>
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${c.lastMessageFromCustomer ? "text-slate-700" : "text-slate-500"}`}>
                      {!c.lastMessageFromCustomer && c.lastMessage ? "You: " : ""}
                      {c.lastMessage || "Attachment"}
                    </p>
                    <div className="mt-1.5"><WindowBadge window={c.window} /></div>
                  </div>
                </button>
              ))
            )}
            {cursor && (
              <div className="p-3 text-center">
                <Button variant="ghost" size="sm" onClick={loadMore}>Load older</Button>
              </div>
            )}
          </div>
        </div>

        {/* Thread */}
        <div className={`flex flex-col min-h-0 bg-slate-50/50 ${activeId ? "flex" : "hidden md:flex"}`}>
          {!activeId ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState icon={<FiMessageCircle size={22} />} title="Select a conversation" description="Pick a chat on the left to read and reply." />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
                <button onClick={() => setActiveId(null)} className="md:hidden p-1.5 -ml-1 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Back">
                  <FiArrowLeft />
                </button>
                <Avatar name={thread?.participantUsername || active?.participantUsername} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-800 truncate">@{thread?.participantUsername || active?.participantUsername || "instagram user"}</div>
                  <div className="text-xs text-slate-500">
                    {windowState?.lastCustomerMessageAt ? `Last message from them ${timeAgo(new Date(windowState.lastCustomerMessageAt))}` : "Instagram Direct"}
                  </div>
                </div>
                <WindowBadge window={windowState} />
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                {threadError && <ErrorNotice error={threadError} onRetry={() => loadThread(activeId)} compact />}
                {threadLoading && !thread
                  ? [40, 60, 30, 55].map((w, i) => (
                      <div key={i} className={`flex ${i % 2 ? "justify-end" : ""}`}>
                        <Skeleton className="h-9 rounded-2xl" style={{ width: `${w}%` }} />
                      </div>
                    ))
                  : thread?.messages.map((m, i) => {
                      const prev = thread.messages[i - 1];
                      const d = parseMetaDate(m.createdTime) || new Date(m.createdTime);
                      const pd = prev && (parseMetaDate(prev.createdTime) || new Date(prev.createdTime));
                      const showDay = !pd || d.toDateString() !== pd.toDateString();
                      return (
                        <React.Fragment key={m.id}>
                          {showDay && (
                            <div className="text-center text-[11px] font-semibold text-slate-400 py-2">
                              {d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
                            </div>
                          )}
                          <div className={`flex ${m.fromBusiness ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[78%] ${m.pending ? "opacity-60" : ""}`}>
                              {m.attachmentUrls?.map((u) => (
                                <img key={u} src={u} alt="attachment" className="rounded-2xl max-h-60 mb-1 border border-slate-200" />
                              ))}
                              {m.text && (
                                <div className={`px-3.5 py-2 text-sm rounded-2xl whitespace-pre-wrap break-words ${m.fromBusiness ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-br-md" : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"}`}>
                                  {m.text}
                                </div>
                              )}
                              <div className={`text-[10px] text-slate-400 mt-0.5 ${m.fromBusiness ? "text-right" : ""}`}>
                                {m.pending ? "Sending…" : d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                                {m.mode === "HUMAN_AGENT" && " · human agent"}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                {thread && thread.messages.length === 0 && <p className="text-center text-sm text-slate-400 py-10">No messages in this conversation yet.</p>}
                <div ref={endRef} />
              </div>

              {/* Policy banner */}
              {windowState && windowState.status !== "OPEN" && (
                <div className={`mx-4 mb-2 rounded-xl border p-3 text-xs flex gap-2 ${isHumanAgent ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                  {isHumanAgent ? <FiUserCheck className="mt-0.5 flex-shrink-0" /> : <FiInfo className="mt-0.5 flex-shrink-0" />}
                  <div className="flex-1">
                    <p className="font-semibold">{isHumanAgent ? `Human Agent window · ${timeLeft(windowState.humanAgentWindowEndsAt)}` : "Replies are closed for this conversation"}</p>
                    <p className="mt-0.5">{windowState.description}</p>
                    {isHumanAgent && (
                      <label className="flex items-center gap-2 mt-2 font-semibold cursor-pointer">
                        <input type="checkbox" checked={agentConfirmed} onChange={(e) => setAgentConfirmed(e.target.checked)} className="accent-amber-600" />
                        I'm personally writing this reply (not automated)
                      </label>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={send} className="p-3 bg-white border-t border-slate-200">
                {showImage && (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://… public image URL"
                      className="flex-1 text-sm rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-pink-300"
                    />
                    <button type="button" onClick={() => { setShowImage(false); setImageUrl(""); }} className="p-1.5 text-slate-400 hover:text-slate-600" aria-label="Remove image">
                      <FiX />
                    </button>
                  </div>
                )}
                <div className={`flex items-end gap-2 rounded-2xl border px-2 py-1.5 ${isClosed ? "bg-slate-100 border-slate-200" : "border-slate-200 focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100"}`}>
                  <button type="button" disabled={isClosed} onClick={() => setShowImage((s) => !s)} className="p-2 text-slate-400 hover:text-pink-600 disabled:opacity-40" aria-label="Attach image" title="Attach image by URL">
                    <FiImage />
                  </button>
                  <textarea
                    rows={1}
                    value={text}
                    disabled={isClosed}
                    maxLength={1000}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={isClosed ? "You can reply once they message you again" : "Message…  (Enter to send, Shift+Enter for new line)"}
                    className="flex-1 resize-none bg-transparent text-sm outline-none py-2 max-h-32 placeholder:text-slate-400"
                  />
                  <Button type="submit" size="sm" disabled={!canSend} loading={sending} icon={<FiSend size={13} />} className="mb-0.5">
                    Send
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
