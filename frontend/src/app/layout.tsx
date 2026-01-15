import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nairobi Urban Stress - A Physiological Model",
  description: "What if a city breathed? An exploration of Nairobi's urban stress through the lens of human physiology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
