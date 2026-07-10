import type { Locale } from "@/config/i18n"
import type { Dictionary } from "@/types"

import hiCommon from "@/data/locales/hi/common.json"
import hiNav from "@/data/locales/hi/nav.json"
import hiHome from "@/data/locales/hi/home.json"
import enCommon from "@/data/locales/en/common.json"
import enNav from "@/data/locales/en/nav.json"
import enHome from "@/data/locales/en/home.json"

const dictionaries: Record<Locale, () => Dictionary> = {
  hi: () => ({
    common: hiCommon as Record<string, string>,
    nav: hiNav as Dictionary["nav"],
    home: hiHome as unknown as Dictionary["home"],
  }),
  en: () => ({
    common: enCommon as Record<string, string>,
    nav: enNav as Dictionary["nav"],
    home: enHome as unknown as Dictionary["home"],
  }),
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]()
}
