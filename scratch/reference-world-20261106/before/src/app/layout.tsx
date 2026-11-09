import type { Metadata } from "next";
import { Manrope, Sora, IBM_Plex_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { VisualMotion } from "@/components/ui/visual-motion";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SUPPLYMIND AI — Autonomous Supply Chain Intelligence & Procurement",
  description:
    "Predict shortages. Negotiate intelligently. Purchase securely. Enterprise autonomous supply chain intelligence and PayPal-powered procurement engine.",
  keywords: [
    "supply chain",
    "autonomous procurement",
    "predictive inventory",
    "AI negotiation",
    "fintech",
    "PayPal Orders v2",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${sora.variable} ${ibmPlexMono.variable} font-sans bg-graphite text-soft-ivory antialiased selection:bg-electric-teal/20 selection:text-electric-teal`}
      >
        <AuthProvider>
          {children}
          <Toaster />
          <VisualMotion />
        </AuthProvider>
      </body>
    </html>
  );
}
