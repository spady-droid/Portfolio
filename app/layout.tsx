import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Spotlight } from "@/components/Spotlight";
import { BlackHole } from "@/components/BlackHole";
import { ColapsoProvider, ColapsoConteudo } from "@/components/Colapso";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eduardo Coelho da Silva — Desenvolvedor Full Stack",
  description:
    "Portfólio de Eduardo Coelho da Silva — desenvolvedor full stack que transforma problemas reais de negócio em software que roda em produção.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Provider: estado compartilhado do colapso (botao + conteudo + buraco) */}
        <ColapsoProvider>
          <BlackHole />
          <Spotlight />
          <ColapsoConteudo>{children}</ColapsoConteudo>
        </ColapsoProvider>
      </body>
    </html>
  );
}
