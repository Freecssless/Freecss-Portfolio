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
        url: "https://i.postimg.cc/3RQXVBN1/twitterbanner.png",
        width: 1200,
        height: 600,
        alt: "Freecss — Editor de video: YouTube, Reels, Shorts y TikToks",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freecss Portfolio",
    description: "Editor Profesional de Videos - Convierte tus ideas en experiencias visuales",
    images: [
      {
        url: "https://i.postimg.cc/3RQXVBN1/twitterbanner.png",
        width: 1200,
        height: 600,
        alt: "Freecss — Editor de video: YouTube, Reels, Shorts y TikToks",
      },
    ],
    creator: "@Freecss_less",
  },
  // Square, lightweight versions of https://i.postimg.cc/7h2WQzzM/Galede-OSio.png served from /public
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icons/favicon-32.png"],
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
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
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
