import { useRef } from "react";
import type { DragEvent, ReactNode } from "react";
import { useLock } from "@/store/lock-store";

export function StillPick({
  onFile,
  className,
  children,
}: {
  onFile: (f: File) => void;
  className?: string;
  children: ReactNode;
}) {
  const onFileRef = useRef(onFile);
  onFileRef.current = onFile;
  const reading = useRef(false);

  const ingest = (raw: File | undefined, input?: HTMLInputElement) => {
    if (!raw || reading.current) return;
    reading.current = true;
    const name = raw.name || "still";
    const type = raw.type || "application/octet-stream";
    void raw
      .arrayBuffer()
      .then((buf) => {
        if (buf.byteLength < 24) throw new Error("NO FILE");
        onFileRef.current(new File([buf], name, { type }));
      })
      .catch(() => {
        useLock.getState().setError("NO FILE");
        useLock.getState().setBusy(false);
      })
      .finally(() => {
        if (input) input.value = "";
        reading.current = false;
      });
  };

  const onPick = (e: { currentTarget: EventTarget | null; target: EventTarget | null }) => {
    const input = (e.currentTarget || e.target) as HTMLInputElement | null;
    if (!input || input.type !== "file") return;
    ingest(input.files?.[0], input);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    ingest(e.dataTransfer.files?.[0]);
  };

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDrop={onDrop}
    >
      <div className="pointer-events-none">{children}</div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*"
        className="absolute inset-0 z-10 m-0 h-full w-full cursor-pointer p-0 opacity-[0.01]"
        style={{ fontSize: 48, touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
        onChange={onPick}
        onInput={onPick}
      />
    </div>
  );
}
