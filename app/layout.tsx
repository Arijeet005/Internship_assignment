import type { Metadata } from "next";
import MuiProvider from "@/components/MuiProvider";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Help Study Abroad – Admin Dashboard",
  description: "Admin dashboard for managing users and products",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <MuiProvider>{children}</MuiProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
