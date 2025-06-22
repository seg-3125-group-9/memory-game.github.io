import React, { useState, useEffect } from 'react';
import './App.css';

const FRUITS = ['🍎', '🍌', '🍉', '🥝', '🍐', '🍇', '🍊', '🍒', '🍍', '🥭', '🥥'];
const ANIMALS = ['🐶', '🐱', '🐰', '🐼', '🐸', '🐵', '🦊', '🐷', '🐤', '🦁', '🐢'];
const OBJECTS = ['🧸', '🧦', '👟', '🧽', '🔑', '📎', '📦', '🖍️', '🧴', '📱', '🔨'];

function App() {
  const [level, setLevel] = useState('');
  const [theme, setTheme] = useState('');
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [items, setItems] = useState([]);

  // Choose correct theme array
  const getThemeItems = () => {
    switch (theme) {
      case 'Fruits': return FRUITS;
      case 'Animals': return ANIMALS;
      case 'Objects': return OBJECTS;
      default: return [];
    }
  };

  // Configure game based on level
  const getGameSettings = () => {
    switch (level) {
      case 'Easy': return { count: 5, time: 60 };
      case 'Medium': return { count: 8, time: 90 };
      case 'Hard': return { count: 11, time: 120 };
      default: return { count: 0, time: 0 };
    }
  };

  // Start game
  const startGame = () => {
    const settings = getGameSettings();
    const themeItems = getThemeItems();
    const shuffled = [...themeItems].sort(() => 0.5 - Math.random()).slice(0, settings.count);
    setItems(shuffled);
    setTimeLeft(settings.time);
    setStarted(true);
  };

  // Timer countdown
  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [started, timeLeft]);

  // Quit game and reset
  const quitGame = () => {
    setStarted(false);
    setLevel('');
    setTheme('');
    setTimeLeft(0);
    setItems([]);
  };

  if (!started) {
    return (
      <div className={`App ${level && theme ? 'ready' : ''}`}>
        <h1 className="title">Welcome to Memory Blink!</h1>

        <div className="section">
          <h2>SELECT A LEVEL</h2>
          <div className="button-row">
            {['Easy', 'Medium', 'Hard'].map((lvl) => (
              <button
                key={lvl}
                className={`btn level ${level === lvl ? 'selected' : ''}`}
                onClick={() => setLevel(lvl)}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>SELECT A THEME</h2>
          <div className="button-row">
            {['Fruits', 'Animals', 'Objects'].map((t) => (
              <button
                key={t}
                className={`btn theme ${theme === t ? 'selected' : ''}`}
                onClick={() => setTheme(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <button
            className="btn start"
            onClick={startGame}
            disabled={!level || !theme}
          >
            START
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App game-screen">
      <div className="top-bar">
        <div>Level: <strong>{level}</strong></div>
        <div>Theme: <strong>{theme}</strong></div>
        <div className="timer">{`0:${timeLeft.toString().padStart(2, '0')}`}</div>
        <button className="btn quit" onClick={quitGame}>QUIT</button>
      </div>
      <div className="game-area">
        {items.map((emoji, idx) => (
          <div key={idx} className="game-icon">{emoji}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
