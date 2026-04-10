"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // 1. Додаємо нові стани для UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // ... твій існуючий код GSAP анімацій залишається без змін ...
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: { trigger: titleRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
      });
      gsap.from(formRef.current, {
        scrollTrigger: { trigger: formRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        x: -30, opacity: 0, duration: 0.8, ease: 'power3.out',
      });
      gsap.from(infoRef.current, {
        scrollTrigger: { trigger: infoRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        x: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 2. Оновлюємо логіку відправки форми
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

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
          // Додаткові приховані поля для Web3Forms (опціонально)
          subject: "Нове повідомлення з Nature Guardians",
          from_name: "Nature Guardians Website",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' }); // Очищаємо форму
        
        // Ховаємо повідомлення про успіх через 5 секунд
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        console.error("Помилка Web3Forms:", result);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error("Помилка мережі:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <Mail size={24} />, label: 'Email', value: 'alex@example.com' },
    { icon: <Phone size={24} />, label: 'Phone', value: '+1 (555) 123-4567' },
    { icon: <MapPin size={24} />, label: 'Location', value: 'San Francisco, CA' },
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-4">
        <h2 ref={titleRef} className="text-4xl md:text-6xl text-center mb-4 text-white">
          Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Touch</span>
        </h2>
        <p className="text-center text-gray-300 text-lg mb-16 max-w-2xl mx-auto">
          Have a project in mind? Lets create something amazing together
        </p>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div ref={formRef}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isSubmitting} // Блокуємо поля під час відправки
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              {/* 3. Оновлюємо кнопку та додаємо повідомлення статусів */}
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 relative overflow-hidden group font-semibold shadow-lg shadow-indigo-500/50 disabled:opacity-70"
              >
                <span className="relative z-10">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </span>
                {!isSubmitting && (
                  <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                )}
              </Button>

              {/* Повідомлення про результат */}
              {submitStatus === 'success' && (
                <p className="text-[#70C174] text-center font-medium mt-4">
                  Дякуємо! Ваше повідомлення успішно надіслано.
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-500 text-center font-medium mt-4">
                  Виникла помилка. Спробуйте ще раз пізніше.
                </p>
              )}
            </form>
          </div>

          <div ref={infoRef} className="space-y-8">
            {/* ... права колонка з контактами залишається без змін ... */}
            <div>
              <h3 className="mb-4 text-white text-2xl font-semibold">Lets work together!</h3>
              <p className="text-gray-400">
                Im always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300">
                  <div className="p-4 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-indigo-500/50 border border-white/10">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">{info.label}</p>
                    <p className="text-white font-semibold group-hover:text-indigo-400 transition-colors">{info.value}</p>
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