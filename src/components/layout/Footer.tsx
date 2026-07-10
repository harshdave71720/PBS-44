import Link from "next/link"
import { Globe, PlayCircle, X, Phone, Mail, MapPin, Clock } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { OrnamentalDivider } from "@/components/shared/OrnamentalDivider"
import { siteConfig } from "@/config/site"
import type { NavItem } from "@/types"

interface FooterProps {
  navItems: NavItem[]
  common: Record<string, string>
}

export function Footer({ navItems, common }: FooterProps) {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Top ornamental border */}
      <div className="h-1 w-full bg-gradient-to-r from-secondary via-accent to-secondary" />

      <div className="mx-auto max-w-7xl px-4 pt-12 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{siteConfig.name}</h3>
              <p className="text-sm text-primary-foreground/70 mt-1">
                {siteConfig.tagline}
              </p>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              {siteConfig.description}
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              <a
                href={siteConfig.links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-full bg-white/10 p-2 hover:bg-accent transition-colors"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="rounded-full bg-white/10 p-2 hover:bg-accent transition-colors"
              >
                <PlayCircle className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="rounded-full bg-white/10 p-2 hover:bg-accent transition-colors"
              >
                <X className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">
              त्वरित लिंक
            </h4>
            <ul className="space-y-2">
              {navItems.slice(0, 6).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors flex items-center gap-1"
                  >
                    <span className="text-accent/60 text-xs">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">
              सेवाएं
            </h4>
            <ul className="space-y-2">
              {[
                { label: "जन्म प्रमाण पत्र", href: "/services/birth-certificate" },
                { label: "मृत्यु प्रमाण पत्र", href: "/services/death-certificate" },
                { label: "निवास प्रमाण पत्र", href: "/services/residence-certificate" },
                { label: "विवाह प्रमाण पत्र", href: "/services/marriage-certificate" },
                { label: "भूमि अभिलेख", href: "/services/land-records" },
                { label: "शिकायत निवारण", href: "/services/grievance" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors flex items-center gap-1"
                  >
                    <span className="text-accent/60 text-xs">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">
              संपर्क
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                <span>{siteConfig.contact.address}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="hover:text-accent transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-accent transition-colors break-all"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-primary-foreground/80">
                <Clock className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                <span>{siteConfig.contact.officeHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <OrnamentalDivider className="mt-10 mb-4 opacity-30" />

        <Separator className="bg-white/10 mb-4" />

        <div className="flex flex-col items-center justify-between gap-2 text-xs text-primary-foreground/60 sm:flex-row">
          <p>{common.copyright}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              गोपनीयता नीति
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors">
              नियम व शर्तें
            </Link>
            <Link href="/sitemap" className="hover:text-accent transition-colors">
              साइटमैप
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
