"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Project } from "@/types/project";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

type ProjectsProps = {
  projects: Project[];
};

export function Projects({ projects }: ProjectsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Projects");
  const isMobile = useIsMobile();

  useGSAP(
    () => {
      const cards = projectsRef.current?.children || [];

      gsap.set(cards, { opacity: 0, y: 40 });

      ScrollTrigger.batch(cards, {
        start: "top 85%",
        once: true,
        onEnter: (batch) => {
          gsap.set(batch, { willChange: "transform, opacity" });
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.15,
            onComplete: () => { gsap.set(batch, { clearProps: "willChange" }) },
          });
        },
      });

      gsap.from(headerRef.current?.children || [], {
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
          once: true,
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
      });

      ScrollTrigger.refresh();
      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
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
      className="w-full py-20 bg-secondary/30 relative"
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
            <ProjectCard
              key={project.key}
              project={project}
              index={index}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
