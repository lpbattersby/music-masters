"use client";

import type { ReactNode } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";

interface Props {
  id: string;
  label: string;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
}

export default function MMDialog({
  open,
  onClose,
  id,
  label,
  children,
}: Props) {
  const titleId = `${id}-title`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id={titleId} sx={{ typography: "h1" }}>
        {label}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
