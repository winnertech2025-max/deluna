import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappButton } from "@/components/whatsapp-button";

export const metadata: Metadata = {
  title: "Deluna | Personalized pieces, made just for you",
  description:
    "A premium custom studio for personalized jewelry, bags, clothing, hats, accessories, and meaningful gifts."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <WhatsappButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
