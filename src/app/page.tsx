import { getDictionary } from "@/lib/i18n"
import { defaultLocale } from "@/config/i18n"
import { HeroSection } from "@/features/home/HeroSection"
import { BookingActionsSection } from "@/features/home/BookingActionsSection"
import { AnnouncementsSection } from "@/features/home/AnnouncementsSection"
import { EkadashiSection } from "@/features/home/EkadashiSection"
import { ServicesSection } from "@/features/home/ServicesSection"
import { AboutSection } from "@/features/home/AboutSection"
import { EventsSection } from "@/features/home/EventsSection"
import { OrnamentalDivider } from "@/components/shared/OrnamentalDivider"
import { getUpcomingEkadashis } from "@/features/booking/repositories/googleSheetsRepository"

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const dict = getDictionary(defaultLocale)
  const ekadashis = await getUpcomingEkadashis()

  return (
    <>
      <HeroSection hero={dict.home.hero} />
      <BookingActionsSection />
      <AnnouncementsSection announcements={dict.home.announcements} />
      <EkadashiSection ekadashis={ekadashis} />
      <OrnamentalDivider className="mx-auto max-w-7xl px-4" />
      <ServicesSection services={dict.home.services} />
      <OrnamentalDivider className="mx-auto max-w-7xl px-4" />
      <AboutSection about={dict.home.about} />
      <OrnamentalDivider className="mx-auto max-w-7xl px-4" />
      <EventsSection events={dict.home.events} />
    </>
  )
}
