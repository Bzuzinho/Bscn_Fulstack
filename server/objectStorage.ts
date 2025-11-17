// Referenced from blueprint:javascript_object_storage
import { Storage, File } from "@google-cloud/storage";
import { Response } from "express";
import { randomUUID } from "crypto";
import {
  ObjectAclPolicy,
  ObjectPermission,
  canAccessObject,
  getObjectAclPolicy,
  setObjectAclPolicy,
} from "./objectAcl.ts";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

// The object storage client is used to interact with the object storage service.
export const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

// The object storage service is used to interact with the object storage service.
export class ObjectStorageService {
  constructor() {}

  // Gets the public object search paths.
  getPublicObjectSearchPaths(): Array<string> {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = Array.from(
      new Set(
        pathsStr
          .split(",")
          .map((path) => path.trim())
          .filter((path) => path.length > 0)
      )
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' " +
          "tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths)."
      );
    }
    return paths;
  }

  // Gets the private object directory.
  getPrivateObjectDir(): string {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
          "tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    return dir;
  }

  // Search for a public object from the search paths.
  async searchPublicObject(filePath: string): Promise<File | null> {
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = `${searchPath}/${filePath}`;

      // Full path format: /<bucket_name>/<object_name>
      const { bucketName, objectName } = parseObjectPath(fullPath);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);

      // Check if file exists
      const [exists] = await file.exists();
      if (exists) {
        return file;
      }
    }

    return null;
  }

  // Downloads an object to the response.
  async downloadObject(file: File, res: Response, cacheTtlSec: number = 3600) {
    try {
      // Get file metadata
      const [metadata] = await file.getMetadata();
      // Get the ACL policy for the object.
      const aclPolicy = await getObjectAclPolicy(file);
      const isPublic = aclPolicy?.visibility === "public";
      // Set appropriate headers
      res.set({
        "Content-Type": metadata.contentType || "application/octet-stream",
        "Content-Length": metadata.size,
        "Cache-Control": `${
          isPublic ? "public" : "private"
        }, max-age=${cacheTtlSec}`,
      });

      // Stream the file to the response
      const stream = file.createReadStream();

      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming file" });
        }
      });

      stream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }

  // Gets the upload URL for an object entity.
  async getObjectEntityUploadURL(): Promise<string> {
    try {
      const privateObjectDir = this.getPrivateObjectDir();
      const objectId = randomUUID();
      const fullPath = `${privateObjectDir}/uploads/${objectId}`;

      const { bucketName, objectName } = parseObjectPath(fullPath);

      console.log(
        "objectStorage.getObjectEntityUploadURL -> fullPath:",
        fullPath,
        "bucket:",
        bucketName,
        "object:",
        objectName
      );

      // Sign URL for PUT method with TTL
      return await signObjectURL({
        bucketName,
        objectName,
        method: "PUT",
        ttlSec: 900,
      });
    } catch (err) {
      // Development fallback: when PRIVATE_OBJECT_DIR is not set or signing fails
      // (for example, no sidecar available), return a relative API PUT URL so the
      // frontend can upload via the current origin (and Vite's /api proxy).
      console.warn("objectStorage.getObjectEntityUploadURL - using local fallback:", err?.message ?? err);
      const localId = randomUUID();
      // Return a relative path under /api so dev frontends (served from a proxy)
      // will send the request to the backend (e.g. Vite proxy /api -> backend).
      return `/api/local-uploads-upload/${localId}`;
    }
  }

  // Gets the object entity file from the object path.
  async getObjectEntityFile(objectPath: string): Promise<File> {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }

    const parts = objectPath.slice(1).split("/");
    if (parts.length < 2) {
      throw new ObjectNotFoundError();
    }

    const entityId = parts.slice(1).join("/");
    let entityDir = this.getPrivateObjectDir();
    if (!entityDir.endsWith("/")) {
      entityDir = `${entityDir}/`;
    }
    const objectEntityPath = `${entityDir}${entityId}`;
    const { bucketName, objectName } = parseObjectPath(objectEntityPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const objectFile = bucket.file(objectName);
    const [exists] = await objectFile.exists();
    if (!exists) {
      throw new ObjectNotFoundError();
    }
    return objectFile;
  }

  normalizeObjectEntityPath(rawPath: string): string {
    // If it's an absolute URL (http(s)://...), extract the pathname so that
    // local fallback URLs like `http://localhost:3000/local-uploads-upload/...`
    // are normalized to their path component before further processing.
    let rawObjectPath: string;
    if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
      try {
        const url = new URL(rawPath);
        rawObjectPath = url.pathname;
      } catch (e: any) {
        console.error('normalizeObjectEntityPath: failed to parse URL', rawPath, e?.message ?? e);
        return rawPath;
      }
    } else {
      rawObjectPath = rawPath;
    }

    // If this is a local-dev uploaded file path (the local PUT fallback),
    // normalize immediately and avoid calling `getPrivateObjectDir()` which
    // requires production config. Also accept the proxied `/api/...` variants
    // that the frontend may receive when using Vite's `/api` proxy in dev.
    if (
      rawObjectPath.startsWith('/local-uploads') ||
      rawObjectPath.startsWith('/local-uploads-upload') ||
      rawObjectPath.startsWith('/api/local-uploads') ||
      rawObjectPath.startsWith('/api/local-uploads-upload')
    ) {
      // Convert API-prefixed paths to the public-serving path where appropriate
      if (rawObjectPath.startsWith('/api/local-uploads-upload')) {
        return rawObjectPath.replace('/api/local-uploads-upload/', '/local-uploads/').replace('/api/local-uploads-upload', '/local-uploads');
      }
      if (rawObjectPath.startsWith('/api/local-uploads')) {
        return rawObjectPath.replace('/api/local-uploads/', '/local-uploads/').replace('/api/local-uploads', '/local-uploads');
      }

      return rawObjectPath;
    }
  
    // If we get here we need to consult the private object dir. Be defensive
    // because in development `PRIVATE_OBJECT_DIR` may be missing and the
    // original implementation threw an exception. If that happens, return
    // the raw object path to allow callers to handle local fallbacks.
    let objectEntityDir = "";
    try {
      objectEntityDir = this.getPrivateObjectDir();
    } catch (err) {
      console.warn("normalizeObjectEntityPath: PRIVATE_OBJECT_DIR not set, treating as local path", err?.message ?? err);
      return rawObjectPath;
    }

    if (!objectEntityDir.endsWith("/")) {
      objectEntityDir = `${objectEntityDir}/`;
    }

    if (!rawObjectPath.startsWith(objectEntityDir)) {
      return rawObjectPath;
    }

    // Extract the entity ID from the path
    const entityId = rawObjectPath.slice(objectEntityDir.length);
    return `/objects/${entityId}`;
  }

  // Tries to set the ACL policy for the object entity and return the normalized path.
  async trySetObjectEntityAclPolicy(
    rawPath: string,
    aclPolicy: ObjectAclPolicy
  ): Promise<string> {
    let normalizedPath: string;
    try {
      normalizedPath = this.normalizeObjectEntityPath(rawPath);
    } catch (err) {
      console.warn("trySetObjectEntityAclPolicy: normalize failed, attempting local fallback", err?.message ?? err);
      // If normalization failed but the raw path looks like a local-upload path,
      // synthesize the public-serving path and return it.
      if (typeof rawPath === "string" && (rawPath.includes("local-uploads") || rawPath.includes("local-uploads-upload"))) {
        const publicPath = rawPath
          .toString()
          .replace(/https?:\/\/[^/]+/, "")
          .replace(/\/api\/local-uploads-upload\//, "/local-uploads/")
          .replace(/\/api\/local-uploads\//, "/local-uploads/")
          .replace(/\/local-uploads-upload\//, "/local-uploads/")
          .replace(/\/local-uploads-upload/, "/local-uploads");
        return publicPath;
      }
      throw err;
    }
    // Development/local upload fallback: if the path is a local-uploads path
    // (produced by the local PUT fallback), we don't have an object in GCS
    // to set ACLs on. Accept the local path and return a public-serving
    // path instead of attempting to access remote object storage.
    if (
      normalizedPath.startsWith("/local-uploads") ||
      normalizedPath.startsWith("/local-uploads-upload") ||
      normalizedPath.startsWith("/api/local-uploads") ||
      normalizedPath.startsWith("/api/local-uploads-upload")
    ) {
      // Normalize path so clients use `/local-uploads/<id>` as the final
      // publicly-served path. Also accept `/api/...` prefixes.
      const publicPath = normalizedPath
        .replace("/api/local-uploads-upload/", "/local-uploads/")
        .replace("/api/local-uploads/", "/local-uploads/")
        .replace("/local-uploads-upload/", "/local-uploads/")
        .replace("/local-uploads-upload", "/local-uploads");
      return publicPath;
    }

    if (!normalizedPath.startsWith("/")) {
      return normalizedPath;
    }

    const objectFile = await this.getObjectEntityFile(normalizedPath);
    await setObjectAclPolicy(objectFile, aclPolicy);
    return normalizedPath;
  }

  // Checks if the user can access the object entity.
  async canAccessObjectEntity({
    userId,
    objectFile,
    requestedPermission,
  }: {
    userId?: string;
    objectFile: File;
    requestedPermission?: ObjectPermission;
  }): Promise<boolean> {
    return canAccessObject({
      userId,
      objectFile,
      requestedPermission: requestedPermission ?? ObjectPermission.READ,
    });
  }
}

function parseObjectPath(path: string): {
  bucketName: string;
  objectName: string;
} {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  const pathParts = path.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }

  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");

  return {
    bucketName,
    objectName,
  };
}

async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec,
}: {
  bucketName: string;
  objectName: string;
  method: "GET" | "PUT" | "DELETE" | "HEAD";
  ttlSec: number;
}): Promise<string> {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1000).toISOString(),
  };
  try {
    const response = await fetch(`${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      const bodyText = await response.text().catch(() => "<no-body>");
      console.error("signObjectURL: sidecar responded with status", response.status, bodyText);
      throw new Error(`Failed to sign object URL, errorcode: ${response.status}`);
    }

    const { signed_url: signedURL } = await response.json();
    console.log("signObjectURL -> signedURL:", signedURL);
    return signedURL;
  } catch (err) {
    console.error("signObjectURL error:", err);
    throw err;
  }
}
