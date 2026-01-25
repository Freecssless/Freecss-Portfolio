import type { Metadata } from "next";
import Cursor from "@/components/Cursor";
import PageLoader from "@/components/PageLoader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freecss Portfolio",
  description: "Editor Profesional de Videos - Convierte tus ideas en experiencias visuales",
  icons: {
    icon: [
      {
        url: "https://i.postimg.cc/KkMwCY9L/Grupo-3.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://i.postimg.cc/KkMwCY9L/Grupo-3.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: [
      "https://i.postimg.cc/KkMwCY9L/Grupo-3.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-background text-foreground">
        <PageLoader />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
