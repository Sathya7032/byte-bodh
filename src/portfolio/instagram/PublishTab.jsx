import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  FiAlertTriangle, FiCheckCircle, FiExternalLink, FiFilm, FiImage, FiLayers, FiPlus, FiSmartphone, FiTrash2, FiUploadCloud, FiX,
} from "react-icons/fi";
import igStudioApi, { parseApiError } from "../../api/instagramStudioApi";
import { Avatar, Badge, Button, Card, CardHeader, ErrorNotice, Toggle } from "./ui";

const TYPES = [
  { value: "IMAGE", label: "Post", icon: <FiImage />, desc: "One photo in your feed", accept: "image/*", max: 1 },
  { value: "REEL", label: "Reel", icon: <FiFilm />, desc: "Short vertical video", accept: "video/mp4,video/quicktime", max: 1 },
  { value: "STORY", label: "Story", icon: <FiSmartphone />, desc: "Disappears after 24h", accept: "image/*,video/mp4,video/quicktime", max: 1 },
  { value: "CAROUSEL", label: "Carousel", icon: <FiLayers />, desc: "2–10 photos or videos", accept: "image/*,video/mp4,video/quicktime", max: 10 },
];

const MAX_VIDEO_MB = 100;
const STEPS = { idle: null, uploading: "Uploading media", creating: "Sending to Instagram", processing: "Instagram is processing your video", publishing: "Publishing" };

/** Re-encodes any image to JPEG (Instagram only accepts JPEG) and caps the longest side at 1440px. */
const toJpeg = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, 1440 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) return reject(new Error("Could not process image"));
          resolve({ file: new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }), width: canvas.width, height: canvas.height });
        },
        "image/jpeg",
        0.92
      );
    };
    img.onerror = () => reject(new Error("Unsupported image"));
    img.src = url;
  });

const readVideoMeta = (file) =>
  new Promise((resolve) => {
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => resolve({ duration: v.duration, width: v.videoWidth, height: v.videoHeight });
    v.onerror = () => resolve({});
    v.src = URL.createObjectURL(file);
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function PublishTab({ profile, onPublished, onError }) {
  const [type, setType] = useState("IMAGE");
  const [items, setItems] = useState([]);
  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [shareToFeed, setShareToFeed] = useState(true);
  const [step, setStep] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [quota, setQuota] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const inputRef = useRef(null);

  const cfg = TYPES.find((t) => t.value === type);
  const busy = step !== "idle";

  const loadQuota = useCallback(() => {
    igStudioApi.getPublishingLimit().then(setQuota).catch((e) => onError?.(parseApiError(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(loadQuota, [loadQuota]);

  useEffect(() => () => items.forEach((i) => URL.revokeObjectURL(i.previewUrl)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const changeType = (t) => {
    if (busy) return;
    setType(t);
    setResult(null);
    setError(null);
    const max = TYPES.find((x) => x.value === t).max;
    setItems((prev) => prev.slice(0, max).filter((i) => (t === "IMAGE" ? i.kind === "IMAGE" : t === "REEL" ? i.kind === "VIDEO" : true)));
    setPreviewIndex(0);
  };

  const addFiles = async (fileList) => {
    setResult(null);
    setError(null);
    const files = Array.from(fileList || []);
    const room = cfg.max - items.length;
    if (room <= 0) {
      toast.info(cfg.max === 1 ? "Remove the current file to choose another." : "A carousel can have at most 10 items.");
      return;
    }
    const accepted = [];
    for (const f of files.slice(0, room)) {
      const isVideo = f.type.startsWith("video/");
      const isImage = f.type.startsWith("image/");
      if ((type === "IMAGE" && !isImage) || (type === "REEL" && !isVideo) || (!isImage && !isVideo)) {
        toast.error(`${f.name}: ${type === "REEL" ? "choose an MP4 or MOV video" : type === "IMAGE" ? "choose an image" : "unsupported file"}`);
        continue;
      }
      try {
        if (isImage) {
          const { file, width, height } = await toJpeg(f);
          const ratio = width / height;
          const warn =
            (type === "IMAGE" || type === "CAROUSEL") && (ratio < 0.8 || ratio > 1.91)
              ? "Feed photos must be between 4:5 portrait and 1.91:1 landscape — Instagram may reject this."
              : null;
          accepted.push({ id: `${Date.now()}-${Math.random()}`, file, kind: "IMAGE", previewUrl: URL.createObjectURL(file), warn });
        } else {
          if (f.size > MAX_VIDEO_MB * 1024 * 1024) {
            toast.error(`${f.name} is larger than ${MAX_VIDEO_MB} MB.`);
            continue;
          }
          const meta = await readVideoMeta(f);
          let warn = null;
          if (type === "REEL" && meta.duration && (meta.duration < 3 || meta.duration > 900)) warn = "Reels must be between 3 seconds and 15 minutes.";
          if (type === "STORY" && meta.duration > 60) warn = "Story videos must be 60 seconds or shorter.";
          if (type === "CAROUSEL" && meta.duration > 60) warn = "Carousel videos must be 60 seconds or shorter.";
          accepted.push({ id: `${Date.now()}-${Math.random()}`, file: f, kind: "VIDEO", previewUrl: URL.createObjectURL(f), warn });
        }
      } catch (e) {
        toast.error(`${f.name}: ${e.message}`);
      }
    }
    setItems((prev) => [...prev, ...accepted]);
  };

  const removeItem = (id) => {
    setItems((prev) => {
      const it = prev.find((p) => p.id === id);
      if (it) URL.revokeObjectURL(it.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
    setPreviewIndex(0);
  };

  const hashtags = (caption.match(/#[\p{L}\p{N}_]+/gu) || []).length;
  const mentions = (caption.match(/@[\w.]+/g) || []).length;
  const minItems = type === "CAROUSEL" ? 2 : 1;
  const quotaLeft = quota ? quota.quotaTotal - quota.quotaUsage : null;
  const canPublish = !busy && items.length >= minItems && hashtags <= 30 && mentions <= 20 && quotaLeft !== 0;

  const reset = () => {
    items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    setItems([]);
    setCaption("");
    setAltText("");
    setPreviewIndex(0);
  };

  const pollAndPublish = async (containerId) => {
    setStep("processing");
    const deadline = Date.now() + 10 * 60 * 1000;
    while (Date.now() < deadline) {
      await sleep(5000);
      const s = await igStudioApi.getContainerStatus(containerId);
      if (s.statusCode === "FINISHED") {
        setStep("publishing");
        return igStudioApi.publishContainer(containerId);
      }
      if (s.statusCode === "ERROR" || s.statusCode === "EXPIRED") {
        return { status: "ERROR", message: `Instagram couldn't process this video${s.status ? `: ${s.status}` : "."}` };
      }
    }
    return { status: "ERROR", message: "Processing is taking longer than expected. Check Instagram in a few minutes." };
  };

  const publish = async () => {
    setError(null);
    setResult(null);
    try {
      setStep("uploading");
      const uploaded = [];
      for (let i = 0; i < items.length; i += 1) {
        const res = await igStudioApi.uploadMedia(items[i].file, (p) => setProgress(Math.round(((i + p / 100) / items.length) * 100)));
        uploaded.push({ url: res.url, kind: res.kind });
      }
      setProgress(100);
      setStep("creating");
      let res = await igStudioApi.publish({
        type,
        caption: type === "STORY" ? null : caption,
        items: uploaded,
        shareToFeed: type === "REEL" ? shareToFeed : null,
        altText: type === "IMAGE" ? altText : null,
      });
      if (res.status === "PROCESSING") res = await pollAndPublish(res.containerId);

      if (res.status === "PUBLISHED") {
        setResult(res);
        toast.success("🎉 Published to Instagram!");
        reset();
        loadQuota();
        onPublished?.();
      } else {
        setError({ message: res.message || "Publishing failed." });
      }
    } catch (e) {
      const pe = parseApiError(e, "Publishing failed.");
      setError(pe);
      onError?.(pe);
    } finally {
      setStep("idle");
      setProgress(0);
    }
  };

  const preview = items[Math.min(previewIndex, Math.max(0, items.length - 1))];
  const vertical = type === "REEL" || type === "STORY";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
      <div className="space-y-5">
        <Card className="p-5">
          <h3 className="text-[15px] font-bold text-slate-800 mb-3">What do you want to create?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => changeType(t.value)}
                disabled={busy}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  type === t.value ? "border-pink-500 bg-pink-50/50 shadow-sm" : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${type === t.value ? "bg-pink-500 text-white" : "bg-slate-100 text-slate-600"}`}>{t.icon}</span>
                <span className="block text-sm font-bold text-slate-800 mt-3">{t.label}</span>
                <span className="block text-xs text-slate-500 mt-0.5">{t.desc}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Media"
            subtitle={
              type === "REEL"
                ? "MP4 or MOV, 9:16 recommended, 3s – 15min, up to 100 MB"
                : type === "STORY"
                ? "Photo or video (≤60s), 9:16 recommended"
                : type === "CAROUSEL"
                ? "2–10 photos or videos, all cropped to the first item's ratio"
                : "JPEG/PNG/WebP — converted to JPEG automatically. 4:5 to 1.91:1"
            }
            action={items.length > 0 && <Badge>{items.length}/{cfg.max}</Badge>}
          />
          <div className="px-5 pb-5">
            {items.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-3 mb-3">
                {items.map((it, idx) => (
                  <div key={it.id} className={`relative flex-shrink-0 w-28 rounded-xl overflow-hidden border-2 ${idx === previewIndex ? "border-pink-500" : "border-transparent"}`}>
                    <button onClick={() => setPreviewIndex(idx)} className="block w-full aspect-square bg-slate-100">
                      {it.kind === "VIDEO" ? <video src={it.previewUrl} muted className="w-full h-full object-cover" /> : <img src={it.previewUrl} alt="" className="w-full h-full object-cover" />}
                    </button>
                    {it.kind === "VIDEO" && <span className="absolute bottom-1.5 left-1.5"><Badge tone="dark"><FiFilm size={10} /> Video</Badge></span>}
                    {it.warn && <span className="absolute top-1.5 left-1.5 text-amber-500 bg-white rounded-full p-0.5" title={it.warn}><FiAlertTriangle size={14} /></span>}
                    {!busy && (
                      <button onClick={() => removeItem(it.id)} className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center" aria-label="Remove">
                        <FiX size={13} />
                      </button>
                    )}
                  </div>
                ))}
                {items.length < cfg.max && !busy && (
                  <button onClick={() => inputRef.current?.click()} className="flex-shrink-0 w-28 aspect-square rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:text-pink-500 hover:border-pink-300 flex flex-col items-center justify-center text-xs font-semibold gap-1">
                    <FiPlus size={20} /> Add
                  </button>
                )}
              </div>
            )}

            {items.length === 0 && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  addFiles(e.dataTransfer.files);
                }}
                onClick={() => inputRef.current?.click()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed py-12 flex flex-col items-center justify-center text-center transition-colors ${
                  dragging ? "border-pink-400 bg-pink-50" : "border-slate-300 hover:border-pink-300 hover:bg-slate-50"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mb-3">
                  <FiUploadCloud size={22} />
                </div>
                <p className="text-sm font-semibold text-slate-700">Drag & drop or click to choose</p>
                <p className="text-xs text-slate-500 mt-1">{cfg.max > 1 ? "Select several files at once" : "One file"}</p>
              </div>
            )}
            <input ref={inputRef} type="file" hidden multiple={cfg.max > 1} accept={cfg.accept} onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />

            {items.some((i) => i.warn) && (
              <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex gap-2">
                <FiAlertTriangle className="flex-shrink-0 mt-0.5" /> {items.find((i) => i.warn).warn}
              </div>
            )}
          </div>
        </Card>

        {type !== "STORY" && (
          <Card className="p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="ig-caption" className="text-sm font-bold text-slate-800">Caption</label>
                <span className={`text-xs tabular-nums ${caption.length > 2100 ? "text-rose-600" : "text-slate-400"}`}>{caption.length}/2200</span>
              </div>
              <textarea
                id="ig-caption"
                rows={6}
                maxLength={2200}
                value={caption}
                disabled={busy}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption… Add #hashtags and @mentions"
                className="w-full text-sm rounded-xl border border-slate-200 p-3 outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 resize-y"
              />
              <div className="flex gap-4 mt-1.5 text-xs">
                <span className={hashtags > 30 ? "text-rose-600 font-semibold" : "text-slate-500"}>#{hashtags}/30 hashtags</span>
                <span className={mentions > 20 ? "text-rose-600 font-semibold" : "text-slate-500"}>@{mentions}/20 mentions</span>
              </div>
            </div>
            {type === "IMAGE" && (
              <div>
                <label htmlFor="ig-alt" className="text-sm font-bold text-slate-800">Alt text <span className="font-normal text-slate-400">(optional)</span></label>
                <input
                  id="ig-alt"
                  value={altText}
                  maxLength={1000}
                  disabled={busy}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the photo for people who use screen readers"
                  className="mt-1.5 w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            )}
            {type === "REEL" && <Toggle checked={shareToFeed} onChange={setShareToFeed} disabled={busy} label="Also share to feed" description="Show this reel on your profile grid and in followers' feeds." />}
          </Card>
        )}

        {error && <ErrorNotice error={error} />}
        {result && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <FiCheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
            <p className="text-sm font-semibold text-emerald-800 flex-1">Your {cfg.label.toLowerCase()} is live on Instagram.</p>
            {result.permalink && (
              <a href={result.permalink} target="_blank" rel="noreferrer" className="text-sm font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1">
                View <FiExternalLink size={13} />
              </a>
            )}
          </div>
        )}

        <Card className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            {busy ? (
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                  <span>{STEPS[step]}…</span>
                  {step === "uploading" && <span className="tabular-nums">{progress}%</span>}
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-pink-500 rounded-full transition-all ${step === "uploading" ? "" : "animate-pulse"}`} style={{ width: step === "uploading" ? `${progress}%` : "100%" }} />
                </div>
              </div>
            ) : quota ? (
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{quota.quotaUsage}</span> of {quota.quotaTotal} API posts used in the last 24 hours
              </div>
            ) : (
              <div className="text-xs text-slate-500">Posts are published immediately to @{profile?.username}.</div>
            )}
          </div>
          <div className="flex gap-2">
            {items.length > 0 && !busy && (
              <Button variant="ghost" onClick={reset} icon={<FiTrash2 />}>
                Clear
              </Button>
            )}
            <Button size="lg" onClick={publish} disabled={!canPublish} loading={busy}>
              {busy ? "Publishing" : `Publish ${cfg.label.toLowerCase()}`}
            </Button>
          </div>
        </Card>
      </div>

      {/* Phone preview */}
      <div className="xl:sticky xl:top-4 self-start">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 text-center">Preview</p>
        <div className="mx-auto w-[300px] rounded-[2.2rem] border-[10px] border-slate-900 bg-white shadow-2xl overflow-hidden">
          {!vertical && (
            <div className="flex items-center gap-2 px-3 py-2.5">
              <Avatar src={profile?.profilePictureUrl} name={profile?.username} size={28} ring />
              <span className="text-xs font-semibold text-slate-800">{profile?.username || "your_account"}</span>
            </div>
          )}
          <div className={`relative bg-slate-100 ${vertical ? "aspect-[9/16]" : "aspect-[4/5]"}`}>
            {preview ? (
              preview.kind === "VIDEO" ? (
                <video src={preview.previewUrl} className="w-full h-full object-cover" muted autoPlay loop playsInline />
              ) : (
                <img src={preview.previewUrl} alt="" className="w-full h-full object-cover" />
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300">{cfg.icon}</div>
            )}
            {vertical && (
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <Avatar src={profile?.profilePictureUrl} name={profile?.username} size={26} ring />
                <span className="text-xs font-semibold text-white drop-shadow">{profile?.username}</span>
              </div>
            )}
            {type === "CAROUSEL" && items.length > 1 && (
              <span className="absolute top-3 right-3"><Badge tone="dark">{previewIndex + 1}/{items.length}</Badge></span>
            )}
            {type === "REEL" && caption && <p className="absolute bottom-4 left-3 right-10 text-[11px] text-white drop-shadow line-clamp-2">{caption}</p>}
          </div>
          {!vertical && (
            <div className="px-3 py-2.5 min-h-[72px]">
              <p className="text-[11px] text-slate-800 line-clamp-3 break-words">
                <span className="font-semibold">{profile?.username} </span>
                {caption || <span className="text-slate-400">Your caption will appear here</span>}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
