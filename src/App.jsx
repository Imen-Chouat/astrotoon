import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext'; // 👈 Context Hook Added
import GameLayout from './components/GameLayout';
import Home from './pages/Home';
import GuessAnime from './pages/GuessAnime';
import GuessCharacterHub from './pages/GuessCharacterHub';
import GuessCharacterGame from './pages/GuessCharacterGame';
import GuessSong from './pages/GuessSong';

export default function App() {
  return (
    <LanguageProvider> 
      <Router>
        <GameLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guess-anime" element={<GuessAnime />} />
            <Route path="/guess-character" element={<GuessCharacterHub />} />
            <Route path="/guess-character/:mode" element={<GuessCharacterGame />} />
            <Route path="/guess-song" element={<GuessSong />} />
          </Routes>
        </GameLayout>
      </Router>
    </LanguageProvider>
  );
}
