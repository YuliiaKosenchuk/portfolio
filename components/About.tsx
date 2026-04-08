"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react"; 
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, Code2, Rocket, Users} from "lucide-react";
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
      // Спільні налаштування ScrollTrigger
      const triggerDefaults = {
        toggleActions: "play none none none",
        once: true,  // ← спрацьовує один раз і більше не слідкує
      };

      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 90%",  // ← було 80%, збільшуємо зону спрацювання
          ...triggerDefaults,
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        immediateRender: false, // ← не встановлювати opacity:0 до ScrollTrigger
      });

      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 90%",
          ...triggerDefaults,
        },
        y: 20,
        opacity: 0,
        duration: 0.7,
        delay: 0.15,
        ease: "power2.out",
        immediateRender: false,
      });

      gsap.from(cardsRef.current?.children || [], {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          ...triggerDefaults,
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        immediateRender: false,
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
      <div className="container mx-auto px-4">
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
          className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4 gap-8 max-w-6xl mx-auto"
        >
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-indigo-500/20 group relative overflow-hidden hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-linear-to-br from-indigo-600/20 to-purple-600/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="text-indigo-400 mb-4 group-hover:scale-108 transition-all duration-500">
                  {highlight.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  {highlight.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
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
