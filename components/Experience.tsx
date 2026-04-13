"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { EXPERIENCE_KEYS } from "@/data/experiences";

gsap.registerPlugin(ScrollTrigger);

export function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Experience");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Animate timeline line
      gsap.from(lineRef.current, {
        scrollTrigger: {
          trigger: lineRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.5,
        },
        scaleY: 0,
        transformOrigin: "top",
      });

      // Animate timeline items
      const items = timelineRef.current?.querySelectorAll(".timeline-item");
      items?.forEach((item, index) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          x: index % 2 === 0 ? -50 : 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const translatedExperiences = useMemo(
    () =>
      EXPERIENCE_KEYS.map((exp) => ({
        ...exp,
        description: t(`${exp.id}.description`),
        achievements: t.raw(`${exp.id}.achievements`) as string[],
      })),
    [t],
  );

  return (
    <section id="experience" ref={sectionRef} className="pb-20 relative">
      <div className="container px-6 max-w-7xl mx-auto md:pr-28 min-[1350px]:pr-0!">
        <h2
          ref={titleRef}
          className="text-4xl md:text-6xl text-center mb-16 text-white"
        >
          {t("title1")}{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-pink-400">
             {t("title2")}
          </span>
        </h2>

        <div className="relative max-w-5xl mx-auto" ref={timelineRef}>
          {/* Timeline Line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-500 via-purple-500 to-pink-500 -translate-x-1/2 hidden md:block"
            ref={lineRef}
          ></div>

          <div className="space-y-12">
            {translatedExperiences.map((exp, index) => (
              <div
                key={index}
                className={`timeline-item relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-linear-to-r from-blue-500 to-purple-500 rounded-full border-4 border-background hidden md:block z-10"></div>

                {/* Content */}
                <div
                  className={`w-full md:w-[calc(50%-2rem)] ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}
                >
                  <div className="flex flex-col p-8 bg-[#13131a]/80 rounded-3xl shadow-xl shadow-black/20 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden group hover:shadow-xl hover:shadow-indigo-500/20">
                    <div className="absolute inset-0 bg-linear-to-r from-indigo-600/20 to-purple-600/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-indigo-400 mb-3">
                        <Briefcase size={20} />
                        <span className="text-sm font-semibold">
                          {exp.company}
                        </span>
                      </div>

                      <h3 className="mb-2 text-xl font-bold text-white">
                        {exp.title}
                      </h3>

                      <div className="flex items-center gap-2 text-gray-500 mb-4">
                        <Calendar size={16} />
                        <span className="text-sm font-medium">
                          {exp.period}
                        </span>
                      </div>

                      <p className="text-gray-400 mb-4 leading-relaxed">
                        {exp.description}
                      </p>

                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-400 flex items-start gap-2"
                          >
                            <span className="text-indigo-400 font-bold">▸</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
