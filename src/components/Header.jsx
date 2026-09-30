import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const slogans = {
  en: "Our childhood planet, recompiled.",
  ar: "كوكب طفولتنا.. بعد إعادة تجميعه.",
  fr: "Notre planète d'enfance, recompilée."
};

export default function Header() {
  const { lang, changeLanguage } = useLang();

  // Definition array for rendering options cleanly in the UI
  const languageOptions = [
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
    { code: 'fr', label: 'FR' }
  ];

  return (
    <header className="w-full py-4 px-6 border-b border-white/10 bg-slate-950/40 backdrop-blur-md z-50 sticky top-0 flex justify-between items-center shadow-lg">
      
      {/* LEFT: Branding Interactive Gate */}
      <div className="flex-1 flex justify-start">
        <Link to="/" className="flex items-center gap-3 group transition">
          <img 
            src="/logo.png" 
            alt="Astrotoon Logo" 
            className="h-12 md:h-14 w-auto drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* CENTER: Multi-Language Slogan */}
      <div className="hidden sm:flex flex-1 justify-center text-center px-4">
        <p 
          className="text-amber-400 text-sm md:text-base font-medium tracking-wide italic font-serif transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
          key={lang} // Forces remount animation when language flips
        >
          "{slogans[lang]}"
        </p>
      </div>

      {/* RIGHT: Arcade Capsule Button Toggles Matching Your Sent Design */}
      <div className="flex-1 flex justify-end items-center">
        <div className="flex items-center bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 gap-2 shadow-inner">
          {languageOptions.map((opt) => {
            const isActive = lang === opt.code;
            return (
              <button
                key={opt.code}
                onClick={() => changeLanguage(opt.code)}
                className={`px-4 py-2 rounded-xl text-sm font-black font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md scale-100'
                    : 'bg-slate-900/60 text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
}
