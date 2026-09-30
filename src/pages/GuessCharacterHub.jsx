import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext'; // 👈 Global Context Hook


const uiText = {
  pageTitle: { en: "Guess the Character", ar: "خمن الشخصية", fr: "Devine le Personnage" },
  backBtn: { en: "Go Back", ar: "العودة", fr: "Retour" },
  pixelTitle: { en: "Pixel Image Grid", ar: "مصفوفة الصور المكسلة", fr: "Grille d'Image Pixel" },
  pixelDesc: { en: "Reveal 6 hidden image segments one by one.", ar: "اكشف 6 أجزاء مخفية من الصورة جزءاً بجزء.", fr: "Révélez 6 segments d'image cachés un par un." },
  traitsTitle: { en: "Characteristic Cards", ar: "بطاقات المعلومات", fr: "Cartes des Caractéristiques" },
  traitsDesc: { en: "Analyze 4 profile data points and flip 4 visual cards.", ar: "حلل 4 معلومات أساسية واقلب 4 بطاقات صور.", fr: "Analysez 4 données de profil et retournez 4 cartes." }
};

export default function GuessCharacterHub() {
  const { lang } = useLang(); 

  return (
    <div className="w-full flex flex-col items-center py-2 relative">
      
      <div className="w-full flex justify-start mt-[-20px]">
        <Link 
          to="/" 
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-400 hover:text-amber-400 hover:border-amber-400 font-mono text-sm tracking-wider transition-all duration-300 shadow-md cursor-pointer"
        >
          <span>⬅️</span> {uiText.backBtn[lang]}
        </Link>
      </div>

      <h1 
        className="text-4xl md:text-5xl font-black text-amber-400 mb-7 mt-[-30px] tracking-widest text-center transition-all duration-300 font-nasalization"
      >
        {uiText.pageTitle[lang]}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4 mt-6">
        
        <Link 
          to="/guess-character/pixel" 
          className="flex flex-col items-center p-4 rounded-2xl border-2 border-red-500 bg-slate-900/30 backdrop-blur-md hover:bg-red-500/10 shadow-lg hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1 text-center cursor-pointer group"
        >
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800/50 mb-4 shadow-inner">
            <img 
              src="/assets/images/thumb-character1.png" 
              alt={uiText.pixelTitle[lang]} 
              className="w-full h-full object-fit group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <h2 className="text-2xl font-bold text-red-400 tracking-wide font-sans">{uiText.pixelTitle[lang]}</h2>
          <p className="text-slate-400 text-sm mt-2 font-medium leading-relaxed">{uiText.pixelDesc[lang]}</p>
        </Link>

        <Link 
          to="/guess-character/traits" 
          className="flex flex-col items-center p-4 rounded-2xl border-2 border-sky-400 bg-slate-900/30 backdrop-blur-md hover:bg-sky-400/10 shadow-lg hover:shadow-sky-400/10 transition-all duration-300 transform hover:-translate-y-1 text-center cursor-pointer group"
        >
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800/50 mb-4 shadow-inner">
            <img 
              src="/assets/images/thumb-character2.png" 
              alt={uiText.traitsTitle[lang]} 
              className="w-full h-full object-fit group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <h2 className="text-2xl font-bold text-sky-300 tracking-wide font-sans">{uiText.traitsTitle[lang]}</h2>
          <p className="text-slate-400 text-sm mt-2 font-medium leading-relaxed">{uiText.traitsDesc[lang]}</p>
        </Link>
        
      </div>
    </div>
  );
}
