"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1A56DB",
      light: "#3F72F3",
      dark: "#1239A6",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7E3AF2",
      light: "#9E68F7",
      dark: "#5E21C0",
    },
    background: {
      default: "#F0F4FF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#4B5563",
    },
    success: { main: "#0E9F6E" },
    error: { main: "#E02424" },
    warning: { main: "#FACA15" },
  },
  typography: {
    fontFamily: '"DM Sans", "Segoe UI", sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.025em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 20px",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #1A56DB 0%, #3F72F3 100%)",
          "&:hover": { background: "linear-gradient(135deg, #1239A6 0%, #1A56DB 100%)" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.05)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "#F9FAFB",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: "#F0F4FF",
            fontWeight: 700,
            color: "#374151",
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          },
        },
      },
    },
  },
});

export default theme;
