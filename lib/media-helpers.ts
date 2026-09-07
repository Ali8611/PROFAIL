// Video helper to extract YouTube ID or check if URL is YouTube/direct video
export function getYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  
  // Standard watch URLs: https://www.youtube.com/watch?v=VIDEO_ID or youtu.be/VIDEO_ID
  const watchMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }
  return null;
}

export function isDirectVideo(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.ogg') ||
    clean.endsWith('.mov') ||
    clean.includes('/uploads/')
  );
}
