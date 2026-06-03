/**
 * Resolves product image URLs. Local /uploads/ paths are returned as-is
 * and proxied to the backend by Vite in dev or served directly in production.
 */
export function getImageUrl(url) {
  if (!url) {
    // Beautiful default automotive carbon steering wheel background placeholder
    return "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=500&q=80";
  }

  if (url.startsWith("/uploads/")) {
    return url;
  }

  return url;
}
