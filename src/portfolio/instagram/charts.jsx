import React, { useEffect, useMemo, useRef, useState } from "react";
import { formatFull, formatNumber } from "./format";

/* ------------------------------------------------------------------
   Lightweight, dependency-free SVG charts for Instagram Studio.
   Single series per chart (one hue), recessive grid, 2px line,
   crosshair + tooltip on hover, keyboard-free but touch friendly.
------------------------------------------------------------------- */

const SERIES_COLOR = "#db2777"; // pink-600 — the one accent hue for data
const GRID_COLOR = "#e2e8f0";
const AXIS_TEXT = "#94a3b8";

const useWidth = () => {
  const ref = useRef(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    if (!ref.current) return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(240, entry.contentRect.width)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
};

const niceMax = (v) => {
  if (v <= 0) return 4;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / exp;
  const nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nf * exp;
};

const shortDate = (iso) => {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

/**
 * Area chart for a daily series: points = [{ date: "2026-10-01", value: 123 }]
 */
export const AreaChart = ({ points = [], height = 220, valueLabel = "Value" }) => {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  const pad = { top: 12, right: 12, bottom: 26, left: 44 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const { maxY, coords, path, area } = useMemo(() => {
    const vals = points.map((p) => Number(p.value) || 0);
    const max = niceMax(Math.max(...vals, 0));
    const step = points.length > 1 ? innerW / (points.length - 1) : 0;
    const c = points.map((p, i) => ({
      x: pad.left + i * step,
      y: pad.top + innerH - ((Number(p.value) || 0) / max) * innerH,
      ...p,
    }));
    const line = c.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(" ");
    const a = c.length ? `${line} L${c[c.length - 1].x},${pad.top + innerH} L${c[0].x},${pad.top + innerH} Z` : "";
    return { maxY: max, coords: c, path: line, area: a };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, innerW, innerH]);

  if (!points.length) {
    return <div className="h-[220px] flex items-center justify-center text-sm text-slate-400">No data for this period</div>;
  }

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({ v: maxY * t, y: pad.top + innerH - t * innerH }));
  const labelEvery = Math.ceil(points.length / Math.max(2, Math.floor(innerW / 70)));

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    let best = 0;
    coords.forEach((c, i) => {
      if (Math.abs(c.x - x) < Math.abs(coords[best].x - x)) best = i;
    });
    setHover(best);
  };

  const h = hover !== null ? coords[hover] : null;

  return (
    <div ref={ref} className="relative w-full select-none">
      <svg width={width} height={height} role="img" aria-label={`${valueLabel} over time`}>
        <defs>
          <linearGradient id="igAreaFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={SERIES_COLOR} stopOpacity="0.18" />
            <stop offset="100%" stopColor={SERIES_COLOR} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pad.left} x2={width - pad.right} y1={t.y} y2={t.y} stroke={GRID_COLOR} strokeDasharray={i === 0 ? "" : "3 4"} />
            <text x={pad.left - 8} y={t.y + 4} textAnchor="end" fontSize="11" fill={AXIS_TEXT}>
              {formatNumber(t.v)}
            </text>
          </g>
        ))}
        {coords.map((c, i) =>
          (i % labelEvery === 0 && coords.length - 1 - i >= labelEvery * 0.75) || i === coords.length - 1 ? (
            <text key={c.date || i} x={c.x} y={height - 6} textAnchor={i === 0 ? "start" : i === coords.length - 1 ? "end" : "middle"} fontSize="11" fill={AXIS_TEXT}>
              {shortDate(c.date)}
            </text>
          ) : null
        )}
        <path d={area} fill="url(#igAreaFill)" />
        <path d={path} fill="none" stroke={SERIES_COLOR} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {h && (
          <g>
            <line x1={h.x} x2={h.x} y1={pad.top} y2={pad.top + innerH} stroke="#cbd5e1" />
            <circle cx={h.x} cy={h.y} r="5" fill={SERIES_COLOR} stroke="#fff" strokeWidth="2" />
          </g>
        )}
        <rect
          x={pad.left}
          y={pad.top}
          width={innerW}
          height={innerH}
          fill="transparent"
          onMouseMove={onMove}
          onTouchMove={onMove}
          onMouseLeave={() => setHover(null)}
          onTouchEnd={() => setHover(null)}
        />
      </svg>
      {h && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full bg-slate-900 text-white rounded-lg px-3 py-2 shadow-lg text-xs whitespace-nowrap"
          style={{ left: Math.min(Math.max(h.x, 60), width - 60), top: h.y - 10 }}
        >
          <div className="text-slate-300">{shortDate(h.date)}</div>
          <div className="font-bold text-sm tabular-nums">
            {formatFull(h.value)} <span className="font-normal text-slate-300">{valueLabel.toLowerCase()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Horizontal ranked bars: items = [{ label, value }]
 */
export const BarList = ({ items = [], max = 8, formatLabel = (l) => l, total }) => {
  const [hover, setHover] = useState(null);
  const shown = items.slice(0, max);
  const top = Math.max(...shown.map((i) => i.value || 0), 1);
  const sum = total || items.reduce((s, i) => s + (i.value || 0), 0) || 1;
  if (!shown.length) return null;
  return (
    <ul className="space-y-2.5">
      {shown.map((it, idx) => {
        const pct = ((it.value || 0) / sum) * 100;
        return (
          <li key={it.label} onMouseEnter={() => setHover(idx)} onMouseLeave={() => setHover(null)} className="group">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-700 font-medium truncate pr-3">{formatLabel(it.label)}</span>
              <span className="text-slate-500 tabular-nums text-xs">
                {hover === idx ? formatFull(it.value) : formatNumber(it.value)} · {pct.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(2, ((it.value || 0) / top) * 100)}%`, background: SERIES_COLOR, opacity: hover === null || hover === idx ? 1 : 0.55 }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

/** Tiny inline trend line for stat tiles. */
export const Sparkline = ({ points = [], width = 96, height = 28 }) => {
  if (points.length < 2) return null;
  const vals = points.map((p) => Number(p.value) || 0);
  const max = Math.max(...vals, 1);
  const min = Math.min(...vals, 0);
  const step = width / (points.length - 1);
  const d = vals.map((v, i) => `${i ? "L" : "M"}${(i * step).toFixed(1)},${(height - ((v - min) / (max - min || 1)) * (height - 4) - 2).toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height} aria-hidden="true">
      <path d={d} fill="none" stroke={SERIES_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
