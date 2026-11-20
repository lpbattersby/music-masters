"use client";

import { useState, type ReactNode } from "react";
import Button, { type ButtonProps } from "@mui/material/Button";
import MMDialog from "./dialog";

interface Props {
  id: string;
  name: string;
  children: ReactNode;
  buttonLabel?: ReactNode;
  disabled?: boolean;
  variant?: "contained" | "outlined";
  sx?: ButtonProps["sx"];
}

export default function DialogButton({
  id,
  name,
  children,
  buttonLabel,
  disabled = false,
  variant = "contained",
  sx,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        disabled={disabled}
        sx={sx}
      >
        {buttonLabel ?? name}
      </Button>
      {open && (
        <MMDialog
          id={id}
          label={name}
          open={open}
          onClose={() => setOpen(false)}
        >
          {children}
        </MMDialog>
      )}
    </>
  );
}
