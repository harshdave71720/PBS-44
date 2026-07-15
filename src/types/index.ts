import type { Locale } from "@/config/i18n"

// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

// ─── Announcement ─────────────────────────────────────────────────────────────
export interface Announcement {
  id: string
  title: string
  date: string
  category: "notice" | "event" | "news" | "alert"
  description?: string
  href?: string
}

// ─── Service ──────────────────────────────────────────────────────────────────
export interface Service {
  id: string
  title: string
  description: string
  icon: string
  href: string
}

// ─── Event ────────────────────────────────────────────────────────────────────
export interface CommunityEvent {
  id: string
  title: string
  date: string
  time?: string
  location: string
  description: string
  category: string
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export interface GalleryItem {
  id: string
  title: string
  src: string
  alt: string
  category?: string
}

// ─── Dictionary / i18n ────────────────────────────────────────────────────────
export interface Dictionary {
  common: Record<string, string>
  nav: {
    items: NavItem[]
    cta: string
  }
  home: {
    hero: {
      badge: string
      heading: string
      subheading: string
      registration?: string
      description?: string
      ctaPrimary: string
      ctaSecondary: string
    }
    announcements: {
      heading: string
      subheading: string
      viewAll: string
      items: Announcement[]
    }
    services: {
      heading: string
      subheading: string
      items: Service[]
    }
    about: {
      badge: string
      heading: string
      description: string[]
      stats: Array<{ value: string; label: string }>
      cta: string
    }
    events: {
      heading: string
      subheading: string
      viewAll: string
      items: CommunityEvent[]
    }
  }
}

// ─── Page props with locale ───────────────────────────────────────────────────
export interface PageProps {
  params: Promise<{ locale?: Locale }>
}
