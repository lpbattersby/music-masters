"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function InviteButton() {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copyInviteLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
  <>
    <Button
      color="primary"
      aria-label="Copy invite link"
      variant="outlined"
      startIcon={<ContentCopy />}
      onClick={copyInviteLink}
      sx={{
        width: 120,
        justifyContent: "center",
        flexShrink: 0,
        height: 40,
      }}
    >
      Invite
    </Button>
      <Snackbar
        open={status !== "idle"}
        autoHideDuration={3000}
        onClose={() => setStatus("idle")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={status === "copied" ? "success" : "error"}
          onClose={() => setStatus("idle")}
        >
          {status === "copied" ? "Invite link copied" : "Couldn't copy link. Please copy the page URL manually."}
        </Alert>
      </Snackbar>
  </>
  );
}