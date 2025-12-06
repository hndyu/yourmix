"use client";

import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

const roboto = Roboto({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
});

const theme = createTheme({
	typography: {
		fontFamily: roboto.style.fontFamily,
		button: {
			textTransform: "none", // Remove uppercase text transform for a more modern feel
			fontWeight: 600,
		},
		h1: {
			fontSize: "2rem",
			fontWeight: 700,
			letterSpacing: "-0.02em",
		},
		h2: {
			fontSize: "1.75rem",
			fontWeight: 600,
		},
		body1: {
			lineHeight: 1.7,
		},
	},
	palette: {
		mode: "light", // Can be switched to 'dark' later or dynamically
		primary: {
			main: "#0f172a", // Slate 900 - Dark elegant blue/black
			light: "#334155",
			dark: "#020617",
			contrastText: "#ffffff",
		},
		secondary: {
			main: "#6366f1", // Indigo 500 - Vibrant accent
			light: "#818cf8",
			dark: "#4338ca",
			contrastText: "#ffffff",
		},
		background: {
			default: "#f8fafc", // Very light slate gray for background
			paper: "#ffffff",
		},
		text: {
			primary: "#1e293b",
			secondary: "#64748b",
		},
	},
	shape: {
		borderRadius: 12, // More rounded corners for a friendlier, modern UI
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: "8px",
					boxShadow: "none",
					"&:hover": {
						boxShadow:
							"0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
					},
				},
				containedPrimary: {
					background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					marginBottom: "16px",
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					boxShadow:
						"0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
					border: "1px solid #e2e8f0",
				},
			},
		},
	},
});

export default theme;
