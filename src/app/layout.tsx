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
        url: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/58f269242651275.6971bf731e0e9.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/58f269242651275.6971bf731e0e9.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: [
      "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/58f269242651275.6971bf731e0e9.png",
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
