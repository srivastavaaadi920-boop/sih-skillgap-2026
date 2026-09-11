import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Academia-Industry Collaboration Portal",
  description: "Smart India Hackathon 2026 - SIH26044",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-background text-primary-dark">
        {children}
      </body>
    </html>
  );
}
