import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Brand } from "@/components/design";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IIoT Predictive Maintenance",
  description: "Real-time AI-powered industrial monitoring and anomaly detection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <footer className="w-full bg-graphite text-sm text-slate-400">
          <div className="mx-auto max-w-[1400px] px-4 pt-14 pb-8 sm:px-8">
            <div className="flex flex-col gap-3">
              <Brand />
              <p className="mt-2 max-w-xl text-slate-300">Optimisation Energetique et Maintenance predicitve pour l industrie 4.0</p>
            </div>
            <div className="mt-14 border-t border-white/[0.08] pt-6">
              <p>&copy; {new Date().getFullYear()} Smart Energy Guardien. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
