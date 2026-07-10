import { getDictionary } from "@/lib/i18n"
import { defaultLocale } from "@/config/i18n"
import { HeroSection } from "@/features/home/HeroSection"
import { AnnouncementsSection } from "@/features/home/AnnouncementsSection"
import { ServicesSection } from "@/features/home/ServicesSection"
import { AboutSection } from "@/features/home/AboutSection"
import { EventsSection } from "@/features/home/EventsSection"
import { OrnamentalDivider } from "@/components/shared/OrnamentalDivider"

/**
 * Home page — Server Component.
 * All data is loaded server-side via getDictionary.
 * Locale defaults to Hindi (hi); future multilingual support
 * can be added by passing locale from route params/cookies.
 */
export default function HomePage() {
  const dict = getDictionary(defaultLocale)

  return (
    <>
      <HeroSection hero={dict.home.hero} />
      <AnnouncementsSection announcements={dict.home.announcements} />
      <OrnamentalDivider className="mx-auto max-w-7xl px-4" />
      <ServicesSection services={dict.home.services} />
      <OrnamentalDivider className="mx-auto max-w-7xl px-4" />
      <AboutSection about={dict.home.about} />
      <OrnamentalDivider className="mx-auto max-w-7xl px-4" />
      <EventsSection events={dict.home.events} />
    </>
  )
}
