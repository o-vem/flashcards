// app/flashcard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Flashcard from "@/app/components/Flashcard";

interface Score {
  correct: number;
  incorrect: number;
}

interface Card {
  source: string;
  target: string;
  score: Score;
}

export default function FlashcardPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [learnedWords, setLearnedWords] = useState(0);
  const [wordSets, setWordSets] = useState<string[]>([]);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);

  // Load available word sets from the public directory
  useEffect(() => {
    fetch("/data/sets.json") // Create a JSON file listing available sets
      .then((response) => response.json())
      .then((data: string[]) => setWordSets(data));
  }, []);

  // Load the selected word set
  useEffect(() => {
    if (selectedSet) {
      fetch(`/data/${selectedSet}`)
        .then((response) => response.json())
        .then((data: Card[]) => {
          setCards(data);
          setCurrentCardIndex(0);
          setLearnedWords(0);
        });
    }
  }, [selectedSet]);

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handleCorrectAnswer = () => {
    const updatedCards = [...cards];
    updatedCards[currentCardIndex].score.correct += 1;
    setCards(updatedCards);
    setLearnedWords((prev) => prev + 1);
  };

  const handleIncorrectAnswer = () => {
    const updatedCards = [...cards];
    updatedCards[currentCardIndex].score.incorrect += 1;
    setCards(updatedCards);
  };

  const handleSetSelection = (set: string) => {
    setSelectedSet(set);
  };

  if (!selectedSet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Choose a Word Set</h1>
        <div className="space-y-4">
          {wordSets.map((set) => (
            <button
              key={set}
              onClick={() => handleSetSelection(set)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {set.replace(".json", "")}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return <p>Loading...</p>;
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-8 text-gray-800">
        Flashcard App
      </h1>
      <Flashcard
        card={currentCard}
        onNext={handleNextCard}
        onCorrectAnswer={handleCorrectAnswer}
        onIncorrectAnswer={handleIncorrectAnswer}
        totalWords={cards.length}
        learnedWords={learnedWords}
      />
    </div>
  );
}