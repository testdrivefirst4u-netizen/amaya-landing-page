"use client";

import { useRef, useState, useEffect } from "react";
import { FiUploadCloud, FiX, FiRefreshCw } from "react-icons/fi";
import { ikTransform, IK_THUMB } from "@/lib/imagekitUrl";

const RECOMMENDED_WIDTH = 1200;
const RECOMMENDED_HEIGHT = 630;
const RECOMMENDED_RATIO = RECOMMENDED_WIDTH / RECOMMENDED_HEIGHT;

async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/blogs/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data.url as string;
}

type Dimensions = { width: number; height: number } | null;

export default function FeaturedImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dims, setDims] = useState<Dimensions>(null);

  useEffect(() => {
    if (!value) {
      setDims(null);
      return;
    }
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setDims({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      if (!cancelled) setDims(null);
    };
    img.src = value;
    return () => {
      cancelled = true;
    };
  }, [value]);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const ratio = dims ? dims.width / dims.height : null;
  const ratioOff = ratio !== null && Math.abs(ratio - RECOMMENDED_RATIO) > 0.15;
  const tooSmall = dims !== null && dims.width < 600;

  return (
    <div className="feat-image-field">
      <div
        className={`admin-dropzone ${dragOver ? "is-dragover" : ""} ${value ? "has-image" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => !value && fileInputRef.current?.click()}
      >
        {value ? (
          <>
            <img
              src={ikTransform(value, IK_THUMB)}
              alt="Featured"
              className="admin-dropzone-preview"
            />
            <div className="feat-image-overlay">
              <button
                type="button"
                className="feat-image-action"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <FiRefreshCw size={14} /> Replace
              </button>
              <button
                type="button"
                className="feat-image-action feat-image-action--danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
              >
                <FiX size={14} /> Remove
              </button>
            </div>
          </>
        ) : (
          <div className="admin-dropzone-empty">
            <FiUploadCloud size={26} />
            <p>{uploading ? "Uploading…" : "Drag & drop an image, or click to upload"}</p>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) handleFile(file);
        }}
      />
      {error && <p className="admin-error">{error}</p>}

      <input
        type="text"
        className="admin-dropzone-url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste an image path/URL, e.g. /gallery/01_home_hero_facade_wide.avif"
      />

      <div className="feat-image-info">
        <span>
          Recommended: {RECOMMENDED_WIDTH} × {RECOMMENDED_HEIGHT}px (1.91:1) for sharp Google and social
          previews.
        </span>
        {dims && (
          <span className={`feat-image-dims ${ratioOff || tooSmall ? "is-warn" : "is-ok"}`}>
            Current: {dims.width} × {dims.height}px
            {tooSmall && " — resolution is low, consider a larger image."}
            {!tooSmall && ratioOff && " — aspect ratio differs from 1.91:1; may be cropped in previews."}
            {!tooSmall && !ratioOff && " — looks great."}
          </span>
        )}
      </div>
    </div>
  );
}
