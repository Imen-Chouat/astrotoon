import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext'; 

export default function Home() {
  const { lang } = useLang(); 

  const games = [
    { 
      path: "/guess-character", 
      image: "/assets/images/thumb-character.png",
      glowColor: "hover:shadow-amber-500/20 hover:border-amber-400",
      titles: {
        en: "Guess the Character",
        ar: "خمن الشخصية",
        fr: "Devine le Personnage"
      }
    },
    { 
      path: "/guess-anime", 
      image: "/assets/images/thumb-cartoon.png",
      glowColor: "hover:shadow-sky-500/20 hover:border-sky-400",
      titles: {
        en: "Guess the Cartoon",
        ar: "خمن الكرتون",
        fr: "Devine le Dessin Animé"
      }
    },
    { 
      path: "/guess-song", 
      image: "/assets/images/thumb-song.png",
      glowColor: "hover:shadow-pink-500/20 hover:border-pink-500",
      titles: {
        en: "Complete the Song",
        ar: "خمن تكملة الأغنية",
        fr: "Complète la Chanson"
      }
    },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      {/* 3-Cube Side-by-Side Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4 mb-3">
        {games.map((game, idx) => (
          <Link 
            key={idx} 
            to={game.path}
            className={`flex flex-col items-center p-3 rounded-2xl border-2 border-sky-100/30 bg-sky-400/10 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-2 shadow-lg ${game.glowColor}`}
          >
            <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800/50">
              <img 
                src={game.image} 
                alt={game.titles[lang]} 
                className="w-full h-full object-fit hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Title text updates dynamically based on the current language parameter selection */}
            <h2 className="text-2xl font-bold text-slate-200 mt-4 mb-2 tracking-wide text-center">
              {game.titles[lang]}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
