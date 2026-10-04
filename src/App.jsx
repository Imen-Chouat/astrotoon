import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import GameLayout from './components/GameLayout';
import Home from './pages/Home';
import GuessAnime from './pages/GuessAnime';
import GuessCharacterGame from './pages/GuessCharacterGame';


export default function App() {
  return (
    <LanguageProvider> 
      <Router>
        <GameLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guess-anime" element={<GuessAnime />} />
            <Route path="/guess-character/:mode" element={<GuessCharacterGame />} />
          </Routes>
        </GameLayout>
      </Router>
    </LanguageProvider>
  );
}