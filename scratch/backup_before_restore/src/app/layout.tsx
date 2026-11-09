import type { Metadata } from "next";
import { Manrope, DM_Serif_Display, IBM_Plex_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
  weight: "400",
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
        className={`${manrope.variable} ${dmSerif.variable} ${ibmPlexMono.variable} font-sans bg-[#061011] text-[#F4F7F4] antialiased selection:bg-[#79E7C7]/25 selection:text-[#79E7C7]`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
