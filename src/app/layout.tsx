
import type { Metadata } from "next";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/providers/theme-provider";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Togetherly | Small Actions, Stronger Communities",
    template: "%s | Togetherly",
  },
  description:
    "Discover community service events, connect with volunteers, and make a positive impact in your local community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <Navbar />

          {children}

          <Footer />

          <Toaster
            position="top-right"
            richColors
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
