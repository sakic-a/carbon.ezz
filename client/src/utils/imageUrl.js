/**
 * Dynamically resolves product image URLs.
 * If the image is stored locally (starts with "/uploads/"), it automatically
 * prepends the correct backend server port (http://localhost:5001).
 * Otherwise, it leaves absolute URLs (mock data) completely untouched.
 */
export function getImageUrl(url) {
  if (!url) {
    // Beautiful default automotive carbon steering wheel background placeholder
    return "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=500&q=80";
  }

  // Prepend backend port if it's a local upload path
  if (url.startsWith("/uploads/")) {
    return `http://localhost:5001${url}`;
  }

  return url;
}
