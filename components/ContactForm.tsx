"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
   const t = useTranslations("Contact");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

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
      gsap.from(formRef.current, {
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(infoRef.current, {
        scrollTrigger: {
          trigger: infoRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        x: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const validate = (data: typeof formData): FormErrors => {
    const errs: FormErrors = {};

    if (!data.name.trim()) {
      errs.name = t("form.nameError1");
    } else if (data.name.trim().length < 2) {
      errs.name = t("form.nameError2");
    }

    if (!data.email.trim()) {
      errs.email = t("form.emailError1");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = t("form.emailError2");
    }

    if (!data.message.trim()) {
      errs.message = t("form.messageError1");
    } else if (data.message.trim().length < 10) {
      errs.message = t("form.messageError2");
    }

    return errs;
  };

  const handleBlur = (field: keyof typeof formData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(formData);
    setErrors(errs);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (touched[field]) {
      setErrors(validate(updated));
    }
  };

  const invalidClass =
    "border-red-500 focus-visible:ring-red-500/40 focus-visible:border-red-500";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const allTouched = { name: true, email: true, message: true };
    setTouched(allTouched);
    const errs = validate(formData);
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: "Нове повідомлення з Portfolio",
          from_name: "Portfolio Website",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTouched({});
        setErrors({});
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        console.error("Помилка Web3Forms:", result);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Помилка мережі:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail size={24} className="relative z-10" />,
      label: "Email",
      value: "yuliia.kosenchuk@gmail.com",
      href: "mailto:yuliia.kosenchuk@gmail.com",
    },
    {
      icon: <Phone size={24} className="relative z-10" />,
      label: t("social.phone"),
      value: "+48 575-379-899",
      href: "tel:+48575379899",
    },
    {
      icon: <MapPin size={24} className="relative z-10" />,
      label: t("social.location"),
      value: t("social.locationValue"),
      href: "https://maps.google.com/?q=Rijeka,Croatia",
      target: "_blank",
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="w-full py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl md:pr-28 min-[1350px]:pr-0!">
        <h2
          ref={titleRef}
          className="text-4xl md:text-6xl text-center mb-12 text-white"
        >
          {t("title1")}{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-pink-400">
            {t("title2")}
          </span>
        </h2>
        <p className="text-center text-gray-300 text-lg mb-16 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>

        <div className="mx-auto flex flex-col md:flex-row gap-12 md:gap-20">
          <div ref={formRef} className="w-full md:w-1/2">
            <form onSubmit={handleSubmit} noValidate className="space-y-2">

              <div className="flex flex-col">
                <Input
                  type="text"
                  placeholder={t("form.namePlaceholder")}
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  disabled={isSubmitting}
                  className={touched.name && errors.name ? invalidClass : ""}
                />
                <div className="min-h-6] mt-1 px-1">
                  <p
                    className={`text-sm text-red-500 transition-opacity duration-300 flex items-center gap-1 ${
                      touched.name && errors.name ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <span>⚠</span> {errors.name}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <Input
                  type="email"
                  placeholder={t("form.emailPlaceholder")}
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  disabled={isSubmitting}
                  className={touched.email && errors.email ? invalidClass : ""}
                />
                <div className="min-h-6 mt-1 px-1">
                  <p
                    className={`text-sm text-red-500 transition-opacity duration-300 flex items-center gap-1 ${
                      touched.email && errors.email
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <span>⚠</span> {errors.email}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col">
                <Textarea
                  placeholder={t("form.messagePlaceholder")}
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onBlur={() => handleBlur("message")}
                  disabled={isSubmitting}
                  className={
                    touched.message && errors.message ? invalidClass : ""
                  }
                />
                <div className="min-h-6 mt-1 px-1">
                  <p
                    className={`text-sm text-red-500 transition-opacity duration-300 flex items-center gap-1 ${
                      touched.message && errors.message
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <span>⚠</span> {errors.message}
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full mt-2 rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 relative overflow-hidden group shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/80 transition-all hover:-translate-y-0.5 text-white border-0 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-indigo-500/50"
              >
                <span className="relative z-10 font-semibold text-base">
                  {isSubmitting ? t("form.submitting") : t("form.submit")}
                </span>
                {!isSubmitting && (
                  <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                )}
              </Button>

              <div className="min-h-6 mt-2">
                <p
                  className={`text-center font-medium transition-opacity duration-300 ${
                    submitStatus === "success"
                      ? "opacity-100 text-[#70C174]"
                      : submitStatus === "error"
                        ? "opacity-100 text-red-500"
                        : "opacity-0"
                  }`}
                >
                  {submitStatus === "success"
                    ? t("form.success")
                    : submitStatus === "error"
                      ? t("form.error")
                      : ""}
                </p>
              </div>
            </form>
          </div>

          <div
            ref={infoRef}
            className=" self-start w-full md:w-1/2 flex flex-col justify-center"
          >
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-6 group/item">
                  <a
                    href={info.href}
                    target={info.target}
                    rel={info.target ? "noopener noreferrer" : undefined}
                    className="relative flex items-center justify-center min-w-14 w-14 h-14 
                      bg-[#13131a]/80 border border-white/10 p-2 shadow-indigo-500/20 rounded-2xl 
                      hover:border-indigo-400/50 hover:-translate-y-0.5 
                      transition-all duration-300 text-gray-400 hover:text-white 
                      shadow-lg hover:shadow-indigo-500/60
                      overflow-hidden group"
                  >
                    {info.icon}
                    <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-500"></div>
                    <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl opacity-20 -z-10 transition-opacity duration-300 group-hover:opacity-40"></div>
                  </a>

                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      {info.label}
                    </p>
                    <a
                      href={info.href}
                      target={info.target}
                      rel={info.target ? "noopener noreferrer" : undefined}
                      className="text-white text-lg font-semibold group-hover/item:text-indigo-400 transition-colors"
                    >
                      {info.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
