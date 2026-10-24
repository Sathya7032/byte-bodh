import { useEffect } from "react";

const SITE_URL = "https://bytebodh.in";

/** Creates or updates a <meta> tag identified by name= or property=. */
const setMeta = (attr, key, content) => {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

/** Canonical URL for the current route: production host, no query string / hash, no trailing slash. */
const buildCanonical = (path) => {
  const clean = (path || "/").split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  return `${SITE_URL}${clean === "/" ? "/" : clean}`;
};

/**
 * Per-page SEO for the React SPA: title, description, keywords, canonical URL and
 * Open Graph / Twitter tags (so shared links preview the right page).
 *
 * `canonicalPath` is optional — defaults to the current pathname. Pass `noindex: true`
 * for pages that should not appear in search (e.g. login / dashboard).
 */
export function useSEO({ title, description, keywords, canonicalPath, image, noindex = false }) {
  useEffect(() => {
    if (title) {
      document.title = title;
      setMeta("property", "og:title", title);
      setMeta("name", "twitter:title", title);
    }
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }
    if (keywords) setMeta("name", "keywords", keywords);
    if (image) {
      setMeta("property", "og:image", image);
      setMeta("name", "twitter:image", image);
    }

    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // Only the main site gets a bytebodh.in canonical; user subdomain portfolios keep their own URL.
    const host = typeof window !== "undefined" ? window.location.hostname : "";
    const isMainSite = host === "bytebodh.in" || host === "www.bytebodh.in" || host === "localhost";
    const canonical = isMainSite
      ? buildCanonical(canonicalPath || window.location.pathname)
      : `${window.location.origin}${window.location.pathname}`;

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);
    setMeta("property", "og:url", canonical);
  }, [title, description, keywords, canonicalPath, image, noindex]);
}

export default useSEO;
