import React, { useEffect } from 'react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);
  const mistakePath = [
    "/assets/gifs/mistake1.gif",
    "/assets/gifs/mistake2.gif",
    "/assets/gifs/mistake3.gif",
    "/assets/gifs/mistake4.gif"
  ];
  const gifPath = mistakePath[Math.floor(Math.random() * 4)] ;
  console.log(gifPath)
  return (
    <div className="fixed top-26 left-1/2 -translate-x-1/2 z-50 bg-red-600/10 backdrop-blur-md text-white font-black px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(220,38,38,0.3)] border-2 border-red-500/60 flex items-center gap-4 tracking-wide font-sans min-w-[280px] max-w-md">
      <div className="w-17 h-17 rounded-full overflow-hidden border-2 border-white/40 shadow-sm shrink-0 bg-slate-950">
        <img 
          src={gifPath} 
          alt="Searching..." 
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-sm md:text-base leading-tight font-semibold text-slate-100">
        {message}
      </p>
    </div>
  );
}
