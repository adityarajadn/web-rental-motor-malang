import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppBubble from "@/components/WhatsAppBubble";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MotoRent Malang - Solusi Rental Motor Terpercaya",
  description: "Platform penyewaan motor terlengkap, aman, dan terpercaya di Kota Malang.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Background Mesh Gradient */}
        <div className="fixed inset-0 -z-20 bg-background overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/10 blur-[120px]"></div>
          <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-tertiary/10 blur-[80px]"></div>
        </div>

        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
        <WhatsAppBubble />
      </body>
    </html>
  );
}
