import type { Metadata } from "next";
import Cursor from "@/components/Cursor";
import PageLoader from "@/components/PageLoader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freecss Portfolio",
  description: "Editor Profesional de Videos - Convierte tus ideas en experiencias visuales",
  openGraph: {
    title: "Freecss Portfolio",
    description: "Editor Profesional de Videos - Convierte tus ideas en experiencias visuales",
    url: "https://freecss-portfolio.vercel.app",
    siteName: "Freecss Portfolio",
    images: [
      {
        url: "https://i.postimg.cc/8kK3Pp4N/Portfolio-Preview.png",
        width: 1280,
        height: 720,
        alt: "Freecss Portfolio Featured Video",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freecss Portfolio",
    description: "Editor Profesional de Videos - Convierte tus ideas en experiencias visuales",
    images: ["https://i.postimg.cc/8kK3Pp4N/Portfolio-Preview.png"],
    creator: "@Freecss_less",
  },
  icons: {
    icon: [
      {
        url: "https://i.postimg.cc/8kK3Pp4N/Portfolio-Preview.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://i.postimg.cc/8kK3Pp4N/Portfolio-Preview.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: [
      "https://i.postimg.cc/8kK3Pp4N/Portfolio-Preview.png",
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
