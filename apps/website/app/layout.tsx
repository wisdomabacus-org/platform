import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Analytics } from "@vercel/analytics/next"
import { ReferralTracker } from "@/components/referral-tracker";
import { ModalProvider } from "@/providers/modal-provider";

// Setup Inter as --font-sans (body)
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// Setup Sora as --font-display (headings)
const fontDisplay = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Wisdom Abacus Academy",
  description: "The National Abacus Championship Platform",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} font-sans`}
      >
        <QueryProvider>
          <AuthProvider>
            <ReferralTracker />
            <ModalProvider />
            {children}
          </AuthProvider>
          <Analytics />
        </QueryProvider>
      </body>
    </html>
  );
}
