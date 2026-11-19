"use client";

import { submitSongAction } from "@/app/actions/submissions";
import GeneratedForm, { type GeneratedField } from "@/app/form/generated-form";
import { useCallback, useEffect, useRef, useState } from "react";
import SoundCloudPlayer from "@/app/ump/ump";

const DEBOUNCE_MS = 500;

export default function SongSubmissionForm({
  roundId,
  initialSongUrl,
}: {
  roundId: string;
  initialSongUrl?: string;
}) {
  // inputValue drives the text field; previewUrl drives the player.
  // The debounce keeps the player from re-fetching on every keystroke.
  const [inputValue, setInputValue] = useState<string>(initialSongUrl ?? "");
  const [previewUrl, setPreviewUrl] = useState<string>(initialSongUrl ?? "");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setPreviewUrl(inputValue);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [inputValue]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const fields: GeneratedField[] = [
    {
      name: "songUrl",
      label: "SoundCloud URL",
      type: "url",
      onChange: handleInputChange,
    },
  ];

  return (
    <>
      {previewUrl && <SoundCloudPlayer id="song-preview" url={previewUrl} />}
      <GeneratedForm
        action={submitSongAction}
        ariaLabel="Submit Song"
        fields={fields}
        initialValues={{ songUrl: initialSongUrl }}
        hiddenFields={[{ name: "roundId", value: roundId }]}
        alertErrors={["roundId"]}
        alignItems="center"
      />
    </>
  );
}
