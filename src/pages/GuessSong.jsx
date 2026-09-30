import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import songData from '../data/songs.json';
import RulesModal from '../components/RulesModal';
import { useLang } from '../context/LanguageContext';

const uiText = {
  backBtn: { en: "RETOURNER", ar: "العودة", fr: "RETOURNER" },
  title: { en: "GUESS THE SONG", ar: "خمن الأغنية", fr: "DEVINE LA CHANSON" },
  loading: { en: "Loading Audio Tracks...", ar: "جاري تحميل المقاطع الصوتية...", fr: "Chargement des pistes audio..." },
  idleDescription: {
    en: "Écoutez le premier extrait, puis devinez la suite avant la fin du temps !",
    ar: "استمع إلى المقطع الصوتي الأول، ثم خمن بقية الأغنية قبل انتهاء الوقت!",
    fr: "Écoutez le premier extrait, puis devinez la suite avant la fin du temps !"
  },
  startBtn: { en: "LANCER L'ÉCOUTE ▶️️", ar: "تشغيل الصوت ▶️", fr: "LANCER L'ÉCOUTE ▶️" },
  listeningStatus: { en: "ÉCOUTEZ EN COURS...", ar: "استمع الآن... المقطع يعمل", fr: "ÉCOUTEZ EN COURS..." },
  guessingTitle: { en: "DEVINEZ LA SUITE !", ar: "خمن البيت القادم!", fr: "DEVINEZ LA SUITE !" },
  guessingSub: {
    en: "The audio has paused. Discuss with your friends!",
    ar: "توقف الصوت مؤقتاً. تناقش مع أصدقائك!",
    fr: "L'audio est en pause. Discutez avec vos amis !"
  },
  startingLineLabel: { en: "PREMIÈRE LIGNE", ar: "بداية الأغنية", fr: "PREMIÈRE LIGNE" },
  timeRemaining: { en: "TEMPS RESTANT", ar: "الوقت المتبقي", fr: "TEMPS RESTANT" },
  identityLabel: { en: "IDENTITÉ DU DESSIN ANIMÉ", ar: "الهوية الصحيحة للكرتون", fr: "IDENTITÉ DU DESSIN ANIMÉ" },
  lyricsRevealLabel: { en: "RÉVÉLATION DE LA SUITE", ar: "تكملة كلمات الأغنية", fr: "RÉVÉLATION DE LA SUITE" },
  nextBtn: { en: "CHANSON SUIVANTE ", ar: "الأغنية التالية ", fr: "CHANSON SUIVANTE " }
};

export default function GuessSong() {
  const { lang } = useLang();

  const [currentSong, setCurrentSong] = useState(null);
  const [showRules, setShowRules] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  
  const [phase, setPhase] = useState("idle"); 

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  
  const SNIPPET_DURATION = 5; 

  useEffect(() => {
    pickRandomSong();
    return () => {
      clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleAudioProgress);
      }
    };
  }, []);

  const pickRandomSong = () => {
    let playedIds = JSON.parse(localStorage.getItem('astrotoon_played_songs') || "[]");
    let available = songData.filter(s => !playedIds.includes(s.id));

    if (available.length === 0) {
      localStorage.removeItem('astrotoon_played_songs');
      available = songData;
      playedIds = [];
    }

    const selected = available[Math.floor(Math.random() * available.length)];
    if (selected) {
      setCurrentSong(selected);
      playedIds.push(selected.id);
      localStorage.setItem('astrotoon_played_songs', JSON.stringify(playedIds));
    }

    setHasStarted(false);
    setTimeLeft(15);
    setPhase("idle");
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleAudioProgress = () => {
    if (!audioRef.current || phase === "revealed") return;

    if (audioRef.current.currentTime >= SNIPPET_DURATION) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('timeupdate', handleAudioProgress);
      setPhase("guessing");
      startCountdown();
    }
  };

  const startGameSequence = () => {
    if (!currentSong || hasStarted) return;
    setHasStarted(true);
    setPhase("listening");

    audioRef.current = new Audio(currentSong.audioPath);
    audioRef.current.addEventListener('timeupdate', handleAudioProgress);
    audioRef.current.play().catch(err => console.log("Audio playback issue. Check audio paths."));
  };

  const startCountdown = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUpReveal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUpReveal = () => {
    setPhase("revealed");
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio resume error"));
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      clearInterval(timerRef.current);
    };
  }, []);

  if (!currentSong) return <p className="text-center text-slate-400 font-mono mt-20">{uiText.loading[lang]}</p>;

  const progressPercentage = (timeLeft / 15) * 100;

  return (
    <div className="w-full max-w-5xl flex flex-col items-center py-4 px-4 relative min-h-[85vh]">
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      <div className="w-full relative flex items-center justify-center mb-8 md:mb-12">
        {/* Go Back Button Top-Left */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-700/80 bg-slate-900/80 text-slate-300 hover:text-amber-400 hover:border-amber-400 font-mono text-xs md:text-sm font-bold tracking-widest transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>⬅️</span> {uiText.backBtn[lang]}
          </Link>
        </div>

        <h1 
          className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-400 tracking-widest text-center px-12 font-nasalization drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]"
        >
          {uiText.title[lang]}
        </h1>
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center gap-6">
        
        <div className="w-full bg-slate-900/30 rounded-2xl border-2 min-h-100 border-amber-400 p-6 md:p-10 flex flex-col items-center text-center shadow-[6px_6px_0px_0px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-500 relative overflow-hidden backdrop-blur-md">
          
          {phase === "idle" && (
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md z-20 flex flex-col items-center justify-center min-h-100 p-6 md:p-8 text-center animate-fade-in">
              <img 
                src="/assets/gifs/music1.gif" 
                alt="Music Animation" 
                className="w-auto h-40 md:w-auto md:h-54 object-contain mb-4 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" 
              />
              <p className="text-slate-200 font-medium mb-6 text-xl md:text-2xl leading-relaxed">
                {uiText.idleDescription[lang]}
              </p>
              <button
                onClick={startGameSequence}
                className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl tracking-widest text-sm md:text-base shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.7)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                {uiText.startBtn[lang]}
              </button>
            </div>
          )}

          {phase === "listening" && (
            <div className="w-full flex flex-col items-center py-4 mb-2 animate-fade-in">
              <img 
                src="/assets/gifs/music2.gif" 
                alt="Playing Music" 
                className="w-auto h-44 md:w-auto md:h-48 object-contain mb-3 filter drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]" 
              />
              <h3 className="text-lg md:text-xl font-mono text-sky-400 tracking-widest font-black animate-pulse">
                {uiText.listeningStatus[lang]}
              </h3>
            </div>
          )}

          {phase === "guessing" && (
            <div className="w-full flex flex-col items-center py-2 mb-2 bg-amber-400/10 border border-amber-400/30 rounded-xl p-4 md:p-6 animate-fade-in shadow-inner">
              <img 
                src="/assets/gifs/music3.gif" 
                alt="Countdown Music" 
                className="w-auto h-40 md:w-auto md:h-44 object-contain mb-2 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" 
              />
              <h3 className="text-xl md:text-2xl font-black text-amber-400 tracking-wider mb-1">
                {uiText.guessingTitle[lang]}
              </h3>
              <p className="text-xs md:text-sm font-mono text-slate-400 uppercase tracking-widest">
                {uiText.guessingSub[lang]}
              </p>
            </div>
          )}

          <div className="w-full my-4 py-2 border-y border-slate-800/80">
            <span className="text-xs font-mono text-amber-400/80 uppercase tracking-widest block mb-2 font-semibold">
              {uiText.startingLineLabel[lang]}
            </span>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-relaxed font-sans px-2 tracking-wide">
              "{currentSong.visibleLyrics} ..."
            </p>
          </div>

          {phase === "guessing" && (
            <div className="w-full mt-4">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2 px-1">
                <span>{uiText.timeRemaining[lang]}</span>
                <span className="text-amber-400 font-bold text-sm">{timeLeft}s</span>
              </div>
              <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-sky-400 via-amber-400 to-amber-500 rounded-full transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {phase === "revealed" && (
            <div className="w-full border-t border-slate-800 pt-6 mt-2 animate-fade-in flex flex-col items-center gap-4">
              
              <div className="text-center">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-1">
                  {uiText.identityLabel[lang]}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-amber-400 tracking-wide mb-2">
                  {lang === 'ar'
                    ? `${currentSong.arabicName} (${currentSong.englishName})`
                    : `${currentSong.englishName} (${currentSong.arabicName})`}
                </h2>
              </div>

              <div className="bg-slate-950/80 p-4 md:p-5 rounded-xl border border-slate-800 w-full shadow-inner">
                <span className="text-xs font-mono text-amber-400/70 uppercase tracking-widest block mb-1">
                  {uiText.lyricsRevealLabel[lang]}
                </span>
                <p className="text-lg md:text-xl font-bold text-sky-300 leading-relaxed">
                  ... {currentSong.hiddenLyrics}
                </p>
              </div>

              {currentSong.gifUrl && (
                <img 
                  src={currentSong.gifUrl} 
                  alt="Anime Scene Layout" 
                  className="w-auto h-58 md:h-66 object-fit rounded-xl border-2 border-slate-800 shadow-lg mt-2"
                />
              )}
            </div>
          )}
        </div>
        {phase === "revealed" && (
          <button
            onClick={pickRandomSong}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 border-2 border-amber-400/60 hover:border-amber-400 text-amber-400 font-black rounded-xl tracking-widest transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] text-center text-sm md:text-base cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {uiText.nextBtn[lang]}
          </button>
        )}

      </div>
    </div>
  );
}