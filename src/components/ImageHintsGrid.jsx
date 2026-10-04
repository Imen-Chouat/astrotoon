import React, { useState } from 'react';

export default function ImageHintsGrid({ hints, revealedCount, placeholderImg = "/assets/images/cartoonHidden1.png" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? hints.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === hints.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full px-2 flex flex-col items-center">
      <div className="block md:hidden w-full max-w-xs">
        <div className="flex items-center justify-between gap-3 mb-3">
          <button
            onClick={prevSlide}
            className="p-3 bg-slate-800/80 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl transition shadow-md active:scale-95 cursor-pointer"
            aria-label="Previous image hint"
          >
            ◀
          </button>

          <span className="text-xs font-mono text-slate-400 font-bold tracking-widest">
            {activeIndex + 1} / {hints.length}
          </span>

          <button
            onClick={nextSlide}
            className="p-3 bg-slate-800/80 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl transition shadow-md active:scale-95 cursor-pointer"
            aria-label="Next image hint"
          >
            ▶
          </button>
        </div>

        {hints.map((src, index) => {
          if (index !== activeIndex) return null;
          const isRevealed = index < revealedCount;

          return (
            <div key={index} className="aspect-square w-full rounded-2xl min-h-[260px] [perspective:1000px]">
              <div
                className={`relative w-full h-full rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] ${
                  isRevealed ? '[transform:rotateY(180deg)]' : ''
                }`}
              >
                <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-inner [backface-visibility:hidden]">
                  <img
                    src={placeholderImg}
                    alt="Hidden Card Placement"
                    className="w-full h-full object-fit scale-95 opacity-80"
                  />
                </div>

                <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <img
                    src={isRevealed ? src : placeholderImg}
                    alt="Hint Asset"
                    className="w-full h-full object-fit"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden md:grid md:grid-cols-4 gap-4 w-full">
        {hints.map((src, index) => {
          const isRevealed = index < revealedCount;
          return (
            <div
              key={index}
              className="aspect-square w-full rounded-2xl min-w-50 min-h-90 [perspective:1000px]"
            >
              <div
                className={`relative w-full h-full rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] ${
                  isRevealed ? '[transform:rotateY(180deg)]' : ''
                }`}
              >
                {/* Front (Hidden) */}
                <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-inner [backface-visibility:hidden]">
                  <img
                    src={placeholderImg}
                    alt="Hidden Card Placement"
                    className="w-full h-full object-fit scale-95 opacity-80"
                  />
                </div>

                {/* Back (Revealed) */}
                <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 shadow-md hover:scale-105 hover:shadow-[0_0_25px_rgba(56,189,248,0.3)] transition-all [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <img
                    src={isRevealed ? src : placeholderImg}
                    alt="Hint Asset"
                    className="w-full h-full object-fit"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}