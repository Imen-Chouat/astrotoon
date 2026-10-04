import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext'; 

export default function Home() {
  const { lang } = useLang(); 
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const games = [
    { 
      path: "/guess-character/pixel", 
      image: "/assets/images/thumb-character1.png",
      glowColor: "hover:shadow-red-500/30 hover:border-red-400",
      activeGlow: "shadow-red-500/30 border-red-400",
      titles: {
        en: "Pixel Image Grid",
        ar: "مصفوفة الصور المكسلة",
        fr: "Grille d'Image Pixel"
      }
    },
    { 
      path: "/guess-character/traits", 
      image: "/assets/images/thumb-character2.png",
      glowColor: "hover:shadow-sky-500/30 hover:border-sky-400",
      activeGlow: "shadow-sky-500/30 border-sky-400",
      titles: {
        en: "Characteristic Cards",
        ar: "بطاقات المعلومات",
        fr: "Cartes des Caractéristiques"
      }
    },
    { 
      path: "/guess-anime", 
      image: "/assets/images/thumb-cartoon.png",
      glowColor: "hover:shadow-amber-500/30 hover:border-amber-400",
      activeGlow: "shadow-amber-500/30 border-amber-400",
      titles: {
        en: "Guess the Cartoon",
        ar: "خمن الكرتون",
        fr: "Devine le Dessin Animé"
      }
    },
  ];

  return (
    <div className="flex flex-col items-center w-full py-8">
      {/* Container with Flex layout for smooth sizing transitions */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-6xl px-4">
        {games.map((game, idx) => {
          const isHovered = hoveredIdx === idx;
          const isAnotherHovered = hoveredIdx !== null && !isHovered;

          return (
            <Link 
              key={idx} 
              to={game.path}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 bg-sky-400/10 backdrop-blur-md transition-all duration-500 ease-out shadow-lg w-full ${
                isHovered 
                  ? `md:w-[42%] scale-105 z-10 ${game.activeGlow}` 
                  : isAnotherHovered 
                    ? "md:w-[28%] scale-95 opacity-70 border-sky-100/20" 
                    : "md:w-[33.33%] scale-100 border-sky-100/30"
              }`}
            >
              {/* Aspect Ratio Container fixed to 16:9 (1920x1080 proportional) */}
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800/50">
                <img 
                  src={game.image} 
                  alt={game.titles[lang]} 
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isHovered ? "scale-110" : "scale-100"
                  }`}
                />
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold text-slate-200 mt-4 mb-2 tracking-wide text-center transition-colors duration-300">
                {game.titles[lang]}
              </h2>
            </Link>
          );
        })}
      </div>
    </div>
  );
}