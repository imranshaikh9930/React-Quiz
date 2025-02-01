import  { useEffect, useState } from "react";
import Loaders from "./Loaders";

const Quiz = () => {
  // State for all quiz questions (an array)
  const [quizData, setQuizData] = useState([]);
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for tracking the current question index
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // State for the current question object
  const [singleQuestion, setSingleQuestion] = useState(null);
  // State for tracking the number of correct answers
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  // State to track if the quiz has finished
  const [quizFinished, setQuizFinished] = useState(false);
  // State to store the id of the selected option for the current question
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const [correctAnswerText, setCorrectAnswerText] = useState();

  // Function to fetch quiz data
  const getQuizData = async () => {
    try {
      const response = await fetch("http://localhost:3001");
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      // Assuming the API returns an object with a 'questions' array property
      setQuizData(data.questions);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the quiz data once when the component mounts
  useEffect(() => {
    getQuizData();
  }, []);

  // Update the current question when quizData or currentQuestion changes
  useEffect(() => {
    if (quizData.length > 0 && currentQuestion < quizData.length) {
      setSingleQuestion(quizData[currentQuestion]);
      // Reset selected option when moving to a new question
      setSelectedOptionId(null);
    }
  }, [quizData, currentQuestion]);

  // Handler for when an option is clicked
  const handleOptionClick = (option) => {
    // Prevent multiple selections per question
    if (selectedOptionId !== null) return;

    setSelectedOptionId(option.id);
    setError(null);

    if (option.is_correct) {
      setCorrectAnswerCount((prev) => prev + 1);
      setCorrectAnswerText(null);
    } else {
      const correctOption = singleQuestion.options.find(
        (opt) => opt.is_correct
      );
      setCorrectAnswerText(correctOption ? correctOption.description : null);
    }
  };

  // Handler for the "Next" button
  const handleNext = (e) => {
    e.preventDefault();

    if (!selectedOptionId) {
      return setError("Please Select one option");
    }
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setError(null);
      setCorrectAnswerText(null);
    } else {
      // End of quiz
      setQuizFinished(true);

      setError(null);
      setCorrectAnswerText(null);
    }
  };

  const handleReset = () => {
    setQuizFinished(false);
    setCurrentQuestion(0);
  };

  const formattedText = () => {
    let questionText = singleQuestion.description.split(" ");

    questionText.pop();
    return questionText.join(" ");
  };

  if (loading) return <Loaders />;

  return (
    <div className="quiz">
      <h1>Quiz-App</h1>

      <form className="quiz-container">
        {!quizFinished && singleQuestion ? (
          <div className="quiz-question">
            <p>{formattedText()}</p>
            <ol className="options-container">
              {singleQuestion.options.map((option, index) => (
                <li
                  key={option.id}
                  onClick={() => handleOptionClick(option)}
                  style={{
                    cursor: selectedOptionId === null ? "pointer" : "default",
                    backgroundColor:
                      selectedOptionId === option.id
                        ? option.is_correct
                          ? "lightgreen"
                          : "salmon"
                        : " ",
                  }}
                >
                  {index + 1}
                  {". "}
                  {option.description}
                </li>
              ))}
            </ol>
          </div>
        ) : quizFinished ? (
          <div className="result">
            <p>
              Quiz Finished! You got {correctAnswerCount} out of{" "}
              {quizData.length} correct.
            </p>

            <button className="reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>
        ) : null}
        {correctAnswerText && (
          <p style={{ color: "green",padding:"10px 10px" }}>Answer is :- {correctAnswerText}</p>
        )}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {!quizFinished && (
          <button className="next-btn" onClick={handleNext}>
            Next
          </button>
        )}
      </form>
    </div>
  );
};

export default Quiz;
