import { useEffect } from "react";

/**
 * Custom React hook to dynamically update page titles and meta headers for SEO.
 * Useful for addressing Google AdSense duplicate/thin content guidelines on React SPAs.
 */
export function useSEO({ title, description, keywords }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", description);
      } else {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        metaDesc.setAttribute("content", description);
        document.head.appendChild(metaDesc);
      }
    }

    if (keywords) {
      let metaKey = document.querySelector('meta[name="keywords"]');
      if (metaKey) {
        metaKey.setAttribute("content", keywords);
      } else {
        metaKey = document.createElement("meta");
        metaKey.setAttribute("name", "keywords");
        metaKey.setAttribute("content", keywords);
        document.head.appendChild(metaKey);
      }
    }
  }, [title, description, keywords]);
}

export default useSEO;
