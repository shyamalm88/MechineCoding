import React, { useState } from "react";

const wordsDict = ["bottle", "button", "direct", "camera", "cactus", "friend"];
const selectedWord = wordsDict[Math.floor(Math.random() * wordsDict.length)];

const COLORS = {
  correct: "green",
  present: "goldenrod",
  absent: "#888",
};

export default function App() {
  console.log(selectedWord);
  const [guessWord, setGuessWord] = useState("");
  const [word] = useState(selectedWord.split(""));
  const [guesses, setGuesses] = useState([]);

  const evaluateGuess = (word, guessWord) => {
    const res = Array(word.length).fill("");
    const freq = {};

    // First pass
    for (let i = 0; i < word.length; i++) {
      if (word[i] === guessWord[i]) {
        res[i] = "correct";
      } else {
        freq[word[i]] = (freq[word[i]] || 0) + 1;
      }
    }

    // Second pass
    for (let i = 0; i < word.length; i++) {
      if (res[i] === "correct") continue;

      const letter = guessWord[i];
      if (freq[letter] > 0) {
        res[i] = "present";
        freq[letter]--;
      } else {
        res[i] = "absent";
      }
    }

    setGuesses((prev) => [
      ...prev,
      { letters: guessWord.split(""), result: res },
    ]);

    setGuessWord("");
  };

  return (
    <>
      <input
        value={guessWord}
        onChange={(e) => setGuessWord(e.target.value)}
        maxLength={word.length}
      />

      <button onClick={() => evaluateGuess(word, guessWord)}>Submit</button>

      <div style={{ marginTop: 20 }}>
        {console.log(guesses)}
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", gap: 6 }}>
            {guess.letters.map((letter, i) => (
              <div
                key={i}
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  backgroundColor: COLORS[guess.result[i]],
                  color: "white",
                  borderRadius: 4,
                }}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
