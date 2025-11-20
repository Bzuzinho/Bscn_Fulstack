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
    method: "PUT" | "POST";
    url: string;
  }>;
  onComplete?: (
    result: UploadResult<Record<string, unknown>, Record<string, unknown>>
  ) => void;
  buttonClassName?: string;
  children: ReactNode;
  userId?: string | number; // User ID for permission check
}

export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760, // 10MB default
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
  userId,
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
        // Convert file to base64 for direct database storage
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });

        // Validate file size (default 10MB)
        if (file.size > maxFileSize) {
          throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${(maxFileSize / 1024 / 1024).toFixed(2)}MB)`);
        }

        // Validate file type (images and common documents)
        const allowedTypes = [
          'image/', 
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        
        const isAllowed = allowedTypes.some(type => file.type.startsWith(type) || file.type === type);
        if (!isAllowed) {
          throw new Error('File type not allowed. Allowed: images, PDF, Word, Excel');
        }

        // Get upload parameters (this will now return the direct upload endpoint)
        const params = await onGetUploadParameters();
        const uploadUrl = params.url;

        // Upload as JSON with base64 data
        const res = await fetch(uploadUrl, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageData: base64Data,
            userId: userId,
          }),
        });

        if (!res.ok) {
          // Provide more detailed error information for debugging
          let errorMsg = `Upload failed with status ${res.status}`;
          if (res.status === 400) {
            const body = await res.json().catch(() => ({}));
            errorMsg = `Upload failed: ${body.error || 'Invalid request'}`;
          } else if (res.status === 403) {
            errorMsg = "Upload failed: Access denied. Check permissions.";
          } else if (res.status === 404) {
            errorMsg = "Upload failed: Endpoint not found.";
          } else if (res.status === 413) {
            errorMsg = "Upload failed: File too large.";
          }
          throw new Error(errorMsg);
        }

        const responseData = await res.json();
        const finalPath = responseData.profileImageUrl || base64Data;

        successful.push({ 
          id: file.name, 
          name: file.name, 
          size: file.size, 
          uploadURL: finalPath 
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Upload error:", errorMessage, err);
        failed.push({ id: file.name, error: errorMessage });
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
