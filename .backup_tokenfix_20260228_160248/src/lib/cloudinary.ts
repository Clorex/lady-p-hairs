export type SignedScope = "products" | "gallery" | "proof";

export type UploadResult = {
  url: string;
  publicId: string;
  originalFilename?: string;
};

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

export function publicIdFromUrl(url: string): string | null {
  if (!url) return null;
  // Works for: .../image/upload/<transform...>/v1234/folder/name.jpg
  const m = url.match(/\/upload\/(?:.*\/)?v\d+\/(.+?)\.[^./?]+(?:\?.*)?$/);
  return m?.[1] ?? null;
}

export async function uploadImageSigned(file: File, scope: SignedScope): Promise<UploadResult> {
  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scope }),
  });

  if (!signRes.ok) {
    const txt = await signRes.text().catch(() => "");
    throw new Error(`Sign failed (${signRes.status}). ${txt}`);
  }

  const signed = await signRes.json();

  const apiUrl = `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signed.apiKey);
  form.append("timestamp", String(signed.timestamp));
  form.append("folder", signed.folder);
  form.append("signature", signed.signature);

  const upRes = await fetch(apiUrl, { method: "POST", body: form });
  if (!upRes.ok) {
    const txt = await upRes.text().catch(() => "");
    throw new Error(`Upload failed (${upRes.status}). ${txt}`);
  }

  const json: any = await upRes.json();
  return {
    url: json.secure_url || json.url,
    publicId: json.public_id,
    originalFilename: json.original_filename,
  };
}

export async function destroyImage(publicId: string) {
  const res = await fetch("/api/cloudinary/destroy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId }),
  });
  return res.ok;
}
