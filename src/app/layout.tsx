import type { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mugni Hidayah | AI Engineer",
  description:
    "Portfolio of Mugni Hidayah, an AI Engineer specializing in LLM, NLP, and Machine Learning. Built with a Visual Studio Code inspired theme.",
  keywords: [
    "AI Engineer",
    "Machine Learning",
    "LLM",
    "NLP",
    "Mugni Hidayah",
    "Portfolio",
    "Python",
    "Deep Learning",
  ],
  authors: [{ name: "Mugni Hidayah" }],
  creator: "Mugni Hidayah",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mugnihidayah.dev",
    title: "Mugni Hidayah | AI Engineer",
    description:
      "AI Engineer specializing in LLM, NLP, and Machine Learning. Explore my projects, skills, and experience.",
    siteName: "Mugni Hidayah Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mugni Hidayah - AI Engineer & Data Scientist Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mugni Hidayah | AI Engineer",
    description:
      "AI Engineer specializing in LLM, NLP, and Machine Learning.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://mugnihidayah.dev"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <AppProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
