"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Project } from "@/types/project";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

type ProjectsProps = {
  projects: Project[];
};

export function Projects({ projects }: ProjectsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Projects");

  useGSAP(
    () => {
      const triggerDefaults = {
        toggleActions: "play none none none",
        once: true,
      };

      const cards = projectsRef.current?.children || [];

    // 1. ОДРАЗУ ховаємо картки до того, як користувач їх побачить
    gsap.set(cards, { opacity: 0, y: 40 });

    // 2. Анімуємо їх появу (gsap.to замість gsap.from)
    ScrollTrigger.batch(cards, {
      start: "top 85%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0, // повертаємо на нульову позицію
          opacity: 1, // робимо видимими
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.15,
        }),
    });

      gsap.from(headerRef.current?.children || [], {
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 90%",
          ...triggerDefaults,
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
      });

      // gsap.utils.toArray<Element>(projectsRef.current?.children || []).forEach((card) => {
      //   gsap.from(card, {
      //     scrollTrigger: {
      //       trigger: card,
      //       start: "top 85%",
      //       ...triggerDefaults,
      //     },
      //     y: 40,
      //     opacity: 0,
      //     duration: 0.6,
      //     ease: "power2.out",
      //   });
      // });
      // ScrollTrigger.batch(projectsRef.current?.children || [], {
      //   start: "top 85%",
      //   once: true,
      //   onEnter: (batch) =>
      //     gsap.from(batch, {
      //       y: 40,
      //       opacity: 0,
      //       duration: 0.6,
      //       ease: "power2.out",
      //       stagger: 0.15,
      //     }),
      // });
    },
    { scope: sectionRef },
  );

  const translatedProjects = useMemo(
  () =>
    projects.map((project) => ({
      ...project,
      title: t(`${project.key}.title`),
      description: t(`${project.key}.description`),
    })),
  [projects, t],
);
  return (
    <section
      id="projects"
      ref={sectionRef}
      className=" w-full py-20 bg-secondary/30 relative overflow-hidden"
    >
      <div className="container px-6 max-w-6xl mx-auto md:pr-28 min-[1350px]:pr-0!">
        <div ref={headerRef} className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-6xl text-center mb-6 text-white">
            {t("title1")}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-pink-400">
              {t("title2")}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div ref={projectsRef} className="space-y-12">
          {translatedProjects.map((project, index) => (
            <ProjectCard key={project.key} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
