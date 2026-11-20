export function createSoundCloudEmbedUrl(url: string) {
  const embedUrl = new URL("https://w.soundcloud.com/player/");

  embedUrl.searchParams.set("url", url);
  embedUrl.searchParams.set("color", "#A78BFA");
  embedUrl.searchParams.set("auto_play", "false");
  embedUrl.searchParams.set("hide_related", "true");
  embedUrl.searchParams.set("show_comments", "false");
  embedUrl.searchParams.set("show_user", "true");
  embedUrl.searchParams.set("show_reposts", "false");
  embedUrl.searchParams.set("show_teaser", "false");
  embedUrl.searchParams.set("show_artwork", "false");
  embedUrl.searchParams.set("sharing", "false");
  embedUrl.searchParams.set("download", "false");
  embedUrl.searchParams.set("buying", "false");

  return embedUrl.toString();
}
