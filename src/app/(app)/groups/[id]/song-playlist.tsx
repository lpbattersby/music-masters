"use client";

import {
  Box,
  CardContent,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";

import SoundCloudPlayer from "@/app/ump/ump";
import type { SongWithSubmitter } from "@/app/lib/submissions";

interface Props {
  songs: SongWithSubmitter[];
  revealNames: boolean;
}

export default function SongPlaylist({ songs, revealNames }: Props) {
  if (songs.length === 0) return null;

  return (
    <Box sx={{ borderRadius: 1, m: 0, p: 0, bgcolor: "background.paper" }}>
      <CardContent sx={{ p: 0 }}>
        <Stack>
          <Typography variant="h3" component="h2">
            Songs
          </Typography>
          <List dense sx={{ mt: 2, p: 0 }}>
            {songs.map((song) => (
              <ListItem key={song.submissionId} sx={{ flexDirection: "column", p: 0 }}>
                <Stack sx={{ width: "100%", p: 0, borderColor: "divider" }}>
                  <Typography variant="body2">
                    {revealNames ? song.displayName : null}
                  </Typography>
                  <SoundCloudPlayer id={song.submissionId} url={song.songUrl} />
                </Stack>
              </ListItem>
            ))}
          </List>
        </Stack>
      </CardContent>
    </Box>
  );
}
