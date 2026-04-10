"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  Home,
  User,
  Code,
  Briefcase,
  FolderOpen,
  MessageSquare,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export function FloatingNav() {
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const isScrollingRef = useRef(false);
const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const t = useTranslations("Nav");
  const params = useParams();
  const locale = params.locale as string;

 const navItems = useMemo(() => [
    { icon: <Home size={20} />, label: t("home"), section: "home" },
    { icon: <User size={20} />, label: t("about"), section: "about" },
    { icon: <Code size={20} />, label: t("skills"), section: "skills" },
    {
      icon: <Briefcase size={20} />,
      label: t("experience"),
      section: "experience",
    },
    {
      icon: <FolderOpen size={20} />,
      label: t("projects"),
      section: "projects",
    },
    {
      icon: <MessageSquare size={20} />,
      label: t("contact"),
      section: "contact",
    },
  ], [t]);

  const handleScroll = useCallback(() => {
    if (isScrollingRef.current) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      navItems.forEach((item, index) => {
        const section = document.getElementById(item.section);
        if (section) {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;
          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveIndex((prev) => (prev !== index ? index : prev));
          }
        }
      });
    });
  }, [navItems]);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.0,
        ease: "back.out(1.7)",
        clearProps: "all",
      },
    );

    window.addEventListener("scroll", handleScroll, { passive: true }); // ← passive: true — не блокує скрол

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        y: activeIndex * 56,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  }, [activeIndex]);


  const scrollToSection = (section: string, index: number) => {
    isScrollingRef.current = true;
    setActiveIndex(index);

    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    setIsExpanded(false);

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  return (
    <>
      {/* Mobile Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/80 transition-all duration-300 hover:scale-110"
        >
          {isExpanded ? (
            <X size={24} className="text-white" />
          ) : (
            <Home size={24} className="text-white" />
          )}
        </button>

        {isExpanded && (
          <div className="absolute bottom-20 right-0 bg-[#13131a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.section, index)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Floating Navigation */}
      <nav
        ref={navRef}
        key={locale}
        className="fixed top-1/2 -translate-y-1/2 right-7 lg:right-9 z-101 hidden md:block"
      >
        <div className="relative bg-[#13131a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl shadow-indigo-500/20">
          {/* Active Indicator */}
          <div
            ref={indicatorRef}
            className="absolute left-2 w-12 h-12 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl"
            style={{ top: "8px" }}
          ></div>

          {/* Nav Items */}
          <div className="relative z-10 flex flex-col gap-2">
            {navItems.map((item, index) => (
              <button
                key={`${locale}-${index}`}
                onClick={() => scrollToSection(item.section, index)}
                className={`group relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${
                  activeIndex === index
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <div className="relative z-10">{item.icon}</div>

                {/* Tooltip */}
                <div className="absolute right-16 px-4 py-2 bg-[#13131a] border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap shadow-xl">
                  <span className="text-sm font-medium">{item.label}</span>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-8 border-transparent border-l-[#13131a]"></div>
                </div>
              </button>
            ))}
          </div>

          {/* Decorative elements */}
          <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl opacity-20 blur-xl"></div>
        </div>
      </nav>
    </>
  );
}
