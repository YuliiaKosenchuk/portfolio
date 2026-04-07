import { getRequestConfig } from "next-intl/server";
import { Locale, routing } from "./routing";


export default getRequestConfig(async ({ locale }) => {
  const activeLocale = locale && routing.locales.includes(locale as Locale) 
    ? locale 
    : routing.defaultLocale;

  // 2. Тепер TS знає, що якщо ми дійшли сюди, locale — це 100% рядок
  return {
    locale: activeLocale,
    messages: (await import(`../messages/${activeLocale}.json`)).default
  };
});