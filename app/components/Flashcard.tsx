// app/components/Flashcard.tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface Score {
  correct: number;
  incorrect: number;
}

interface Card {
  source: string;
  target: string;
  score: Score;
}

interface FlashcardProps {
  card: Card;
  onNext: () => void;
  onCorrectAnswer: () => void;
  onIncorrectAnswer: () => void;
  totalWords: number;
  learnedWords: number;
}

export default function Flashcard({
  card,
  onNext,
  onCorrectAnswer,
  onIncorrectAnswer,
  totalWords,
  learnedWords,
}: FlashcardProps) {
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus on input when the component mounts or moves to the next card
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [card]);

  const handleCheck = () => {
    if (userInput.trim().toLowerCase() === card.target.toLowerCase()) {
      setIsCorrect(true);
      onCorrectAnswer(); // Notify parent component of a correct answer
      // Automatically move to the next card after a short delay
      setTimeout(() => {
        setUserInput("");
        setIsCorrect(null);
        onNext();
      }, 1000); // 1 second delay
    } else {
      setIsCorrect(false);
      onIncorrectAnswer(); // Notify parent component of an incorrect answer
    }
  };

  const handleNext = () => {
    setUserInput("");
    setIsCorrect(null);
    onNext();
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCheck();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-between mb-6">
          <p className="text-gray-600">Total: {totalWords}</p>
          <p className="text-green-600">Learned: {learnedWords}</p>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{card.source}</h2>
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type the translation"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          autoFocus
        />
        <button
          onClick={handleCheck}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors mb-4"
        >
          Check
        </button>
        {isCorrect !== null && (
          <div className="mt-4">
            {isCorrect ? (
              <p className="text-green-600 font-semibold">Correct! 🎉</p>
            ) : (
              <p className="text-red-600 font-semibold">
                Incorrect. The correct answer is:{" "}
                <span className="underline">{card.target}</span>
              </p>
            )}
            {!isCorrect && (
              <button
                onClick={handleNext}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors mt-4"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}