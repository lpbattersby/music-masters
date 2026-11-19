// @vitest-environment jsdom
import { expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SongSubmissionForm from "./song-submission-form";
import { submitSongAction } from "@/app/actions/submissions";

vi.mock("@/app/actions/submissions", () => ({
  submitSongAction: vi.fn(),
}));

it("submits a SoundCloud URL and the associated round ID", async () => {
  const event = userEvent.setup();
  render(
    <SongSubmissionForm
      roundId="round-1"
      initialSongUrl="https://soundcloud.com/artist/song-old"
    />,
  );

  const url = screen.getByRole("textbox", { name: "SoundCloud URL" });
  expect(url).toHaveValue("https://soundcloud.com/artist/song-old");
  await event.clear(url);
  await event.type(url, "https://soundcloud.com/artist/song-new");
  await event.click(screen.getByRole("button", { name: "Confirm" }));

  await waitFor(() => expect(submitSongAction).toHaveBeenCalledOnce());
  const data = vi.mocked(submitSongAction).mock.calls[0][1];
  expect(data.get("roundId")).toBe("round-1");
  expect(data.get("songUrl")).toBe("https://soundcloud.com/artist/song-new");
});

// Mock the global fetch used by the SoundCloudPlayer component.
// Mimics the oEmbed response: the iframe src points to an API endpoint.
// Track URLs get /tracks/{id}; artist page URLs get /users/{id}.
vi.stubGlobal(
  "fetch",
  vi.fn(async (url: string) => {
    const urlObj = new URL(url);
    const trackUrl = urlObj.searchParams.get("url") ?? "";
    const pathSegments = trackUrl.replace(/^https?:\/\/[^/]+\//, "").split("/");
    const isArtistPage = pathSegments.length === 1; // only one path segment = artist
    const apiType = isArtistPage ? "users" : "tracks";
    const apiId = isArtistPage ? pathSegments[0] : pathSegments.at(-1) ?? "1";
    const apiUrl = `https://api.soundcloud.com/${apiType}/${apiId}`;
    return new Response(
      JSON.stringify({
        html: `<iframe src="https://w.soundcloud.com/player/?url=${encodeURIComponent(
          apiUrl,
        )}"></iframe>`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }),
);

it("updates the SoundCloud preview when the URL changes", async () => {
  const event = userEvent.setup();
  render(
    <SongSubmissionForm
      roundId="round-1"
      initialSongUrl="https://soundcloud.com/artist/song-old"
    />,
    {
      wrapper: ({ children }) => children,
    },
  );

  // Wait for the initial embed to load.
  const iframe = await screen.findByTitle("SoundCloud player");
  expect(iframe).toHaveAttribute(
    "src",
    expect.stringContaining(
      encodeURIComponent("https://api.soundcloud.com/tracks/song-old"),
    ),
  );

  const urlInput = screen.getByRole("textbox", { name: "SoundCloud URL" });
  await event.clear(urlInput);
  await event.type(urlInput, "https://soundcloud.com/artist/song-new");

  // The embed should update after the debounce delay passes.
  const updatedIframe = screen.getByTitle("SoundCloud player");
  await waitFor(
    () => {
      expect(updatedIframe).toHaveAttribute(
        "src",
        expect.stringContaining(
          encodeURIComponent("https://api.soundcloud.com/tracks/song-new"),
        ),
      );
    },
    { timeout: 2000 },
  );
});

it("shows an error when the URL is an artist page, not a track", async () => {
  render(
    <SongSubmissionForm
      roundId="round-1"
      initialSongUrl="https://soundcloud.com/some-artist"
    />,
    {
      wrapper: ({ children }) => children,
    },
  );

  // The oEmbed mock returns a /users/ API path for single-segment URLs,
  // which the player rejects.
  const error = await screen.findByText(
    "This URL is not an individual song. Submit a direct track link.",
  );
  expect(error).toBeInTheDocument();

  // No iframe should be rendered for a non-track URL.
  expect(screen.queryByTitle("SoundCloud player")).not.toBeInTheDocument();
});
