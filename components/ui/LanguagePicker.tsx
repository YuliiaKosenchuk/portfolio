"use client";

import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { Languages } from 'lucide-react';

export function LanguagePicker() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const toggleLanguage = () => {
    const nextLocale = locale === 'uk' ? 'en' : 'uk';
    
    // router.replace просто оновить мовну частину шляху
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button 
      onClick={toggleLanguage} 
      className="fixed top-4 right-4 z-100 flex items-center gap-2 bg-white/10 p-2 rounded-full backdrop-blur-md"
    >
      <Languages size={20} />
      <span className="font-medium">{locale === 'uk' ? 'EN' : 'UA'}</span>
    </button>
  );
}