import React, { useState, useEffect } from 'react';

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10&type=multiple')
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.results.map((q) => ({
          question: q.question,
          options: shuffle([q.correct_answer, ...q.incorrect_answers]),
          correct: q.correct_answer
        }));
        setQuestions(formatted);
      });
  }, []);

  useEffect(() => {
    if (timer === 0) {
      handleNext();
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  const handleOptionClick = (option) => {
    setSelected(option);
    if (option === questions[currentIdx].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      handleNext();
    }, 500);
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
      setTimer(15);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  if (questions.length === 0) return <p>Loading questions...</p>;
  if (showResult)
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold">Quiz Completed!</h2>
        <p className="text-xl mt-4">Your Score: {score} / 10</p>
      </div>
    );

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <div className="flex justify-between mb-4">
        <span>Question {currentIdx + 1} / 10</span>
        <span>⏳ {timer}s</span>
      </div>
      <h3 className="mb-4 text-lg font-semibold" dangerouslySetInnerHTML={{ __html: currentQ.question }}></h3>
      <div className="grid gap-2">
        {currentQ.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(opt)}
            disabled={!!selected}
            className={`p-2 border rounded ${
              selected === opt ? (opt === currentQ.correct ? 'bg-green-300' : 'bg-red-300') : ''
            }`}
            dangerouslySetInnerHTML={{ __html: opt }}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizApp;
