"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { Languages } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function LanguagePicker() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const pickerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const savedScroll = sessionStorage.getItem("scrollPosition");
//     if (savedScroll) {
//     const timer = setTimeout(() => {
//       window.scrollTo({ top: Number(savedScroll), behavior: 'smooth' });
//       sessionStorage.removeItem('scrollPosition');
//     }, 500); // ← підбери під анімацію: 300-600ms

//     return () => clearTimeout(timer);
//   }
// }, []);

  useEffect(() => {
    gsap.fromTo(
      pickerRef.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        clearProps: "all",
      },
    );
  }, []);

  const toggleLanguage = () => {
    // sessionStorage.setItem("scrollPosition", String(window.scrollY));
    const nextLocale = locale === "uk" ? "en" : "uk";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div ref={pickerRef} className="absolute md:fixed top-8 right-7 lg:right-9 z-101">
      <div
        className="relative bg-[#13131a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl shadow-indigo-500/10 group cursor-pointer"
        onClick={toggleLanguage}
      >
        <div className="relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 group-hover:bg-white/5">
          <Languages
            size={18}
            className="hidden min-[1350px]:block text-gray-400 group-hover:text-indigo-400 transition-colors duration-300"
          />
          <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-300">
            {locale === "uk" ? "EN" : "UA"}
          </span>
        </div>

        <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500 -z-10"></div>

        <div className="hidden md:block absolute right-full top-1/2 -translate-y-1/2 mr-4 px-4 py-2 bg-[#13131a] border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap shadow-xl">
          <span className="text-sm font-medium text-gray-200">
            {locale === "uk" ? "Switch to English" : "Перемкнути на українську"}
          </span>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-8 border-transparent border-l-[#13131a]"></div>
        </div>
      </div>
    </div>
  );
}
