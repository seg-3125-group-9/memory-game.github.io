import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const FRUITS = ["🍎", "🍌", "🍉", "🥝", "🍐", "🍇", "🍊", "🍒", "🍍", "🥭", "🥥"];
const ANIMALS = ["🐶", "🐱", "🐰", "🐼", "🐸", "🐵", "🦊", "🐷", "🐤", "🦁", "🐢"];
const OBJECTS = ["🧸", "🧦", "👟", "🧽", "🔑", "📎", "📦", "🖍️", "🧴", "📱", "🔨"];

const EMOJI_NAMES = {
  // Fruits
  "🍎": "apple", "🍌": "banana", "🍉": "watermelon", "🥝": "kiwi", "🍐": "pear",
  "🍇": "grape", "🍊": "orange", "🍒": "cherry", "🍍": "pineapple", "🥥": "coconut",
  "🍓": "strawberry", "🍋": "lemon", "🍅": "tomato",

  // Animals
  "🐶": "dog", "🐱": "cat", "🐼": "panda", "🐸": "frog", "🐵": "monkey",
  "🦊": "fox", "🐷": "pig", "🦁": "lion", "🐢": "turtle", "🐧": "penguin",
  "🐮": "cow", "🐔": "chicken", "🐍": "snake", "🦆": "duck",

  // Objects
  "👟": "shoe", "🔑": "key", "📦": "box", "🖍️": "crayon",
  "📱": "phone", "🔨": "hammer", "🎈": "balloon", "📕": "book",
  "🎲": "dice", "🥄": "spoon", "🏆": "trophy", "🥨": "pretzel", "🚗": "car"
};


function App() {
  const [level, setLevel] = useState("");
  const [theme, setTheme] = useState("");
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [items, setItems] = useState([]);
  const [phase, setPhase] = useState("countdown");
  const [shuffledMinusOne, setShuffledMinusOne] = useState([]);
  const [omittedItem, setOmittedItem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [resultMessage, setResultMessage] = useState("");

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const [answerChecked, setAnswerChecked] = useState(false);


  const getThemeItems = () => {
    switch (theme) {
      case "Fruits": return FRUITS;
      case "Animals": return ANIMALS;
      case "Objects": return OBJECTS;
      default: return [];
    }
  };

  const getGameSettings = () => {
    switch (level) {
      case "Easy": return { count: 5, time: 15 };
      case "Medium": return { count: 8, time: 30 };
      case "Hard": return { count: 11, time: 60 };
      default: return { count: 0, time: 0 };
    }
  };

  const generateNewItems = () => {
    const { count } = getGameSettings();
    const themeItems = getThemeItems();
    return [...themeItems].sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const startGame = () => {
    const settings = getGameSettings();
    const newItems = generateNewItems();
    setItems(newItems);
    setTimeLeft(settings.time);
    setStarted(true);
    setPhase("countdown");
    setShuffledMinusOne([]);
    setOmittedItem(null);
    setUserAnswer("");
    setResultMessage("");
  };

  const quitGame = () => {
    setStarted(false);
    setLevel("");
    setTheme("");
    setTimeLeft(0);
    setItems([]);
    setPhase("countdown");
    setShuffledMinusOne([]);
    setOmittedItem(null);
    setUserAnswer("");
    setResultMessage("");
    setAnswerChecked(false);

    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
    
  };

  const playAgain = () => {
    setItems(generateNewItems());
    const settings = getGameSettings();
    setTimeLeft(settings.time);
    setPhase("countdown");
    setShuffledMinusOne([]);
    setOmittedItem(null);
    setUserAnswer("");
    setResultMessage("");
    setAnswerChecked(false);
  };

  useEffect(() => {
    if (!started || phase !== "countdown") return;
    if (timeLeft === 0) {
      setPhase("timeUp");
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timeLeft, started, phase]);

  useEffect(() => {
    if (phase !== "timeUp") return;

    timeoutRef.current = setTimeout(() => {
      let shuffled = [...items].sort(() => 0.5 - Math.random());
      const omitIndex = Math.floor(Math.random() * shuffled.length);
      const omitted = shuffled.splice(omitIndex, 1)[0];
      setOmittedItem(omitted);
      setShuffledMinusOne(shuffled);
      setPhase("showMinusOne");
    }, 3000);

    return () => clearTimeout(timeoutRef.current);
  }, [phase, items]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCheck = () => {
    if (answerChecked) return;

    const cleanedAnswer = userAnswer.trim().toLowerCase();
    const correctAnswer = EMOJI_NAMES[omittedItem]?.toLowerCase();

    if (cleanedAnswer === correctAnswer) {
      setResultMessage("Correct!");
    } else {
      setResultMessage(`Wrong. The answer was ${correctAnswer}.`);
    }

    setAnswerChecked(true);
  };


  if (!started) {
    return (
      <div className={`App ${level && theme ? "ready" : ""}`}>
        <h1 className="title">Welcome to Memory Blink!</h1>

        <div style={{
          backgroundColor: "white",
          border: "2px solid black",
          padding: "20px",
          margin: "20px 0",
          maxWidth: "700px",
          textAlign: "center",
          fontFamily: "'Comfortaa', cursive",
          borderRadius: "8px"
        }}>
          <h2 style={{ color: "#c0392b", marginTop: 0 }}>HOW TO PLAY</h2>
          <p style={{ fontSize: "1.1rem", color: "#333" }}>
            Memorize the items on the screen (there's a timer at the top).<br />
            After they disappear, they will come back but one will be missing!<br />
            Type the name of the missing object.
          </p>
        </div>



        <div className="section">
          <h2>SELECT A LEVEL</h2>
          <div className="button-row">
            {["Easy", "Medium", "Hard"].map((lvl) => (
              <button
                key={lvl}
                className={`btn level ${level === lvl ? "selected" : ""}`}
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
            {["Fruits", "Animals", "Objects"].map((t) => (
              <button
                key={t}
                className={`btn theme ${theme === t ? "selected" : ""}`}
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
        <div className="left-info">
          <div>Level: <strong>{level}</strong></div>
          <div>Theme: <strong>{theme}</strong></div>
        </div>
        <div className="timer">{formatTime(timeLeft)}</div>
        <div className="right-info">
          <button className="btn quit" onClick={quitGame}>QUIT</button>
        </div>
      </div>

      {phase === "timeUp" ? (
        <div className="times-up-message">
          <h1>TIME'S UP!</h1>
          <p>The images will reappear shortly.</p>
        </div>
      ) : phase === "showMinusOne" ? (
        <>
          <div className="game-area">
            {shuffledMinusOne.map((emoji, idx) => (
              <div key={idx} className="game-icon">{emoji}</div>
            ))}
          </div>

          <div
            style={{
              marginTop: 40,
              textAlign: "center",
              fontSize: 25,
              fontFamily: "'Courier New', Courier, monospace",
              fontWeight: "bold",
              color: "#000"
            }}
          >
            <div style={{ marginBottom: 8 }}>Which object is missing?</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: "normal" }}>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                style={{
                  fontSize: 25,
                  fontFamily: "'Courier New', Courier, monospace",
                  fontWeight: "normal",
                  padding: "6px 10px",
                  border: "1.5px solid black",
                  borderRadius: 4,
                  backgroundColor: "white",
                  minWidth: 220
                }}
                placeholder="Type your answer"
              />
              <button
                onClick={handleCheck}
                className="btn"
                style={{
                  backgroundColor: "#a4e6a1",
                  color: "black",
                  fontWeight: "bold",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  boxShadow: "2px 4px 6px rgba(0,0,0,0.2)",
                  fontSize: 18,
                  fontFamily: "'Courier New', Courier, monospace"
                }}
              >
                CHECK
              </button>
            </div>

            {resultMessage && (
              <>
                <div style={{ marginTop: 12, fontSize: 25 }}>{resultMessage}</div>
                <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: "20px" }}>
                  <button
                    onClick={playAgain}
                    className="btn"
                    style={{
                      backgroundColor: "#f9a4bc",
                      color: "black",
                      fontWeight: "bold",
                      padding: "10px 20px",
                      fontSize: "16px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Courier New', Courier, monospace"
                    }}
                  >
                    PLAY AGAIN
                  </button>
                  <button
                    onClick={quitGame}
                    className="btn"
                    style={{
                      backgroundColor: "#f9a4bc",
                      color: "black",
                      fontWeight: "bold",
                      padding: "10px 20px",
                      fontSize: "16px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'Courier New', Courier, monospace"
                    }}
                  >
                    BACK TO MENU
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="game-area">
          {items.map((emoji, idx) => (
            <div key={idx} className="game-icon">{emoji}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
