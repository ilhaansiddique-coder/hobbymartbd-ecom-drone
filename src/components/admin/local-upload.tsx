"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";

type UploadResult = { url: string; name: string };

// Drop-in replacement for UploadThing's UploadDropzone with the same props,
// so existing forms only need to change their import. Posts to /api/upload,
// which stores files locally under /public/uploads (no external service).
export function UploadDropzone({
  endpoint,
  onClientUploadComplete,
  onUploadError,
  className,
}: {
  endpoint?: string;
  onClientUploadComplete?: (res: UploadResult[]) => void;
  onUploadError?: (e: Error) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  // productImage allows multiple files; blogImage is a single featured image.
  const multiple = endpoint === "productImage";

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(fileList).forEach((f) => fd.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onClientUploadComplete?.(data.files as UploadResult[]);
    } catch (e) {
      onUploadError?.(e instanceof Error ? e : new Error("Upload failed"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        disabled={uploading}
        className={`flex w-full flex-col items-center gap-2 rounded-lg py-6 text-sm transition-colors disabled:opacity-60 ${
          dragOver ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        ) : (
          <UploadCloud className="h-6 w-6 text-blue-600" />
        )}
        <span>
          {uploading
            ? "Uploading..."
            : multiple
              ? "Click or drop images here (max 4MB each)"
              : "Click or drop an image here (max 4MB)"}
        </span>
      </button>
    </div>
  );
}
