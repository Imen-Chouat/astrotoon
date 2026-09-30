import React, { useState } from 'react';
import { useLang } from '../context/LanguageContext'; 
const translations = {
  en: {
    title: "How to Play: Guess the Cartoon",
    desc: "You will be given 4 static random technical info traits about a Spacetoon cartoon. Below them are 4 face-down image cards. Click 'Reveal Hint' to flip a card. Try to guess the title with as few hints as possible!",
    btn: "I Understand, Let's Play!"
  },
  ar: {
    title: "طريقة اللعب: خمن الكرتون",
    desc: "ستحصل على 4 معلومات أساسية وثابتة حول عمل كرتوني من سبيستون. في الأسفل توجد 4 بطاقات صور مخفية. اضغط على 'كشف تلميح' لقلب البطاقة. حاول تخمين الاسم بأقل عدد ممكن من التلميحات!",
    btn: "فهمت، لنبدأ اللعب!"
  },
  fr: {
    title: "Comment Jouer: Devine le Dessin Animé",
    desc: "Vous recevrez 4 informations textuelles fixes sur un dessin animé Spacetoon. En dessous se trouvent 4 cartes d'images cachées. Cliquez sur 'Révéler un indice' pour retourner une carte. Devinez avec le moins d'indices possible!",
    btn: "J'ai compris, Jouons !"
  }
};

export default function RulesModal({ onClose }) {
  const { lang: globalLang } = useLang(); 

  const [localLang, setLocalLang] = useState(globalLang);

  return (
    <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl max-w-lg w-full text-center shadow-2xl relative">

        <div className="flex justify-center gap-2 mb-6">
          {['en', 'ar', 'fr'].map((l) => (
            <button
              key={l}
              onClick={() => setLocalLang(l)}
              className={`px-3 py-1 rounded-md text-xs font-mono font-bold uppercase cursor-pointer transition ${
                localLang === l ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-black text-amber-400 mb-4">{translations[localLang].title}</h2>
        <p className="text-slate-300 leading-relaxed mb-6 font-medium">{translations[localLang].desc}</p>
        
        <button
          onClick={onClose}
          className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl tracking-wider transition duration-300 cursor-pointer"
        >
          {translations[localLang].btn}
        </button>
      </div>
    </div>
  );
}
