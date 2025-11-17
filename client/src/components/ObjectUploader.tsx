// Referenced from blueprint:javascript_object_storage
import { useRef, useState } from "react";
import type { ReactNode } from "react";
import Uppy from "@uppy/core";
import DashboardModal from "@uppy/react/dashboard-modal";
import AwsS3 from "@uppy/aws-s3";
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
  const [showModal, setShowModal] = useState(false);
  const [uppy, setUppy] = useState<Uppy | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const createUppy = () => {
    const u = new Uppy({
      restrictions: {
        maxNumberOfFiles,
        maxFileSize,
      },
      autoProceed: false,
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: onGetUploadParameters,
      })
      .on("complete", (result) => {
        onComplete?.(result);
      });

    setUppy(u);
    return u;
  };

  const isProxiedUpload = (url: string) => {
    try {
      // Relative paths ("/api/...") or same-origin absolute URLs should be handled by the proxy/fallback flow
      if (url.startsWith("/")) return true;
      const parsed = new URL(url, window.location.href);
      return parsed.origin === window.location.origin && parsed.pathname.startsWith("/api/");
    } catch (e) {
      return false;
    }
  };

  const handleButtonClick = async () => {
    // Probe the upload parameters once to detect proxied/local URLs
    let info: { method: "PUT"; url: string } | null = null;
    try {
      info = await onGetUploadParameters();
    } catch (e) {
      // If probing fails, fall back to opening the Uppy modal (it will call getUploadParameters per-file)
    }

    if (info && isProxiedUpload(info.url)) {
      // Use a native file input + fetch PUT for proxied/local uploads where signed URLs point to our own /api
      if (!inputRef.current) return;
      inputRef.current.value = "";
      inputRef.current.click();
      return;
    }

    // Otherwise, open the Uppy modal and ensure Uppy is created
    if (!uppy) createUppy();
    setShowModal(true);
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
          // Include credentials for same-origin requests in case the endpoint requires them
          credentials: "include",
          headers: {
            // Let the browser set the Content-Type for blobs when possible
            "Content-Type": file.type || "application/octet-stream",
          },
        });

        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

        successful.push({
          id: file.name,
          name: file.name,
          size: file.size,
          uploadURL: uploadUrl,
        });
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

      {uppy && (
        <DashboardModal
          uppy={uppy}
          open={showModal}
          onRequestClose={() => setShowModal(false)}
          proudlyDisplayPoweredByUppy={false}
        />
      )}
    </div>
  );
}
