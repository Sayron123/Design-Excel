import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Footer } from "@/components/Footer";
import { MobileQuoteButton } from "@/components/MobileQuoteButton";
import { MotionProvider } from "@/components/MotionProvider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Design Excellence | Custom cabinets and office furniture",
  description:
    "Custom cabinets and office furniture for corporate offices, banks, schools, hospitals and government. Consultation, AutoCAD layout, manufacturing, delivery and install.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
   <html lang="en" data-scroll-behavior="smooth" className={`${manrope.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg text-ink">
        <MotionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileQuoteButton />
        </MotionProvider>
      </body>
    </html>
  );
}
