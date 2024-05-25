import React, { useState, useEffect } from "react";
import "./Game.css"; // Import the CSS file

const Game = () => {
  const [word, setWord] = useState("");
  const [wordColor, setWordColor] = useState("");
  const [answers, setAnswers] = useState([]);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds = 1 minute 30 seconds
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // Track if the game has started

  useEffect(() => {
    startNewRound();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }

    if (gameStarted) {
      const intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [timeLeft, gameStarted]);

  const generateRandomWord = () => {
    const wordOptions = ["BLUE", "RED"];
    return wordOptions[Math.floor(Math.random() * wordOptions.length)];
  };

  const generateRandomColor = () => {
    const colorOptions = ["blue", "red"];
    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
  };

  const startNewRound = () => {
    const newWord = generateRandomWord();
    const newWordColor = generateRandomColor();

    const newAnswers = ["BLUE", "RED"].map((answer) => ({
      text: answer,
      color: generateRandomColor(),
    }));

    setWord(newWord);
    setWordColor(newWordColor);
    setAnswers(newAnswers);
    setMessage("");
  };

  const handleAnswerClick = (selectedAnswer) => {
    if (timeLeft <= 0) return; // Prevent answering if time is up

    if (!gameStarted) {
      setGameStarted(true); // Start the timer on the first click
    }

    if (selectedAnswer.text.toLowerCase() === wordColor) {
      setScore(score + 1);
      setMessage("Correct!");
    } else {
      setMessage("Wrong! Try again.");
    }
    startNewRound(); // Start a new round without resetting the timer
  };

  const handleTryAgain = () => {
    setScore(0);
    setTimeLeft(90);
    setGameOver(false);
    setGameStarted(false); // Reset game start state
    startNewRound();
  };

  // Convert timeLeft to minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="game-container">
      {gameOver ? (
        <div>
          <h1 className="game-over-message">Time is up! Your score: {score}</h1>
          <button className="try-again-button" onClick={handleTryAgain}>
            Try Again
          </button>
        </div>
      ) : (
        <div>
          <h1
            className="word-display"
            style={{ color: gameStarted ? wordColor : "black" }}
          >
            {gameStarted ? word : "?"}
          </h1>
          <div className="answer-container">
            {answers.map((answer, index) => (
              <div
                key={index}
                onClick={() => handleAnswerClick(answer)}
                className="answer-button"
                style={{ color: answer.color }}
              >
                {answer.text}
              </div>
            ))}
          </div>
          <div className="timer-display">
            Time left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
          <div className="score-display">Score: {score}</div>
          {message && <p className="feedback-message">{message}</p>}
        </div>
      )}
    </div>
  );
};

export default Game;
