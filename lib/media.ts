// LOCATION: lib/media.ts
// Small helpers for film links.
const valid = (id: string | null | undefined) => (id && /^[\w-]{11}$/.test(id) ? id : null);

/** Returns the YouTube video id for watch / youtu.be / shorts / embed links, otherwise null. */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return valid(u.pathname.slice(1).split("/")[0]);
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (u.pathname === "/watch") return valid(u.searchParams.get("v"));
      const m = u.pathname.match(/^\/(embed|shorts|live)\/([^/?#]+)/);
      if (m) return valid(m[2]);
    }
  } catch {
    /* not a valid URL */
  }
  return null;
}

/** Picture to show for a film: its own poster, or the YouTube thumbnail, or nothing. */
export function filmThumb(film: { src: string; poster: string }): string {
  if (film.poster) return film.poster;
  const id = youtubeId(film.src);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}