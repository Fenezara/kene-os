import type { Metadata, Viewport } from "next";
import { Ojuju, Plus_Jakarta_Sans, Cinzel, JetBrains_Mono } from "next/font/google";
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

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Kènè — La beauté mélanoderme, révélée",
  description: "Plateforme beauté et bien-être : diagnostic IA pour peaux mélanodermes, dermo-cosmétique avancée et gestion d'instituts.",
  keywords: ["Kènè", "beauté mélanoderme", "diagnostic de peau", "dermo-cosmétique", "baobab", "karité", "moringa", "PWA"],
  authors: [{ name: "Kènè Team" }],
  icons: {
    icon: "/images/kene_logo.jpg",
    shortcut: "/images/kene_logo.jpg",
    apple: "/images/kene_logo.jpg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kènè OS",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Kènè — La beauté mélanoderme, révélée",
    description: "Diagnostic de peau IA et dermo-cosmétique avancée",
    url: "https://kene.africa",
    siteName: "Kènè",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kènè — La beauté mélanoderme de A à Z",
    description: "Diagnostic de peau IA et dermo-cosmétique africaine",
  },
};

import { AuthProvider } from "@/components/providers/AuthProvider";
import { SessionPreserver } from "@/components/SessionPreserver";
import { OfflineIndicator } from "@/components/OfflineIndicator";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} antialiased bg-[#0F0A05] text-[#F8F1E4]`}
      >
        <OfflineIndicator />

        {/* Instant HTML/CSS Splash Screen — Pure CSS auto-hide (immune to React hydration) */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes keneGlow {
            0%, 100% { opacity: 0.4; transform: scale(0.95); }
            50% { opacity: 0.85; transform: scale(1.05); }
          }
          @keyframes keneBar {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          @keyframes keneSplashHide {
            0% { opacity: 1; visibility: visible; }
            100% { opacity: 0; visibility: hidden; pointer-events: none; }
          }
          #kene-instant-splash-screen {
            animation: keneSplashHide 0.6s ease 2.8s forwards;
          }
        ` }} />

        {/* Synchronous inline script to suppress splash screen on subsequent page navigations */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (window.sessionStorage && window.sessionStorage.getItem('kene_splash_shown') === 'true') {
                  document.write('<style>#kene-instant-splash-screen { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }</style>');
                } else if (window.sessionStorage) {
                  window.sessionStorage.setItem('kene_splash_shown', 'true');
                }
              } catch(e) {}
            `,
          }}
        />

        <div
          id="kene-instant-splash-screen"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#0F0A05',
            zIndex: 99999999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#ffffff',
            userSelect: 'none',
            touchAction: 'none',
            overflow: 'hidden',
            overscrollBehavior: 'contain',
          }}
        >
          <div style={{ position: 'absolute', width: '450px', height: '450px', background: 'rgba(200,149,30,0.18)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', animation: 'keneGlow 3s infinite ease-in-out' }} />

          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <div style={{ position: 'absolute', inset: '-6px', background: 'linear-gradient(90deg, #FFD700, #C8951E, #D4AF37)', borderRadius: '28px', filter: 'blur(14px)', opacity: 0.7 }} />
              <div style={{ position: 'relative', width: '110px', height: '110px', borderRadius: '24px', border: '2px solid #C8951E', background: '#1A1410', padding: '6px', boxShadow: '0 0 40px rgba(200,149,30,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src="/images/kene_logo.jpg" alt="Kènè OS" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px' }} />
              </div>
            </div>

            <h1 style={{ margin: '0 0 6px 0', fontSize: '32px', fontWeight: 900, letterSpacing: '2px', background: 'linear-gradient(90deg, #FFFFFF, #F3E5AB, #C8951E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              KÈNÈ OS
            </h1>

            <p style={{ margin: '0 0 24px 0', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', color: '#F3E5AB', textTransform: 'uppercase' }}>
              ✨ La Beauté Mélanoderme, Révélée
            </p>

            <div style={{ width: '220px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', border: '1px solid rgba(200,149,30,0.3)', overflow: 'hidden', padding: '1px' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, #FFD700, #C8951E, #D4AF37)', borderRadius: '999px', animation: 'keneBar 2.8s cubic-bezier(0.16, 1, 0.3, 1) forwards', boxShadow: '0 0 10px rgba(200,149,30,0.8)' }} />
            </div>

            <span style={{ marginTop: '14px', fontSize: '10px', fontFamily: 'monospace', color: 'rgba(243,229,171,0.6)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700 }}>
              Initialisation de votre Espace...
            </span>
          </div>
        </div>

        <AuthProvider>
          <SessionPreserver />
          {children}
          <Toaster />
        </AuthProvider>

        {/* Enregistrement du Service Worker PWA Kènè OS & Auto-Nettoyage Cache Mojibake */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                for (var i = 0; i < localStorage.length; i++) {
                  var k = localStorage.key(i);
                  if (k && k.indexOf('kene') !== -1) {
                    var val = localStorage.getItem(k);
                    if (val && (val.indexOf('Ã') !== -1 || val.indexOf('Â') !== -1 || val.indexOf('ð') !== -1)) {
                      var clean = val
                        .replace(/Ã©/g, 'é').replace(/Ã¨/g, 'è').replace(/Ã /g, 'à ')
                        .replace(/Ã¢/g, 'â').replace(/Ãª/g, 'ê').replace(/Ã«/g, 'ë')
                        .replace(/Ã§/g, 'ç').replace(/Ã‰/g, 'É').replace(/Ãˆ/g, 'È')
                        .replace(/Ã€/g, 'À').replace(/Â·/g, '·').replace(/â€”/g, '—')
                        .replace(/ðŸ” /g, '📂').replace(/ðŸ‘ ï¸ /g, '👁️');
                      localStorage.setItem(k, clean);
                    }
                  }
                }
              } catch(e) {}

              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('[Kènè OS] ServiceWorker PWA actif avec succès :', registration.scope);
                    },
                    function(err) {
                      console.log('[Kènè OS] Erreur enregistrement ServiceWorker :', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
