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
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
