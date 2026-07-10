import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getDictionary } from "@/lib/i18n"
import { defaultLocale } from "@/config/i18n"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "hi_IN",
    alternateLocale: ["en_IN"],
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // In a future multilingual setup this locale would come from
  // middleware / cookies / route params. Default to Hindi.
  const dict = getDictionary(defaultLocale)

  return (
    <html
      lang="hi"
      dir="ltr"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header nav={dict.nav} />
        <main className="flex-1">{children}</main>
        <Footer navItems={dict.nav.items} common={dict.common} />
      </body>
    </html>
  )
}
