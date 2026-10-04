import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext'; 
import animeData from '../data/animes.json';
import RulesModal from '../components/RulesModal';
import Toast from '../components/Toast';
import GameOverView from '../components/GameOverView';
import GuessInput from '../components/GuessInput';
import InfoBadges from '../components/InfoBadges';
import ImageHintsGrid from '../components/ImageHintsGrid';

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

  if (!currentAnime) return <p className="text-center text-slate-400 font-mono">Loading Galaxy Data...</p>;

  const localizedBadgeLabels = {
    age: uiText.badges.year[lang],
    planet: uiText.badges.planet[lang],
    gender: uiText.badges.length[lang],
    skill: uiText.badges.adaptations[lang]
  };

  const animeBadgeInfos = {
    age: currentAnime.infos.releaseYear,
    planet: currentAnime.infos.planet,
    gender: currentAnime.infos.episodes,
    specialSkill: currentAnime.infos.adaptations
  };

  return (
    <div className="w-full flex flex-col items-center relative">
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
      
      <div className="w-full flex justify-start mt-[-20px]">
        <Link 
          to="/" 
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-400 hover:text-amber-400 hover:border-amber-400 font-mono text-sm tracking-wider transition-all duration-300 shadow-md cursor-pointer"
        >
          <span>◀</span> {uiText.backBtn[lang]}
        </Link>
      </div>

      <h1 
        className="text-4xl md:text-5xl font-black text-amber-400 mb-7 mt-[-30px] tracking-widest text-center transition-all duration-300 font-nasalization"
      >
        {uiText.pageTitle[lang]}
      </h1>

      {gameStatus === "playing" ? (
        <div className="w-full flex flex-col items-center gap-6">
          {/* Reusable Badge Row */}
          <InfoBadges infos={animeBadgeInfos} labels={localizedBadgeLabels} />

          {/* Reusable Image Hints Grid / Mobile Slider with Flip Animation */}
          <ImageHintsGrid 
            hints={currentAnime.imageHints} 
            revealedCount={revealedHints} 
          />

          {/* Controls */}
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