import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

/**
 * Quill 2 rich-text editor with a correct React lifecycle.
 *
 * Why not react-quilljs' useQuill? It binds Quill to the first DOM node it ever sees and never
 * rebinds, so inside a modal it went stale after the first open (blank editor on edit, content
 * from a previous article being saved, editor lost when switching tabs).
 *
 * Usage: render with a `key` that changes per article; read content through the ref:
 *   ref.current.getHTML(), ref.current.isEmpty(), await ref.current.uploadInlineImages()
 */
const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  ["link", "image"],
  ["clean"],
];

const FORMATS = [
  "header", "bold", "italic", "underline", "strike", "color", "background",
  "list", "indent", "align", "blockquote", "code-block", "link", "image",
];

const dataUrlToFile = async (dataUrl, index) => {
  const blob = await (await fetch(dataUrl)).blob();
  const ext = (blob.type.split("/")[1] || "png").replace("jpeg", "jpg");
  return new File([blob], `inline-image-${Date.now()}-${index}.${ext}`, { type: blob.type });
};

const RichTextEditor = forwardRef(({ initialHtml = "", onImageUpload, placeholder, onChange, invalid = false }, ref) => {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const uploadRef = useRef(onImageUpload);
  const changeRef = useRef(onChange);
  uploadRef.current = onImageUpload;
  changeRef.current = onChange;

  useEffect(() => {
    const container = containerRef.current;
    const editorEl = document.createElement("div");
    container.appendChild(editorEl);

    const insertUploaded = async (files, index) => {
      const quill = quillRef.current;
      let at = index;
      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        const url = await uploadRef.current?.(file);
        if (url && quillRef.current) {
          quill.insertEmbed(at, "image", url, "user");
          at += 1;
          quill.setSelection(at, 0, "silent");
        }
      }
    };

    const quill = new Quill(editorEl, {
      theme: "snow",
      placeholder,
      formats: FORMATS,
      modules: {
        toolbar: {
          container: TOOLBAR,
          handlers: {
            image: () => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml";
              input.onchange = () => {
                const file = input.files?.[0];
                const range = quill.getSelection(true);
                if (file) insertUploaded([file], range ? range.index : quill.getLength());
              };
              input.click();
            },
          },
        },
        // Dropped / pasted image FILES are uploaded to the CDN instead of being inlined as base64.
        uploader: {
          mimetypes: ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"],
          handler: (range, files) => insertUploaded(files, range ? range.index : quill.getLength()),
        },
      },
    });

    if (initialHtml) {
      quill.setContents(quill.clipboard.convert({ html: initialHtml }), "silent");
      quill.history.clear();
    }
    quill.on("text-change", () => changeRef.current?.());
    quillRef.current = quill;

    return () => {
      quillRef.current = null;
      container.innerHTML = ""; // removes toolbar + editor (also safe under React StrictMode double-mount)
    };
    // Mount once per `key`; initialHtml is only the starting value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    getHTML: () => {
      const q = quillRef.current;
      if (!q) return "";
      // root.innerHTML (not getSemanticHTML: in Quill 2.0.3 it turns every space into &nbsp;, which breaks word wrap)
      const html = q.root.innerHTML;
      return html === "<p></p>" || html === "<p><br></p>" ? "" : html;
    },
    getText: () => quillRef.current?.getText().trim() || "",
    isEmpty: () => {
      const q = quillRef.current;
      if (!q) return true;
      return !q.getText().trim() && !q.root.querySelector("img, iframe, video");
    },
    focus: () => quillRef.current?.focus(),
    /**
     * Uploads any remaining base64 images (e.g. pasted from another website's HTML) and swaps their
     * src for the CDN URL. Returns the number of images uploaded.
     */
    uploadInlineImages: async () => {
      const q = quillRef.current;
      if (!q) return 0;
      const imgs = Array.from(q.root.querySelectorAll('img[src^="data:"]'));
      let i = 0;
      for (const img of imgs) {
        const file = await dataUrlToFile(img.getAttribute("src"), i);
        const url = await uploadRef.current?.(file);
        if (!url) throw new Error("An inline image could not be uploaded.");
        img.setAttribute("src", url);
        i += 1;
      }
      if (i) q.update("silent");
      return i;
    },
  }));

  return (
    <div
      ref={containerRef}
      className={`bb-rich-editor bg-white rounded-2xl overflow-hidden border ${invalid ? "border-rose-300 ring-4 ring-rose-100" : "border-slate-200"}
        [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:bg-slate-50
        [&_.ql-container]:border-0 [&_.ql-container]:text-sm [&_.ql-editor]:min-h-[300px] [&_.ql-editor]:max-h-[60vh] [&_.ql-editor]:overflow-y-auto
        [&_.ql-editor_img]:rounded-lg [&_.ql-editor_img]:my-2`}
    />
  );
});

export default RichTextEditor;
