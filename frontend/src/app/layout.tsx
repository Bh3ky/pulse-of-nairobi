import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nairobi Urban Stress - A Physiological Model",
  description:
    "What if a city breathed? An exploration of Nairobi's urban stress through the lens of human physiology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative">
        <Header />
        {/* Increased padding to account for header + card spacing */}
        <main className="pt-24">
          {children}
        </main>
      </body>
    </html>
  );
}
