import React from 'react';
import Header from './Header';
import SpaceBackground from './SpaceBackground';
import Footer from './Footer'; // Uses your pre-configured ready-to-use footer layout

export default function GameLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col text-white relative font-sans antialiased selection:bg-amber-500/30">
      
      {/* 🌌 Background layer stays locked beneath all page route views */}
      <SpaceBackground />

      {/* 🧭 Global Sticky Navigation Control Deck */}
      <Header />

      {/* 🎮 Dynamic Content Canvas Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-10 w-full max-w-7xl mx-auto transition-all duration-300">
        {children}
      </main>

      {/* 🚀 Global Credit Track Banners */}
      <Footer />

    </div>
  );
}
