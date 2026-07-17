import type { Metadata } from "next";
import { Ojuju, Questrial, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
    icon: "/logo.svg",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${ojuju.variable} ${questrial.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('Kènè Service Worker registered successfully:', reg.scope);
                  }).catch(function(err) {
                    console.warn('Kènè Service Worker registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
