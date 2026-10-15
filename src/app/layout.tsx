import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Cursor from "@/components/Cursor";
import PageLoader from "@/components/PageLoader";
import Interactions from "@/components/Interactions";
import RevealObserver from "@/components/RevealObserver";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-heading",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

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
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://i.postimg.cc" />
        <link rel="preconnect" href="https://mir-s3-cdn-cf.behance.net" />
        <noscript>
          <style>{`[data-reveal],.line-mask>span{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="antialiased text-foreground">
        <PageLoader />
        <Cursor />
        <RevealObserver />
        <Interactions />
        {children}
      </body>
    </html>
  );
}
