import { useEffect, useState } from "react";
import "./Quiz.css";
import Loaders from "./Loaders";

const Quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [correctAnswerText, setCorrectAnswerText] = useState("");

  const getQuizData = async (category = "", difficulty = "") => {
    try {
      setLoading(true);
      let url = `https://quizapi.io/api/v1/questions?limit=10`;
      if (category) url += `&category=${category}`;
      if (difficulty) url += `&difficulty=${difficulty.toLowerCase()}`;

      const response = await fetch(url, {
        headers: {
          "X-Api-Key": "y27Gl1ma13qOA1oStD6RIHknlw4lQyWZzsRuhIAP",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setQuizData(data);
      setCurrentQuestion(0);
      setCorrectAnswerCount(0);
      setQuizFinished(false);
      setSelectedOption(null);
      setCorrectAnswerText("");
      setError(null);
    } catch (err) {
      setError("Something went wrong while fetching quiz data.",err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuizData();
  }, []);

  const currentQ = quizData?.[currentQuestion];

  const handleOptionClick = (key) => {
    if (selectedOption) return;

    setSelectedOption(key);

    const isCorrect = currentQ.correct_answers[`${key}_correct`] === "true";
    if (isCorrect) {
      setCorrectAnswerCount((prev) => prev + 1);
      setCorrectAnswerText("");
    } else {
      const correctKey = Object.keys(currentQ.correct_answers).find(
        (k) => currentQ.correct_answers[k] === "true"
      );
      const correctAnswer = currentQ.answers[correctKey.replace("_correct", "")];
      setCorrectAnswerText(correctAnswer);
    }
  };

  const handleNext = () => {
    if (!selectedOption) {
      setError("Please select an answer!");
      return;
    }

    setError(null);
    setSelectedOption(null);
    setCorrectAnswerText("");

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleReset = () => {
    getQuizData(selectedCategory, selectedDifficulty);
  };

  if(loading) return <><Loaders/></>

  return (
    <div className="quiz">
      <h1 className="title">🎯 Quiz App</h1>

      <div className="filters">
        <select onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="linux">Linux</option>
          <option value="sql">SQL</option>
          <option value="bash">Bash</option>
          <option value="docker">Docker</option>
        </select>

        <select onChange={(e) => setSelectedDifficulty(e.target.value)}>
          <option value="">All Levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button onClick={() => getQuizData(selectedCategory, selectedDifficulty)}>
          Load Quiz
        </button>
      </div>

      {loading ? (
        <div className="loader">
          <Loaders />
        </div>
      ) : error && quizData.length === 0 ? (
        <div className="error">{error}</div>
      ) : quizFinished ? (
        <div className="result">
          <p>
            You got {correctAnswerCount} out of {quizData.length} correct 🎉
          </p>
          <button onClick={handleReset}>Try Again</button>
        </div>
      ) : currentQ ? (
        <div className="quiz-container">
          <div className="question-card">
            <h3>
              Q{currentQuestion + 1}: {currentQ.question}
            </h3>
            <ul className="options">
              {Object.entries(currentQ.answers)
                .filter(([_, val]) => val !== null)
                .map(([key, text]) => (
                  <li
                    key={key}
                    onClick={() => handleOptionClick(key)}
                    className={`option ${
                      selectedOption
                        ? key === selectedOption
                          ? currentQ.correct_answers[`${key}_correct`] === "true"
                            ? "correct"
                            : "wrong"
                          : ""
                        : ""
                    }`}
                  >
                    {text}
                  </li>
                ))}
            </ul>

            {correctAnswerText && (
              <p className="correct-answer">Correct Answer: {correctAnswerText}</p>
            )}

            <button className="next-btn" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      ) : (
        <div>No Questions Available</div>
      )}
    </div>
  );
};

export default Quiz;
