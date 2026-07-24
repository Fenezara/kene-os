import type { Metadata, Viewport } from "next";
import { Ojuju, Questrial, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#C8951E",
};

const ojuju = Ojuju({
  variable: "--font-ojuju",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const questrial = Questrial({
  variable: "--font-questrial",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kènè — La beauté mélanoderme, révélée",
  description: "Plateforme beauté et bien-être : diagnostic IA pour peaux mélanodermes, boutique de cosmétiques botaniques et gestion d'instituts.",
  keywords: ["Kènè", "beauté mélanoderme", "diagnostic de peau", "cosmétiques botaniques", "baobab", "karité", "moringa", "PWA"],
  authors: [{ name: "Kènè Team" }],
  icons: {
    icon: "/images/kene_logo.jpg",
    shortcut: "/images/kene_logo.jpg",
    apple: "/images/kene_logo.jpg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Kènè — La beauté mélanoderme, révélée",
    description: "Diagnostic de peau IA et cosmétiques botaniques",
    url: "https://kene.africa",
    siteName: "Kènè",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kènè — La beauté mélanoderme de A à Z",
    description: "Diagnostic de peau IA et cosmétiques botaniques africains",
  },
};

import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body
        className={`${ojuju.variable} ${questrial.variable} ${geistMono.variable} antialiased bg-[#0F0A05] text-[#F8F1E4]`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (let registration of registrations) {
                    registration.unregister();
                  }
                });
                if ('caches' in window) {
                  caches.keys().then(function(names) {
                    for (let name of names) caches.delete(name);
                  });
                }
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
