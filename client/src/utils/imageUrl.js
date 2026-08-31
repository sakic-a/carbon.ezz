/**
 * Resolves product image URLs. Local /uploads/ paths are returned as-is
 * and proxied to the backend by Vite in dev or served directly in production.
 */
const API_URL = import.meta.env.VITE_API_URL || "";

export function getImageUrl(url) {
  if (!url) {
    // Beautiful default automotive carbon steering wheel background placeholder
    return "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=500&q=80";
  }

  let finalUrl = url;
  if (url.startsWith("/uploads/")) {
    finalUrl = `${API_URL}${url}`;
  }

  // Force HTTPS to prevent Mixed Content warnings in production
  if (finalUrl.startsWith("http://")) {
    finalUrl = finalUrl.replace("http://", "https://");
  }

  return finalUrl;
}
