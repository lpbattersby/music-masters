"use client";

import { useState } from "react";
import Fab from "@mui/material/Fab";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function InviteButton() {
  const [copied, setCopied] = useState(false);

  async function copyInviteLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
  <>
    <Fab
      color="primary"
      aria-label={copied ? "Invite link copied" : "Copy invite link"}
      variant="extended"
      onClick={copyInviteLink}
      sx={{
        width: 120,
        justifyContent: "center",
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'primary',
        bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
        zIndex: (theme) => theme.zIndex.fab,
      }}
    >
      Invite
    </Fab>
    {copied && (
      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setCopied(false)}
        >
          Invite link copied
        </Alert>
      </Snackbar>
    )}
  </>
  );
}