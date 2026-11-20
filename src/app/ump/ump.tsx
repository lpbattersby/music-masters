"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

interface Props {
  id: string;
  url: string;
}

export default function SoundCloudPlayer({ id, url }: Props) {
  const [embedUrl, setEmbedUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadPlayer() {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 10000);

      try {
        setLoading(true);
        setError("");

        const endpoint = new URL("https://soundcloud.com/oembed");

        endpoint.searchParams.set("format", "json");
        endpoint.searchParams.set("url", url);
        endpoint.searchParams.set("maxheight", "166");
        endpoint.searchParams.set("maxwidth", "600");
        endpoint.searchParams.set("color", "A78BFA");

        const response = await fetch(endpoint.toString(), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("SoundCloud could not generate this player.");
        }

        const data = await response.json();

        const document = new DOMParser().parseFromString(
          data.html,
          "text/html",
        );

        const iframe = document.querySelector("iframe");

        if (!iframe?.src) {
          throw new Error("No SoundCloud player was returned.");
        }

        const playerUrl = new URL(iframe.src);

        if (playerUrl.hostname !== "w.soundcloud.com") {
          throw new Error("Invalid SoundCloud player.");
        }

        // The oEmbed URL is an API endpoint: /tracks/{id} for songs,
        // /users/{id} for artist pages, etc. Only allow individual tracks.
        const apiPath = playerUrl.searchParams.get("url") ?? "";
        if (!apiPath.includes("/tracks/")) {
          throw new Error(
            "This URL is not an individual song. Submit a direct track link.",
          );
        }

        if (!cancelled) {
          setEmbedUrl(playerUrl.href);
        }
      } catch (err) {
        if (cancelled) {
          return;
        }
        if (err instanceof DOMException && err.name === "AbortError") {
          setError("The SoundCloud player took too long to load.");
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load SoundCloud player.",
          );
        }
      } finally {
        window.clearTimeout(timeoutId);
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPlayer();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <Box sx={{ p:0 }}>
      <CardContent sx={{ p: 0, m: 0 }}>
        <Stack>
          {error && <Alert severity="error">{error}</Alert>}

          {embedUrl && (
            <Box
              sx={{
                position: "relative",
                borderRadius: 1,
                overflow: "hidden",
                p: 0,
              }}
            >
              <Box
                component="iframe"
                key={id}
                src={embedUrl}
                width="100%"
                height={166}
                allow="autoplay"
                loading="lazy"
                title="SoundCloud player"
                sx={{
                  border: 0,
                  display: "block",
                  p: 0,
                }}
              />

              {loading && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(2px)",
                    borderRadius: 1,
                    zIndex: 10,
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>
          )}

          {loading && !embedUrl && (
            <Box>
              <CircularProgress size={24} />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Box>
  );
}
