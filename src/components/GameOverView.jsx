    import React from 'react';
    import { useLang } from '../context/LanguageContext';

    const localizedContent = {
    nextBtn: {
        character: { en: "Next Character 🚀", ar: "الشخصية التالية 🚀", fr: "Personnage Suivant 🚀" },
        anime: { en: "Next Cartoon 🚀", ar: "الكرتون التالي 🚀", fr: "Dessin Animé Suivant 🚀" },
        song: { en: "Next Song 🚀", ar: "الأغنية التالية 🚀", fr: "Chanson Suivante 🚀" }
    },
    
    // --- SUBTEXT BODY SENTENCES CONTROLLERS ---
    wonText: {
        character: { en: "You nailed it! The correct character is", ar: "لقد أصبت! الشخصية الصحيحة هي", fr: "Excellent ! Le bon personnage était" },
        anime: { en: "You nailed it! The correct cartoon is", ar: "لقد أصبت! الكرتون الصحيح هو", fr: "Excellent ! Le bon dessin animé était" },
        song: { en: "You nailed it! The correct theme song belongs to", ar: "لقد أصبت! شارة البداية تنتمي لعمل", fr: "Excellent ! La chanson appartenait à" }
    },
    lostText: {
        character: { en: "Out of hints! The hidden character was", ar: "انتهت التلميحات! الشخصية المخفية كانت", fr: "Plus d'indices ! Le personnage mystère était" },
        anime: { en: "Out of hints! The hidden cartoon was", ar: "انتهت التلميحات! الكرتون المخفي كان", fr: "Plus d'indices ! Le dessin animé mystère était" },
        song: { en: "Out of hints! The hidden theme song was", ar: "انتهت التلميحات! الشارة المخفية كانت لعمل", fr: "Plus d'indices ! La chanson mystère était" }
    },
    revealedText: {
        character: { en: "Trust yourself next time! It was", ar: "ثق بنفسك في المرة القادمة! الإجابة هي", fr: "Faites-vous confiance la prochaine fois ! C'était" },
        anime: { en: "Trust yourself next time! It was", ar: "ثق بنفسك في المرة القادمة! الإجابة هي", fr: "Faites-vous confiance la prochaine fois ! C'était" },
        song: { en: "Trust yourself next time! It was", ar: "ثق بنفسك في المرة القادمة! الإجابة هي", fr: "Faites-vous confiance la prochaine fois ! C'était" }
    },

    // --- TOP DISPLAY TITLE HEADERS ---
    titles: {
        won: { en: "Brilliant! You Win!", ar: "رائع! لقد فزت!", fr: "Gagné ! Bravo !" },
        lost: { en: "Game Over!", ar: "انتهت اللعبة!", fr: "Partie Terminée !" },
        revealed: { en: "Knowledge Revealed", ar: "تم كشف الإجابة", fr: "Solution Révélée" }
    }
    };

    export default function GameOverView({ type = 'anime', status, anime, onRestart }) {
    const { lang } = useLang();
    
    const winGif = [
        "/assets/gifs/win.gif",
        "/assets/gifs/win1.gif",
        "/assets/gifs/win2.gif",
        "/assets/gifs/win3.gif",
        "/assets/gifs/win4.gif",
        "/assets/gifs/win5.gif",
        "/assets/gifs/win6.gif",
        "/assets/gifs/win7.gif",
        "/assets/gifs/win8.gif",
        "/assets/gifs/win9.gif",
        "/assets/gifs/win10.gif",
    ];
    const winpath = winGif[Math.floor(Math.random() * 11)]  ;
    const lossGif = [
        "/assets/gifs/loss1.gif",
        "/assets/gifs/loss2.gif",
        "/assets/gifs/loss3.gif"
    ];
    const losspath = lossGif[Math.floor(Math.random() * 3)]  ;
    const redoGif = [
        "/assets/gifs/redo1.gif",
        "/assets/gifs/redo2.gif",
        "/assets/gifs/redo3.gif",
        "/assets/gifs/redo4.gif",
    ];
    const redopath = redoGif[Math.floor(Math.random() * 4)] ;
    const statusColors = {
        won: "text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.2)]",
        lost: "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.2)]",
        revealed: "text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.2)]"
    };
    
    const statusGifs = {
        won: winpath,
        lost: losspath,
        revealed: redopath
    };

    const getBodyText = () => {
        const nameString = lang === 'ar' ? anime.arabicName : (anime.englishName || anime.arabicName);
        if (status === 'won') return `${localizedContent.wonText[type][lang]} ${nameString}.`;
        if (status === 'lost') return `${localizedContent.lostText[type][lang]} ${nameString}.`;
        return `${localizedContent.revealedText[type][lang]} ${nameString}.`;
    };

    return (
        <div className="flex flex-col items-center max-w-md w-full bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border-2 border-slate-800 text-center shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-fade-in">
        
        {/* HEADER HUD: Align Title and custom Status Trophy Gif side-by-side */}
        <div className="flex items-center gap-0 justify-center mb-4">
            <div className="w-25 h-auto rounded-lg overflow-hidden shrink-0">
            <img 
                src={statusGifs[status]} 
                alt="Status Reaction" 
                className="w-full h-full object-cover" 
            />
            </div>
            <h2 className={`text-xl md:text-2xl font-nasalization font-black tracking-wide ${statusColors[status]}`}>
            {localizedContent.titles[status][lang]}
            </h2>

        </div>
        
        <p className="text-slate-300 mb-6 font-medium leading-relaxed px-2">
            {getBodyText()}
        </p>
        
        {anime.gifUrl && (
            <div className="w-full h-70 rounded-xl overflow-hidden border-2 border-slate-800 bg-slate-950 mb-6 shadow-md transform hover:scale-[1.02] transition-transform duration-300">
            <img 
                src={anime.gifUrl} 
                alt="Correct Discovery reveal" 
                className="w-full h-full object-fit select-none pointer-events-none" 
            />
            </div>
        )}

        <button
            onClick={onRestart}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 hover:border-amber-400 border border-slate-700 text-amber-400 font-extrabold rounded-xl transition duration-300 font-nasalization shadow-md tracking-wider cursor-pointer"
        >
            {localizedContent.nextBtn[type][lang]}
        </button>

        </div>
    );
    }
