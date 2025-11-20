// Referenced from blueprint:javascript_object_storage
import { useRef, useState } from "react";
import type { ReactNode } from "react";
import type { UploadResult } from "@uppy/core";
import { Button } from "@/components/ui/button";

// Note: Uppy CSS is loaded via CDN in index.html
// Direct imports don't work due to Uppy's package.json structure

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (
    result: UploadResult<Record<string, unknown>, Record<string, unknown>>
  ) => void;
  buttonClassName?: string;
  children: ReactNode;
}

export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760, // 10MB default
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
}: ObjectUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = async () => {
    if (!inputRef.current) return;
    inputRef.current.value = "";
    inputRef.current.click();
  };

  const handleNativeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const successful: Array<any> = [];
    const failed: Array<any> = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const params = await onGetUploadParameters();
        const uploadUrl = params.url;
        const method = params.method ?? "PUT";

        const res = await fetch(uploadUrl, {
          method,
          body: file,
          credentials: "include",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
        });

        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

        let finalPath = uploadUrl;
        try {
          const body = await res.json();
          finalPath = (body && (body.path || body.objectPath || body.url)) || uploadUrl;
        } catch (e) {
          finalPath = uploadUrl;
        }

        try {
          if (typeof finalPath === "string" && finalPath.startsWith("/")) {
            finalPath = `${window.location.origin}${finalPath}`;
          }
        } catch (e) {
          // ignore
        }

        successful.push({ id: file.name, name: file.name, size: file.size, uploadURL: finalPath });
      } catch (err) {
        failed.push({ id: file.name, error: String(err) });
      }
    }

    const result: UploadResult<Record<string, unknown>, Record<string, unknown>> = {
      successful,
      failed,
    } as any;

    onComplete?.(result);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        multiple={maxNumberOfFiles > 1}
        style={{ display: "none" }}
        onChange={handleNativeInput}
      />

      <Button onClick={handleButtonClick} className={buttonClassName}>
        {children}
      </Button>
    </div>
  );
}
