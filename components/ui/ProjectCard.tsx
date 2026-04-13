"use client";

import { Project } from "@/types/project";
import Image from "next/image";
import { useRef, useState, memo, useCallback, useEffect } from "react";
import { ExternalLink, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

type ProjectCardProps = {
  project: Project;
  index: number;
  isMobile: boolean;
};


function VideoModal({ src, onClose }: { src: string; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Autoplay when modal opens
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal container — stops click propagation so clicking video doesn't close */}
      <div
        className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black/90 transition-colors"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        {/* 16:9 aspect ratio box */}
        <div className="relative w-full aspect-video bg-black">
          <video
            ref={videoRef}
            src={src}
            className="absolute inset-0 w-full h-full object-contain"
            controls
            playsInline
            loop
            autoPlay
            muted
            preload="auto"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}


export const ProjectCard = memo(function ProjectCard({
  project,
  index,
}: ProjectCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const t = useTranslations("Projects");
  const isEven = index % 2 === 0;

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <div
        className={`
          flex flex-col md:h-133 min-[1350px]:h-112.5!
          ${isEven ? "md:flex-row" : "md:flex-row-reverse"}
          group relative rounded-3xl
          bg-[#13131a]/80 border border-white/10
          hover:border-indigo-500/30 transition-colors duration-500
          overflow-hidden shadow-xl shadow-black/20
        `}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-indigo-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Media zone — always shows poster, click opens modal */}
        <div
          onClick={project.video ? openModal : undefined}
          className={`
            relative z-10 w-full h-72 md:h-full md:w-1/2
            overflow-hidden border-b md:border-b-0
            ${isEven ? "md:border-r" : "md:border-l"} border-white/10
            ${project.video ? "cursor-pointer" : ""}
          `}
        >
          {/* Poster */}
          <Image
            src={project.poster}
            alt={project.title}
            width={600}
            height={400}
            priority={index < 2}
            loading={index < 2 ? "eager" : "lazy"}
            className="absolute inset-0 w-full h-full object-cover object-top z-10"
          />

          {/* Play overlay — CSS only via group-hover, zero JS */}
          {project.video && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full border-2 border-white/70 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white translate-x-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm font-medium tracking-wide">
                  {t("previewBtn")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Text content */}
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
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 text-sm font-medium text-gray-400 bg-white/5 border border-white/10 rounded-full hover:border-indigo-500/50 hover:text-white hover:bg-indigo-500/10 transition-all cursor-default ease-in-out"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4 mt-auto">
            {/* GitHub button */}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center justify-center w-14 h-14 bg-[#13131a]/80 border border-white/10 rounded-2xl backdrop-blur-sm shadow-lg shadow-indigo-500/20 text-gray-400 hover:text-white hover:border-indigo-400/50 hover:-translate-y-0.5 hover:shadow-indigo-500/60 transition-all duration-300 overflow-hidden group/btn"
              aria-label="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="relative z-10 size-6"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 translate-y-full group-hover/btn:translate-y-0 transition-all duration-500" />
              <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl opacity-20" />
            </a>

            {/* Demo button */}
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center justify-center h-14 px-6 bg-[#13131a]/80 border border-white/10 rounded-2xl backdrop-blur-sm shadow-lg shadow-indigo-500/20 text-gray-400 hover:text-white hover:border-indigo-400/50 hover:-translate-y-0.5 hover:shadow-indigo-500/60 transition-all duration-300 overflow-hidden group/btn"
            >
              <span className="relative z-10 flex items-center font-semibold text-base">
                <ExternalLink className="mr-2 size-6" />
                {t("demoBtn")}
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 translate-y-full group-hover/btn:translate-y-0 transition-all duration-500" />
              <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl opacity-20" />
            </a>
          </div>
        </div>
      </div>

      {/* Video modal — rendered via portal outside card DOM */}
      {modalOpen && <VideoModal src={project.video!} onClose={closeModal} />}
    </>
  );
});
