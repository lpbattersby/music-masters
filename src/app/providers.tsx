"use client";

import type { ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: "#ac1802",
      contrastText: "#fff",
    },
    secondary: {
      main: "#f4c600",
      contrastText: "#281d16",
    },
    warning: { main: "#dc4800", dark: "#9b4d29" },
    background: { default: "#F5F0E5", paper: "#fdf9f2" },
    text: { primary: "#281d16", secondary: "#795e4b", disabled: "#c4ae88" },
    divider: "#dbc99f",
    info: { main: "#00758a" },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
    button: { textTransform: "none", fontWeight: 700 },
    h1: {
      fontFamily: "Georgia, serif",
      fontSize: "clamp(36px, 6vw, 56px)",
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: "-1.5px",
      overflowWrap: "anywhere",
    },
    h2: {
      fontFamily: "Georgia, serif",
      fontSize: "clamp(28px, 4vw, 32px)",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.5px",
      overflowWrap: "anywhere",
    },
    h3: {
      fontFamily: "Georgia, serif",
      fontSize: "clamp(22px, 3vw, 24px)",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "normal",
      overflowWrap: "anywhere",
    },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundImage: "none",
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiDialogContent: {
      styleOverrides: { root: { paddingTop: "16px !important" } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
        }),
      },
    },
  },
});

export default function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
