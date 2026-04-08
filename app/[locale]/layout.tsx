import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";
import { Locale, routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { FloatingNav } from "@/components/FloatingNav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SmoothScroll } from "@/components/SmoothScroll";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kosenchuk Dev Portfolio",
  description:
    "Welcome to my portfolio! I am a passionate frontend developer with a strong background in creating visually stunning and user-friendly web applications. With expertise in HTML, CSS, JavaScript, and modern frameworks like React, I bring ideas to life through clean and efficient code. Explore my projects to see how I combine creativity with technical skills to deliver exceptional digital experiences.",
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  // Валідація мови перед рендером
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body
        key={locale}
        className={`${montserrat.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <FloatingNav />
          <ScrollProgress />
          <SmoothScroll>{props.children}</SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
