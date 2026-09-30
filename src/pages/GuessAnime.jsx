import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext'; 
import animeData from '../data/animes.json';
import RulesModal from '../components/RulesModal';
import Toast from '../components/Toast';
import GameOverView from '../components/GameOverView';
import GuessInput from '../components/GuessInput';

// 🌍 Localized UI Translation Resource Maps
const uiText = {
  pageTitle: { en: "Guess the Cartoon", ar: "خمن الكرتون", fr: "Devine le Dessin Animé" },
  backBtn: { en: "Go Back", ar: "العودة", fr: "Retour" },
  hintsLeft: { en: "Left", ar: "متبقي", fr: "Restant" },
  revealBtn: { en: "Reveal Hint", ar: "كشف تلميح", fr: "Révéler l'indice" },
  giveUpBtn: { en: "Give Up / Show", ar: "استسلام / إظهار", fr: "Abandonner / Afficher" },
  inputPlaceholder: { en: "Enter cartoon title...", ar: "أدخل اسم الكرتون...", fr: "Entrez le titre..." },
  wrongGuess: { en: "Try Again! Keep searching your memories...", ar: "حاول مجدداً! ابحث جيداً في ذكرياتك...", fr: "Réessayez ! Cherchez dans vos souvenirs..." },
  badges: {
    year: { en: "Creation Year", ar: "سنة الإنتاج", fr: "Année de Création" },
    planet: { en: "Spacetoon Planet", ar: "كوكب سبيستون", fr: "Planète Spacetoon" },
    length: { en: "Length", ar: "عدد الحلقات", fr: "Nombre d'Épisodes" },
    adaptations: { en: "Adaptations", ar: "النسخ الأخرى", fr: "Adaptations" }
  }
};

export default function GuessAnime() {
  const { lang } = useLang(); 

  const [currentAnime, setCurrentAnime] = useState(null);
  const [revealedHints, setRevealedHints] = useState(0);
  const [showRules, setShowRules] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [gameStatus, setGameStatus] = useState("playing");

  useEffect(() => {
    pickRandomAnime();
  }, []);

  const pickRandomAnime = () => {
    let playedIds = JSON.parse(localStorage.getItem('astrotoon_played_animes') || "[]");
    let available = animeData.filter(a => !playedIds.includes(a.id));

    if (available.length === 0) {
      localStorage.removeItem('astrotoon_played_animes');
      available = animeData;
      playedIds = [];
    }

    const selected = available[Math.floor(Math.random() * available.length)];
    if (selected) {
      setCurrentAnime(selected);
      playedIds.push(selected.id);
      localStorage.setItem('astrotoon_played_animes', JSON.stringify(playedIds));
    }
    
    setRevealedHints(0);
    setGameStatus("playing");
  };

  const handleGuess = (cleanedValue, rawValue) => {
    if (currentAnime.acceptedNames.includes(cleanedValue)) {
      setGameStatus("won");
    } else {
      setToastMessage(uiText.wrongGuess[lang]); 
    }
  };

  const incrementHint = () => {
    if (revealedHints < 4) {
      const nextHint = revealedHints + 1;
      setRevealedHints(nextHint);
    }
  };

  useEffect(() => {
    if (revealedHints === 4 && toastMessage) {
      setGameStatus("lost");
    }
  }, [revealedHints, toastMessage]);

  if (!currentAnime) return <p className="text-center text-slate-400">Loading Galaxy Data...</p>;

  return (
    <div className="w-full flex flex-col items-center relative">
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
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

      {gameStatus === "playing" ? (
        <div className="w-full flex flex-col items-center gap-6">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full px-4">
            {[
              { label: uiText.badges.year[lang], val: currentAnime.infos.releaseYear },
              { label: uiText.badges.planet[lang], val: currentAnime.infos.planet },
              { label: uiText.badges.length[lang], val: currentAnime.infos.episodes },
              { label: uiText.badges.adaptations[lang], val: currentAnime.infos.adaptations }
            ].map((info, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/80 px-4 py-2.5 rounded-xl border-2 border-amber-400 text-center shadow-[4px_4px_0px_0px_rgba(56,189,248,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(56,189,248,0.3)] transition-all duration-300 group cursor-default"
              >
                <span className="text-[10px] md:text-xs font-mono text-slate-400 uppercase block tracking-wider transition-colors group-hover:text-amber-400">
                  {info.label}
                </span>
                <span className="text-sm font-black text-white block truncate">
                  {info.val}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full px-4 max-w-3xl">
            {currentAnime.imageHints.map((src, index) => {
              const isRevealed = index < revealedHints;
              return (
                <div 
                  key={index} 
                  className={`aspect-square w-full rounded-2xl min-h-60 overflow-hidden border-2 bg-slate-950 relative transition-all duration-300 ${
                    isRevealed 
                      ? 'border-slate-700 shadow-md hover:scale-105 hover:shadow-[0_0_25px_rgba(56,189,248,0.3)]' 
                      : 'border-slate-800 shadow-inner'
                  }`}
                >
                  <img 
                    src={isRevealed ? src : "/assets/images/cartoonHidden1.png"} 
                    alt={isRevealed ? "Hint Asset" : "Hidden Card Placement"} 
                    className={`w-full h-full object-fit transition-all duration-500 ${isRevealed ? 'animate-fade-in scale-100' : 'scale-95 opacity-80'}`} 
                  />
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 w-full max-w-md justify-center px-4">
            <button
              onClick={incrementHint}
              disabled={revealedHints >= 4}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 text-amber-400 font-bold rounded-xl transition text-sm shadow-md cursor-pointer"
            >
              {uiText.revealBtn[lang]} ({4 - revealedHints} {uiText.hintsLeft[lang]})
            </button>
            <button
              onClick={() => setGameStatus("revealed")}
              className="flex-1 py-3 bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 text-red-400 font-bold rounded-xl transition text-sm shadow-md cursor-pointer"
            >
              {uiText.giveUpBtn[lang]}
            </button>
          </div>

          {/* User Input Submission Form */}
          <div className="w-full px-4">
            <GuessInput placeholder={uiText.inputPlaceholder[lang]} onGuessSubmit={handleGuess} />
          </div>
        </div>
      ) : (
        <GameOverView status={gameStatus} anime={currentAnime} onRestart={pickRandomAnime} />
      )}
    </div>
  );
}
