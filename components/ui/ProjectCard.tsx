"use client";
import { Project } from "@/types/project";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const t = useTranslations("Projects");

  // useEffect(() => {
  //   const video = videoRef.current;
  //   if (!video) return;

  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         if (!video.src || !video.src.includes(project.video)) {
  //           video.src = project.video;
  //         }
  //       } else {
  //         if (!video.paused) {
  //           video.pause();
  //         }
  //         video.currentTime = 0;
  //       }
  //     },
  //     { threshold: 0.4 },
  //   );

  //   observer.observe(video);
  //   return () => observer.disconnect();
  // }, [project.video]);

  return (
    <div
      key={index}
      // onMouseEnter={() => {
      //   const video = videoRef.current;
      //   if (!video) return;

      //   if (!video.src || !video.src.includes(project.video)) {
      //     video.src = project.video;
      //   }

      //   video.play().catch(() => {});
      // }}
      // onMouseLeave={() => {
      //   const video = videoRef.current;
      //   if (!video) return;

      //   video.pause();
      //   video.currentTime = 0;
      // }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex flex-col md:h-133 ${
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      } group relative rounded-3xl bg-[#13131a]/80 border border-white/10 hover:border-indigo-500/30 transition-colors duration-500 overflow-hidden shadow-xl shadow-black/20`}
    >
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>

      <div className="w-full h-72 md:h-full md:w-1/2 overflow-hidden relative z-10 border-b md:border-b-0 md:border-r border-white/10">
        {/* <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0f] to-transparent z-10 opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"></div> */}
        <Image
          src={project.poster}
          alt={project.title}
          width={600}
          height={400}
          priority={index < 2}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${
    isHovered ? "opacity-0 z-0" : "opacity-100 z-10"
  }`}
          // className="absolute inset-0 w-full h-full object-cover object-top z-10 transition-opacity duration-700 group-hover:opacity-0"
        />
        {/* <video
          ref={videoRef}
          data-src={project.video}
          className="absolute inset-0 w-full h-full object-cover object-top"
          muted
          loop
          playsInline
          preload="none"
          poster={project.poster}
        /> */}
        {isHovered && (
          <video
            ref={videoRef}
            src={project.video}
            className="absolute inset-0 w-full h-full object-cover object-top z-0"
            muted
            loop
            playsInline
            autoPlay
          />
        )}
      </div>

      <div className="md:w-1/2 p-6 lg:p-12 flex flex-col justify-center relative z-10">
        <h3 className="mb-4 text-2xl lg:text-3xl font-bold">
          <span className="grid">
            <span className="col-start-1 row-start-1 text-white transition-opacity duration-300 group-hover:opacity-0">
              {project.title}
            </span>
            <span className="col-start-1 row-start-1 text-transparent bg-clip-text bg-linear-to-r from-white to-indigo-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {project.title}
            </span>
          </span>
        </h3>

        <p className="text-gray-400 mb-8 leading-relaxed text-base lg:text-lg">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-4 py-1.5 text-sm font-medium text-gray-400 bg-white/5 border border-white/10 rounded-full hover:border-indigo-500/50 hover:text-white hover:bg-indigo-500/10 transition-all cursor-default ease-in-out"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4 mt-auto">
          {/* GitHub Button */}
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-14 h-14 bg-[#13131a]/80 border border-white/10 p-2 shadow-indigo-500/20 rounded-2xl backdrop-blur-sm hover:border-indigo-400/50 hover:-translate-y-0.5 transition-all duration-300 text-gray-400 hover:text-white shadow-lg hover:shadow-indigo-500/60 overflow-hidden group/btn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="relative z-10 size-6"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            {/* Анімація фону та світіння */}
            <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 translate-y-full group-hover/btn:translate-y-0 transition-all duration-500"></div>
            <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl opacity-20"></div>
          </a>

          {/* Demo Button */}
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center h-14 px-6 bg-[#13131a]/80 border border-white/10 shadow-indigo-500/20 rounded-2xl backdrop-blur-sm hover:border-indigo-400/50 hover:-translate-y-0.5 transition-all duration-300 text-gray-400 hover:text-white shadow-lg hover:shadow-indigo-500/60 overflow-hidden group/btn"
          >
            <span className="relative z-10 flex items-center font-semibold text-base">
              <ExternalLink size={24} className="mr-2 size-6" />
              {t("demoBtn")}
            </span>
            {/* Анімація фону та світіння */}
            <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 translate-y-full group-hover/btn:translate-y-0 transition-all duration-500"></div>
            <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl opacity-20"></div>
          </a>
        </div>
      </div>
    </div>
  );
}
