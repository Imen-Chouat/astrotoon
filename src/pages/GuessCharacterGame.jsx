import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import characterData from '../data/characters.json';
import RulesModal from '../components/RulesModal';
import Toast from '../components/Toast';
import GameOverView from '../components/GameOverView';
import GuessInput from '../components/GuessInput';
import InfoBadges from '../components/InfoBadges';
import ImageHintsGrid from '../components/ImageHintsGrid';
import { useLang } from '../context/LanguageContext';

const GRID_SLICES = [
  "polygon(0% 50%, 33.33% 50%, 33.33% 100%, 0% 100%)",     // Slice 4: Bottom Left
  "polygon(33.33% 0%, 66.66% 0%, 66.66% 50%, 33.33% 50%)", // Slice 2: Top Center
  "polygon(66.66% 50%, 100% 50%, 100% 100%, 66.66% 100%)" , // Slice 6: Bottom Right
  "polygon(33.33% 50%, 66.66% 50%, 66.66% 100%, 33.33% 100%)", // Slice 5: Bottom Center
  "polygon(0% 0%, 33.33% 0%, 33.33% 50%, 0% 50%)",       // Slice 1: Top Left
  "polygon(66.66% 0%, 100% 0%, 100% 50%, 66.66% 50%)",     // Slice 3: Top Right
];

const uiText = {
  backBtn: { en: "OPTIONS MENU", ar: "قائمة الخيارات", fr: "MENU OPTIONS" },
  pixelTitle: { en: "PIXEL REVEAL CHALLENGE", ar: "تحدي كشف الصورة المكسلة", fr: "DÉFI RÉVÉLATION PIXEL" },
  traitsTitle: { en: "TRAITS MATCH CHALLENGE", ar: "تحدي مطابقة الملاحظات", fr: "DÉFI DES CARACTÉRISTIQUES" },
  connecting: { en: "Connecting to Space Satellite...", ar: "جاري الاتصال بالقمري الفضائي...", fr: "Connexion au satellite spatial..." },
  incorrectGuess: {
    en: "Try Again! Keep searching your memories...",
    ar: "حاول مجدداً! ابحث جيداً في ذكرياتك...",
    fr: "Réessayez ! Cherchez dans vos souvenirs..."
  },
  revealBtn: { en: "Reveal Hint", ar: "كشف تلميح", fr: "Révéler l'indice" },
  hintsLeft: { en: "Left", ar: "متبقي", fr: "Restant" },
  giveUpBtn: { en: "Give Up / Show", ar: "استسلام / إظهار", fr: "Abandonner / Afficher" },
  inputPlaceholder: { en: "Identify the character...", ar: "حدد هوية الشخصية...", fr: "Identifiez le personnage..." },
  badges: {
    age: { en: "Est. Age", ar: "العمر التقديري", fr: "Âge estimé" },
    planet: { en: "Spacetoon Planet", ar: "كوكب سبيستون", fr: "Planète Spacetoon" },
    gender: { en: "Gender Archetype", ar: "الجنس", fr: "Genre" },
    skill: { en: "Special Skill", ar: "المهارة الخاصة", fr: "Compétence spéciale" }
  }
};

export default function GuessCharacterGame() {
  const { lang } = useLang();
  const { mode } = useParams();
  const isPixelMode = mode === 'pixel';

  const [currentChar, setCurrentChar] = useState(null);
  const [pixelHintsRevealed, setPixelHintsRevealed] = useState(1);
  const [traitHintsRevealed, setTraitHintsRevealed] = useState(0);
  const [showRules, setShowRules] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [gameStatus, setGameStatus] = useState("playing");

  useEffect(() => {
    pickRandomCharacter();
  }, [mode]);

  const pickRandomCharacter = () => {
    let playedIds = JSON.parse(localStorage.getItem('astrotoon_played_chars') || "[]");
    let available = characterData.filter(c => !playedIds.includes(c.id));

    if (available.length === 0) {
      localStorage.removeItem('astrotoon_played_chars');
      available = characterData;
      playedIds = [];
    }

    const selected = available[Math.floor(Math.random() * available.length)];
    if (selected) {
      setCurrentChar(selected);
      playedIds.push(selected.id);
      localStorage.setItem('astrotoon_played_chars', JSON.stringify(playedIds));
    }

    setPixelHintsRevealed(1);
    setTraitHintsRevealed(0);
    setGameStatus("playing");
  };

  const handleGuess = (cleanedValue) => {
    if (currentChar.acceptedNames.includes(cleanedValue)) {
      setGameStatus("won");
    } else {
      if (isPixelMode) {
        const nextHint = pixelHintsRevealed + 1;
        setPixelHintsRevealed(nextHint);
        if (nextHint >= 6) {
          setGameStatus("lost");
          return;
        }
      } else {
        if (traitHintsRevealed === 4) {
          setGameStatus("lost");
          return;
        }
      }
      setToastMessage(uiText.incorrectGuess[lang]);
    }
  };

  const incrementHint = () => {
    if (isPixelMode) {
      const nextHint = pixelHintsRevealed + 1;
      setPixelHintsRevealed(nextHint);
      if (nextHint >= 6) {
        setGameStatus("lost");
      }
    } else {
      const nextHint = traitHintsRevealed + 1;
      setTraitHintsRevealed(nextHint);
    }
  };

  useEffect(() => {
    if (!isPixelMode && traitHintsRevealed === 4 && toastMessage) {
      setGameStatus("lost");
    }
  }, [traitHintsRevealed, toastMessage, isPixelMode]);

  if (!currentChar) {
    return <p className="text-center text-slate-400 font-mono">{uiText.connecting[lang]}</p>;
  }

  const remainingHints = (isPixelMode ? 6 : 4) - (isPixelMode ? pixelHintsRevealed : traitHintsRevealed);

  const localizedBadgeLabels = {
    age: uiText.badges.age[lang],
    planet: uiText.badges.planet[lang],
    gender: uiText.badges.gender[lang],
    skill: uiText.badges.skill[lang]
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
          <span></span> {uiText.backBtn[lang]}
        </Link>
      </div>

      <h1 className="text-4xl md:text-5xl font-black text-amber-400 mb-7 mt-[-30px] tracking-widest text-center transition-all duration-300 font-nasalization">
        {isPixelMode ? uiText.pixelTitle[lang] : uiText.traitsTitle[lang]}
      </h1>

      {gameStatus === "playing" ? (
        <div className="w-full flex flex-col items-center gap-6">
          {isPixelMode ? (
            <div className="relative w-80 h-80 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)] bg-slate-950/40">
              {GRID_SLICES.map((clipStyle, index) => {
                const isSliceVisible = index < pixelHintsRevealed;
                return (
                  <img
                    key={index}
                    src={currentChar.imagePath}
                    alt=""
                    className="absolute inset-0 w-full h-full object-fit select-none pointer-events-none transition-all duration-500"
                    style={{
                      clipPath: clipStyle,
                      opacity: isSliceVisible ? 1 : 0,
                      transform: isSliceVisible ? "scale(1)" : "scale(0.95)"
                    }}
                  />
                );
              })}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 opacity-10 pointer-events-none border border-slate-400">
                {[...Array(6)].map((_, i) => <div key={i} className="border border-slate-400" />)}
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-8">
              <InfoBadges infos={currentChar.infos} labels={localizedBadgeLabels} />
              <ImageHintsGrid hints={currentChar.imageHints} revealedCount={traitHintsRevealed} />
            </div>
          )}

          <div className="flex gap-4 w-full max-w-md justify-center mt-1 px-4">
            <button
              onClick={incrementHint}
              disabled={isPixelMode ? pixelHintsRevealed >= 6 : traitHintsRevealed >= 4}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 text-amber-400 font-bold rounded-xl transition text-sm shadow-md cursor-pointer"
            >
              {uiText.revealBtn[lang]} ({remainingHints} {uiText.hintsLeft[lang]})
            </button>
            <button
              onClick={() => setGameStatus("revealed")}
              className="flex-1 py-3 bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 text-red-400 font-bold rounded-xl transition text-sm shadow-md cursor-pointer"
            >
              {uiText.giveUpBtn[lang]}
            </button>
          </div>

          <div className="w-full px-4">
            <GuessInput placeholder={uiText.inputPlaceholder[lang]} onGuessSubmit={handleGuess} />
          </div>
        </div>
      ) : (
        <GameOverView status={gameStatus} anime={currentChar} onRestart={pickRandomCharacter} />
      )}
    </div>
  );
}