"use client";

import { useReducer, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { FaYoutube } from "react-icons/fa6";
import { extractYoutubeVideoId, isValidYoutubeId, youtubeEmbedUrl, youtubeWatchUrl } from "@/lib/youtube";

const ResizableImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element: HTMLElement) => element.style.width || null,
        renderHTML: (attributes: { width?: string | null }) => {
          if (!attributes.width) return {};
          return { style: `width: ${attributes.width}` };
        },
      },
    };
  },
});

const WIDTH_PRESETS = [
  { label: "Small", value: "320px" },
  { label: "Medium", value: "600px" },
  { label: "Large", value: "900px" },
  { label: "Full", value: "100%" },
];

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    youtubeEmbed: {
      setYoutubeEmbed: (videoId: string) => ReturnType;
      updateYoutubeEmbed: (pos: number, videoId: string) => ReturnType;
      removeYoutubeEmbed: (pos: number) => ReturnType;
    };
  }
}

type YoutubeEmbedOptions = {
  onRequestEdit: (pos: number, videoId: string) => void;
};

/**
 * Renders as a real <iframe> block (atom node, no editable content) so a
 * saved/reloaded video shows a live player instead of raw markup. The node
 * only ever stores a bare video ID — the iframe src is always rebuilt from
 * that ID (never taken from arbitrary pasted HTML), which is what keeps
 * this safe from iframe/XSS injection via the editor.
 */
const YoutubeEmbed = Node.create<YoutubeEmbedOptions>({
  name: "youtubeEmbed",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return { onRequestEdit: () => {} };
  },

  addAttributes() {
    return {
      videoId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-video-id"),
        renderHTML: (attributes) => ({ "data-video-id": attributes.videoId }),
      },
      width: {
        default: null,
        renderHTML: (attributes) =>
          attributes.width ? { style: `width: ${attributes.width}` } : {},
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-youtube-embed]",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const id = element.getAttribute("data-video-id");
          if (!id || !isValidYoutubeId(id)) return false;
          return { videoId: id, width: element.style.width || null };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const videoId = HTMLAttributes["data-video-id"];
    const src = isValidYoutubeId(videoId) ? youtubeEmbedUrl(videoId) : "";
    return [
      "div",
      mergeAttributes(HTMLAttributes, { class: "yt-embed", "data-youtube-embed": "" }),
      [
        "div",
        { class: "yt-embed-inner" },
        [
          "iframe",
          {
            src,
            title: "YouTube video player",
            frameborder: "0",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            referrerpolicy: "strict-origin-when-cross-origin",
            allowfullscreen: "true",
          },
        ],
      ],
    ];
  },

  addCommands() {
    return {
      setYoutubeEmbed:
        (videoId: string) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { videoId } }),
      updateYoutubeEmbed:
        (pos: number, videoId: string) =>
        ({ tr, dispatch }) => {
          const node = tr.doc.nodeAt(pos);
          if (!node || node.type.name !== this.name) return false;
          if (dispatch) dispatch(tr.setNodeMarkup(pos, undefined, { ...node.attrs, videoId }));
          return true;
        },
      removeYoutubeEmbed:
        (pos: number) =>
        ({ tr, dispatch }) => {
          const node = tr.doc.nodeAt(pos);
          if (!node || node.type.name !== this.name) return false;
          if (dispatch) dispatch(tr.delete(pos, pos + node.nodeSize));
          return true;
        },
    };
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const dom = document.createElement("div");
      dom.className = "yt-embed";
      dom.setAttribute("data-youtube-embed", "");
      dom.contentEditable = "false";

      const inner = document.createElement("div");
      inner.className = "yt-embed-inner";
      dom.appendChild(inner);

      const toolbar = document.createElement("div");
      toolbar.className = "yt-embed-toolbar";

      const replaceBtn = document.createElement("button");
      replaceBtn.type = "button";
      replaceBtn.className = "yt-embed-btn";
      replaceBtn.textContent = "Replace";
      replaceBtn.setAttribute("aria-label", "Replace YouTube video");
      replaceBtn.onclick = () => {
        const pos = getPos();
        if (typeof pos === "number") this.options.onRequestEdit(pos, node.attrs.videoId ?? "");
      };

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "yt-embed-btn yt-embed-btn--danger";
      removeBtn.textContent = "Remove";
      removeBtn.setAttribute("aria-label", "Remove YouTube video");
      removeBtn.onclick = () => {
        const pos = getPos();
        if (typeof pos === "number") editor.chain().focus().removeYoutubeEmbed(pos).run();
      };

      toolbar.append(replaceBtn, removeBtn);
      dom.appendChild(toolbar);

      const render = (videoId: string) => {
        inner.innerHTML = "";
        if (isValidYoutubeId(videoId)) {
          const iframe = document.createElement("iframe");
          iframe.src = youtubeEmbedUrl(videoId);
          iframe.title = "YouTube video player";
          iframe.setAttribute("frameborder", "0");
          iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
          iframe.referrerPolicy = "strict-origin-when-cross-origin";
          iframe.allowFullscreen = true;
          inner.appendChild(iframe);

          // A live iframe inside contenteditable captures its own clicks, so
          // clicking the video wouldn't reliably select this node. This
          // transparent shield sits on top and selects the node instead.
          const shield = document.createElement("div");
          shield.className = "yt-embed-clickshield";
          shield.setAttribute("role", "button");
          shield.setAttribute("tabindex", "0");
          shield.setAttribute("aria-label", "YouTube video — click to select");
          const select = () => {
            const pos = getPos();
            if (typeof pos === "number") editor.commands.setNodeSelection(pos);
          };
          shield.onclick = select;
          shield.onkeydown = (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              select();
            }
          };
          inner.appendChild(shield);
        } else {
          const notice = document.createElement("div");
          notice.className = "yt-embed-invalid";
          notice.textContent = "Invalid YouTube video";
          inner.appendChild(notice);
        }
      };

      const applyWidth = (width: string | null) => {
        dom.style.width = width || "";
      };

      render(node.attrs.videoId);
      applyWidth(node.attrs.width);

      return {
        dom,
        selectNode: () => dom.classList.add("is-selected"),
        deselectNode: () => dom.classList.remove("is-selected"),
        update: (updatedNode) => {
          if (updatedNode.type.name !== this.name) return false;
          if (updatedNode.attrs.videoId !== node.attrs.videoId) {
            render(updatedNode.attrs.videoId);
          }
          applyWidth(updatedNode.attrs.width);
          node = updatedNode;
          return true;
        },
      };
    };
  },
});

async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/blogs/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data.url as string;
}

export default function RichTextEditor({
  content,
  onChange,
  variant = "full",
  placeholder,
}: {
  content: string;
  onChange: (html: string) => void;
  variant?: "full" | "compact";
  placeholder?: string;
}) {
  const compact = variant === "compact";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [youtubeModal, setYoutubeModal] = useState<{ pos: number | null; url: string } | null>(null);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const onRequestEditRef = useRef((pos: number, videoId: string) => {
    setYoutubeModal({ pos, url: isValidYoutubeId(videoId) ? youtubeWatchUrl(videoId) : "" });
    setYoutubeError(null);
  });
  // editor.isActive(...) is computed fresh on every render below, but a
  // selection-only change (e.g. clicking an image/video to select it) fires
  // no onUpdate — without this, the image/video resize toolbar can go stale
  // right after the click that's supposed to reveal it.
  const [, forceRerender] = useReducer((n: number) => n + 1, 0);

  const editor = useEditor({
    immediatelyRender: false,
    onTransaction: () => forceRerender(),
    extensions: compact
      ? [
          StarterKit.configure({
            heading: false,
            blockquote: false,
            bulletList: false,
            orderedList: false,
            listItem: false,
            listKeymap: false,
            codeBlock: false,
            horizontalRule: false,
            link: false,
          }),
          Placeholder.configure({ placeholder: placeholder ?? "Write a short excerpt…" }),
        ]
      : [
          StarterKit.configure({ link: { openOnClick: false } }),
          ResizableImage.configure({ inline: false, allowBase64: false }),
          Placeholder.configure({ placeholder: placeholder ?? "Write the article…" }),
          YoutubeEmbed.configure({
            onRequestEdit: (pos, videoId) => onRequestEditRef.current(pos, videoId),
          }),
        ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: compact
      ? { attributes: { class: "rte-prosemirror" } }
      : {
          attributes: { class: "rte-prosemirror blog-article-content" },
          handleDrop(view, event, _slice, moved) {
            if (moved) return false;
            const files = Array.from(event.dataTransfer?.files ?? []).filter((f) =>
              f.type.startsWith("image/")
            );
            if (files.length === 0) return false;
            event.preventDefault();
            files.forEach((file) => {
              uploadImage(file)
                .then((url) => {
                  const { schema } = view.state;
                  const node = schema.nodes.image.create({ src: url, alt: file.name });
                  const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
                  const pos = coords ? coords.pos : view.state.selection.from;
                  view.dispatch(view.state.tr.insert(pos, node));
                })
                .catch((e) => setUploadError(e instanceof Error ? e.message : "Upload failed."));
            });
            return true;
          },
          handlePaste(_view, event) {
            const items = Array.from(event.clipboardData?.items ?? []);
            const imageItem = items.find((i) => i.type.startsWith("image/"));
            if (!imageItem) return false;
            const file = imageItem.getAsFile();
            if (!file) return false;
            event.preventDefault();
            uploadImage(file)
              .then((url) => {
                editor?.chain().focus().setImage({ src: url, alt: file.name }).run();
              })
              .catch((e) => setUploadError(e instanceof Error ? e.message : "Upload failed."));
            return true;
          },
        },
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const closeYoutubeModal = () => {
    setYoutubeModal(null);
    setYoutubeError(null);
  };

  const submitYoutubeModal = () => {
    if (!youtubeModal) return;
    const videoId = extractYoutubeVideoId(youtubeModal.url);
    if (!videoId) {
      setYoutubeError(
        "Enter a valid YouTube URL, e.g. https://www.youtube.com/watch?v=0IIt_YHZSbo"
      );
      return;
    }
    if (youtubeModal.pos !== null) {
      editor.chain().focus().updateYoutubeEmbed(youtubeModal.pos, videoId).run();
    } else {
      editor.chain().focus().setYoutubeEmbed(videoId).run();
    }
    closeYoutubeModal();
  };

  const imageSelected = !compact && editor.isActive("image");
  const youtubeSelected = !compact && editor.isActive("youtubeEmbed");

  return (
    <div className={`rte ${compact ? "rte--compact" : ""}`}>
      <div className="rte-toolbar">
        {!compact && (
          <>
            <button
              type="button"
              className={`rte-btn ${editor.isActive("heading", { level: 1 }) ? "is-active" : ""}`}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              H1
            </button>
            <button
              type="button"
              className={`rte-btn ${editor.isActive("heading", { level: 2 }) ? "is-active" : ""}`}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              H2
            </button>
            <button
              type="button"
              className={`rte-btn ${editor.isActive("heading", { level: 3 }) ? "is-active" : ""}`}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              H3
            </button>
            <span className="rte-sep" />
          </>
        )}
        <button
          type="button"
          className={`rte-btn ${editor.isActive("bold") ? "is-active" : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          className={`rte-btn rte-btn--italic ${editor.isActive("italic") ? "is-active" : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          type="button"
          className={`rte-btn rte-btn--underline ${editor.isActive("underline") ? "is-active" : ""}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </button>
        <button
          type="button"
          className={`rte-btn rte-btn--strike ${editor.isActive("strike") ? "is-active" : ""}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          S
        </button>
        {!compact && (
          <>
            <button
              type="button"
              className={`rte-btn rte-btn--code ${editor.isActive("code") ? "is-active" : ""}`}
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              &lt;/&gt;
            </button>
            <span className="rte-sep" />
            <button
              type="button"
              className={`rte-btn ${editor.isActive("bulletList") ? "is-active" : ""}`}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              &bull; List
            </button>
            <button
              type="button"
              className={`rte-btn ${editor.isActive("orderedList") ? "is-active" : ""}`}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              1. List
            </button>
            <button
              type="button"
              className={`rte-btn ${editor.isActive("blockquote") ? "is-active" : ""}`}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              &ldquo;&rdquo;
            </button>
            <button
              type="button"
              className={`rte-btn ${editor.isActive("codeBlock") ? "is-active" : ""}`}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              Code Block
            </button>
            <button
              type="button"
              className="rte-btn"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              &mdash; Divider
            </button>
            <span className="rte-sep" />
            <button
              type="button"
              className={`rte-btn ${editor.isActive("link") ? "is-active" : ""}`}
              onClick={setLink}
            >
              Link
            </button>
            <button
              type="button"
              className="rte-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "+ Image"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              hidden
              onChange={handleFilePick}
            />
            <button
              type="button"
              className="rte-btn rte-btn--youtube"
              onClick={() => {
                setYoutubeModal({ pos: null, url: "" });
                setYoutubeError(null);
              }}
            >
              <FaYoutube size={14} aria-hidden="true" /> YouTube
            </button>
          </>
        )}
        <span className="rte-sep" />
        <button type="button" className="rte-btn" onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </button>
        <button type="button" className="rte-btn" onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </button>
      </div>

      {(imageSelected || youtubeSelected) && (
        <div className="rte-image-toolbar">
          <span>{youtubeSelected ? "Video size:" : "Image size:"}</span>
          {WIDTH_PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              className="rte-btn"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .updateAttributes(youtubeSelected ? "youtubeEmbed" : "image", { width: p.value })
                  .run()
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {!compact && uploadError && <p className="admin-error">{uploadError}</p>}

      <EditorContent editor={editor} className="rte-content" />
      {!compact && (
        <p className="admin-field-help">
          Drag and drop an image anywhere in the editor, paste one from your clipboard, or use the
          &ldquo;+ Image&rdquo; button to upload from your computer. Click an image or video to change its
          size.
        </p>
      )}

      {youtubeModal && (
        <div className="yt-modal-backdrop" onMouseDown={closeYoutubeModal}>
          <div
            className="yt-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="yt-modal-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3 id="yt-modal-title">
              {youtubeModal.pos !== null ? "Replace YouTube Video" : "Insert YouTube Video"}
            </h3>
            <label htmlFor="yt-modal-url">Paste YouTube URL</label>
            <input
              id="yt-modal-url"
              type="url"
              autoFocus
              value={youtubeModal.url}
              onChange={(e) => {
                setYoutubeModal({ ...youtubeModal, url: e.target.value });
                setYoutubeError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitYoutubeModal();
                } else if (e.key === "Escape") {
                  closeYoutubeModal();
                }
              }}
              placeholder="https://www.youtube.com/watch?v=0IIt_YHZSbo"
            />
            {youtubeError && (
              <p className="admin-error" role="alert">
                {youtubeError}
              </p>
            )}
            <div className="yt-modal-actions">
              <button type="button" className="rte-btn" onClick={closeYoutubeModal}>
                Cancel
              </button>
              <button type="button" className="rte-btn rte-btn--primary" onClick={submitYoutubeModal}>
                {youtubeModal.pos !== null ? "Replace" : "Insert"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
