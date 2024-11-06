import { useState } from 'react';
import Layout from '../../components/Layout';
import adverbData from '../../data/adverbQuestions.json';

export default function AdverbPractice() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < adverbData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setUserAnswer('');
      setShowResult(false);
    }
  };

  const question = adverbData.questions[currentQuestion];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">부사 연습하기</h1>
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <p className="text-lg mb-2">{question.korean}</p>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="border p-2 rounded w-full mb-4"
                placeholder="부사를 입력하세요"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  정답 확인
                </button>
                <button
                  type="button"
                  onClick={nextQuestion}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  다음 문제
                </button>
              </div>
            </form>
          </div>
          {showResult && (
            <div className={`mt-4 p-4 rounded ${
              userAnswer.toLowerCase() === question.answer.toLowerCase()
                ? 'bg-green-100'
                : 'bg-red-100'
            }`}>
              <p>정답: {question.answer}</p>
              <p>전체 문장: {question.english}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 