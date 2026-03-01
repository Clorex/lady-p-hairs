export type UploadResult = {
  url: string;
  publicId: string;
  originalFilename?: string;
};

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export function assertCloudinaryConfigured() {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local"
    );
  }
}

export async function uploadImageUnsigned(file: File, opts?: { folder?: string }): Promise<UploadResult> {
  assertCloudinaryConfigured();

  const apiUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  if (opts?.folder) form.append("folder", opts.folder);

  const res = await fetch(apiUrl, { method: "POST", body: form });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Cloudinary upload failed (${res.status}). ${text}`);
  }
  const json: any = await res.json();

  return {
    url: json.secure_url || json.url,
    publicId: json.public_id,
    originalFilename: json.original_filename,
  };
}

export function isCloudinaryImageUrl(url: string) {
  return /res\.cloudinary\.com\/.+\/image\/upload\//.test(url);
}

export function withCloudinaryTransform(url: string, transform: string) {
  if (!url) return url;
  if (!isCloudinaryImageUrl(url)) return url;
  return url.replace("/image/upload/", `/image/upload/${transform}/`);
}

export const cldSquare = (url: string) => withCloudinaryTransform(url, "c_fill,g_auto,w_600,h_600,f_auto,q_auto");
export const cldPortrait = (url: string) => withCloudinaryTransform(url, "c_fill,g_auto,w_1024,h_1280,f_auto,q_auto");
export const cldMasonry = (url: string) => withCloudinaryTransform(url, "c_limit,w_800,f_auto,q_auto");
export const cldLightbox = (url: string) => withCloudinaryTransform(url, "c_limit,w_1600,f_auto,q_auto");
