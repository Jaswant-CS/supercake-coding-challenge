import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supercake Coding Challenge",
  description: "Good luck!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/public/supercake-transparent.webp" />
        <link rel="icon" href="/supercake-transparent.webp" sizes="any" />
      </head>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
