"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, Code2, Rocket, Users } from "lucide-react";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("About");

  useGSAP(
    () => {
      const triggerDefaults = {
        toggleActions: "play none none none",
        once: true,
      };

      // Анімація заголовку
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

      // Анімація текстового блоку
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: contentRef.current,
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
        stagger: 0.1, // однаковий крок з Skills
        ease: "power2.out",
      });
    },
    { scope: sectionRef },
  );

  const highlights = [
    {
      icon: <Code2 size={32} />,
      title: t("highlights.0.title"),
      description: t("highlights.0.description"),
    },
    {
      icon: <Rocket size={32} />,
      title: t("highlights.1.title"),
      description: t("highlights.1.description"),
    },
    {
      icon: <BookOpen size={32} />,
      title: t("highlights.2.title"),
      description: t("highlights.2.description"),
    },
    {
      icon: <Users size={32} />,
      title: t("highlights.3.title"),
      description: t("highlights.3.description"),
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className=" w-full py-20 bg-secondary/30 relative overflow-hidden"
    >
      <div className="container px-6 max-w-6xl mx-auto md:pr-28 min-[1350px]:pr-0!">
        <h2
          ref={titleRef}
          className="text-4xl md:text-6xl text-center mb-12 text-white"
        >
          {t("title1")}{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-pink-400">
            {t("title2")}
          </span>
        </h2>

        <div ref={contentRef} className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
            {t("description1")}
            <span className="text-indigo-300 font-semibold">
              {" "}
              {t("description2")}
            </span>
          </p>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            {t("description3")}
          </p>
        </div>
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-6xl mx-auto"
        >
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-[#13131a]/80 
                 border border-white/10 hover:border-indigo-500/30 
                 transition-colors duration-500 shadow-xl shadow-black/20 
                overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-2xl 
                        bg-white/5 border border-white/10 text-indigo-400 
                        mb-6 group-hover:scale-110 group-hover:text-pink-400 
                        transition-all duration-500"
                >
                  {highlight.icon}
                </div>

                <h3 className="relative mb-3 text-xl font-semibold">
                  <span className="text-white transition-opacity duration-300 group-hover:opacity-0">
                    {highlight.title}
                  </span>
                  <span className="absolute left-0 top-0 text-transparent bg-clip-text bg-linear-to-r from-white to-indigo-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {highlight.title}
                  </span>
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {highlight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
