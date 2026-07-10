export const locales = ["hi", "en"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "hi"

export const localeLabels: Record<Locale, string> = {
  hi: "हिन्दी",
  en: "English",
}

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  hi: "ltr",
  en: "ltr",
}
