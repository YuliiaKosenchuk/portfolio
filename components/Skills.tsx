"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Terminal, Layers, Database, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

export function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Skills");

  useGSAP(
    () => {
      const triggerDefaults = {
        toggleActions: "play none none none",
        once: true,
      };

      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 90%",
          ...triggerDefaults,
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      });

      // Каскадна анімація карток
      gsap.from(cardsRef.current?.children || [], {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 85%",
          ...triggerDefaults,
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });
    },
    { scope: sectionRef },
  );

  const skillGroups = [
    {
      title: t("cards.0.title"),
      subtitle: t("cards.0.subtitle"),
      icon: <Terminal size={24} />,
      skills: ["HTML", "CSS", "JavaScript", "TypeScript"],
    },
    {
      title: t("cards.1.title"),
      subtitle: t("cards.1.subtitle"),
      icon: <Layers size={24} />,
      skills: ["React", "Next.js", "SCSS", "Tailwind", "Bulma"],
    },
    {
      title: t("cards.2.title"),
      subtitle: t("cards.2.subtitle"),
      icon: <Database size={24} />,
      skills: ["Zustand", "Redux", "TanStack Query", "React Router", "i18next", "Axios", "React Hook Form", "Zod"],
    },
    {
      title: t("cards.3.title"),
      subtitle: t("cards.3.subtitle"),
      icon: <Sparkles size={24} />,
      skills: ["GSAP", "Motion", "Lenis", "Figma", "Canva", "Lottie"],
    },
  ];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="w-full py-20 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 max-w-6xl md:pr-28 min-[1350px]:pr-0!">
        <h2
          ref={titleRef}
          className="text-4xl md:text-6xl text-center mb-6 text-white"
        >
          {t("title1")}{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-pink-400">
            {t("title2")}
          </span>
        </h2>

        <div ref={titleRef} className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillGroups.map((group, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-[#13131a]/80 border border-white/10 hover:border-indigo-500/30 transition-colors duration-500 overflow-hidden shadow-xl shadow-black/20"
            >
              <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className=" shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-indigo-400 group-hover:scale-110 group-hover:text-pink-400 transition-all duration-500">
                    {group.icon}
                  </div>
                  <div className="flex flex-col justify-center sm:min-h-24">
                    <h3 className="relative mb-1 text-xl font-semibold">
                      <span className="text-white transition-opacity duration-300 group-hover:opacity-0">
                        {group.title}
                      </span>
                      <span className="absolute left-0 top-0 text-transparent bg-clip-text bg-linear-to-r from-white to-indigo-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {group.title}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {group.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-1.5 text-sm font-medium text-gray-500 bg-white/5 border border-white/10 rounded-full hover:border-indigo-500/50 hover:text-white hover:bg-indigo-500/10 transition-all cursor-default ease-in-out"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
