import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FaInstagram, FaYoutube, FaVolumeUp } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';
import beginnerQuizData from '../data/beginnerquizdata.json';
import { idiomQuizData } from '../data/idiomQuizData';
import adverbQuizData from '../data/adverbQuizData.json';
import wordOrderQuizData from '../data/wordOrderQuizData.json';

export default function Home() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [draggedWords, setDraggedWords] = useState([]);
  const [wordOrderCorrect, setWordOrderCorrect] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);

  const shuffleQuestions = useCallback(() => {
    if (!idiomQuizData?.idiom?.questions) return;
    
    const questions = [...idiomQuizData.idiom.questions];
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    setShuffledQuestions(questions);
  }, []);

  useEffect(() => {
    if (selectedLevel === 'idiom') {
      shuffleQuestions();
    }
  }, [selectedLevel, shuffleQuestions]);

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    setShowScore(false);
    setShowFeedback(false);
    
    if (level === 'wordOrder') {
      const currentQuestion = wordOrderQuizData.wordOrder.questions[0];
      setAvailableWords([...currentQuestion.words].sort(() => Math.random() - 0.5));
      setSelectedWords([]);
    }
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech error:', error);
    }
  };

  const checkAnswer = (userInput, correctAnswer) => {
    const normalizedUserInput = userInput.toLowerCase().trim()
      .replace(/[.,!?]/g, '')
      .replace(/\s+/g, ' ');
    
    const normalizedCorrectAnswer = correctAnswer.toLowerCase().trim()
      .replace(/[.,!?]/g, '')
      .replace(/\s+/g, ' ');

    return normalizedUserInput === normalizedCorrectAnswer;
  };

  const handleWarmupAnswerClick = (selectedAnswer) => {
    const currentQuestion = beginnerQuizData.warmup.questions[currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    
    if (correct) {
      setScore(score + 1);
    }
    
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newUserAnswers);

    if (currentQuestionIndex < beginnerQuizData.warmup.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowScore(true);
    }
  };

  const handleAnswerSubmit = () => {
    const correct = checkAnswer(
      userAnswer,
      shuffledQuestions[currentQuestionIndex].correctAnswer
    );
    
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) setScore(score + 1);
    
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = userAnswer;
    setUserAnswers(newUserAnswers);
  };

  const handleNextQuestion = () => {
    setUserAnswer('');
    setShowFeedback(false);
    if (currentQuestionIndex < wordOrderQuizData.wordOrder.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      const nextQuestion = wordOrderQuizData.wordOrder.questions[currentQuestionIndex + 1];
      setAvailableWords([...nextQuestion.words].sort(() => Math.random() - 0.5));
      setSelectedWords([]);
    } else {
      setShowScore(true);
    }
  };

  const getQuestionLength = () => {
    if (selectedLevel && beginnerQuizData && beginnerQuizData[selectedLevel]) {
      return beginnerQuizData[selectedLevel].questions.length;
    }
    return 0;
  };

  const handleAdverbSubmit = () => {
    const currentQuestion = adverbQuizData.adverb.questions[currentQuestionIndex];
    const correct = userAnswer.toLowerCase().trim() === currentQuestion.answer.toLowerCase();
    
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) setScore(score + 1);
    
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = userAnswer;
    setUserAnswers(newUserAnswers);
  };

  const handleWordClick = (word, index) => {
    setSelectedWords([...selectedWords, word]);
    setAvailableWords(availableWords.filter((_, i) => i !== index));
  };

  const handleSelectedWordClick = (word, index) => {
    setAvailableWords([...availableWords, word]);
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#004649] to-[#002829]">
      {!selectedLevel && (
        <>
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="Logo"
              width={200}
              height={200}
              className="rounded-full shadow-lg"
            />
          </div>

          <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">영어 학습</h1>
              <p className="text-xl text-gray-600">Select your category to start</p>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
              <button
                onClick={() => handleLevelSelect('warmup')}
                className="bg-[#004649] text-white py-4 px-8 rounded-lg text-xl hover:bg-[#003639] transition-colors duration-200"
              >
                기초 (Warm-up)
              </button>
              
              <button
                onClick={() => handleLevelSelect('idiom')}
                className="bg-[#004649] text-white py-4 px-8 rounded-lg text-xl hover:bg-[#003639] transition-colors duration-200"
              >
                관용 표현 영작 연습
              </button>

              <button
                onClick={() => handleLevelSelect('adverb')}
                className="bg-[#004649] text-white py-4 px-8 rounded-lg text-xl hover:bg-[#003639] transition-colors duration-200"
              >
                부사 연습하기
              </button>

              <button
                onClick={() => handleLevelSelect('wordOrder')}
                className="bg-[#004649] text-white py-4 px-8 rounded-lg text-xl hover:bg-[#003639] transition-colors duration-200"
              >
                순서 맞추기 연습
              </button>
            </div>

            <div className="flex justify-center space-x-6">
              <a
                href="https://www.instagram.com/english_monster_official/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#004649] hover:text-[#003639] transition-colors duration-200"
              >
                <FaInstagram size={32} />
              </a>
              <a
                href="https://www.youtube.com/channel/UCZKZAvSI4ltnwl-QzrZahFw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#004649] hover:text-[#003639] transition-colors duration-200"
              >
                <FaYoutube size={32} />
              </a>
              <a
                href="https://cafe.naver.com/englishmonsters"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#004649] hover:text-[#003639] transition-colors duration-200"
              >
                <SiNaver size={32} />
              </a>
            </div>
          </div>
        </>
      )}

      {selectedLevel === 'warmup' && !showScore && (
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">기초 (Warm-up)</h2>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full">
                {currentQuestionIndex + 1}/{beginnerQuizData.warmup.questions.length}
              </span>
            </div>
            <p className="text-lg text-black font-medium">
              {beginnerQuizData.warmup.questions[currentQuestionIndex].question}
            </p>
          </div>

          <div className="space-y-4">
            {beginnerQuizData.warmup.questions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleWarmupAnswerClick(option)}
                className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-black"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedLevel === 'idiom' && !showScore && (
        <div className="w-full max-w-3xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">관용 표현 영작 연습</h2>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full">
                {currentQuestionIndex + 1}/{shuffledQuestions.length}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-[#004649]">
                  {shuffledQuestions[currentQuestionIndex]?.representativeExpression}
                </h3>
                <button
                  onClick={() => speak(shuffledQuestions[currentQuestionIndex]?.representativeExpression)}
                  className="text-[#004649] hover:text-[#003639] transition-colors duration-200"
                  title="대표 표현 듣기"
                >
                  <FaVolumeUp size={24} />
                </button>
              </div>
              <p className="text-black text-gray-600 italic mt-2">
                {shuffledQuestions[currentQuestionIndex]?.question}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-xl text-gray-800">
                {shuffledQuestions[currentQuestionIndex]?.exampleSentence}
              </p>
            </div>

            <div className="mb-6">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full p-4 border-2 border-[#004649] rounded-lg text-lg text-black"
                rows="3"
                placeholder="영어로 작문해보세요..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAnswerSubmit}
                className="flex-1 bg-[#004649] text-white py-4 rounded-lg text-xl hover:bg-[#003639] transition-colors duration-200"
              >
                정답 확인
              </button>
              {showFeedback && (
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 bg-green-600 text-white py-4 rounded-lg text-xl hover:bg-green-700 transition-colors duration-200"
                >
                  다음 문제
                </button>
              )}
            </div>

            {showFeedback && (
              <div className={`mt-6 p-4 rounded-lg ${
                isCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-black">
                    {isCorrect ? '정답입니다! 🎉' : '틀렸습니다. 다시 시도해보세요.'}
                  </p>
                  <button
                    onClick={() => speak(shuffledQuestions[currentQuestionIndex].correctAnswer)}
                    className="text-[#004649] hover:text-[#003639] transition-colors duration-200 p-2"
                    title="정답 듣기"
                  >
                    <FaVolumeUp size={24} />
                  </button>
                </div>
                <p className="text-black font-semibold">
                  정답: {shuffledQuestions[currentQuestionIndex].correctAnswer}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedLevel === 'adverb' && !showScore && (
        <div className="w-full max-w-3xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">부사 연습하기</h2>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full">
                {currentQuestionIndex + 1}/{adverbQuizData.adverb.questions.length}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-xl text-gray-800 mb-4">
                {adverbQuizData.adverb.questions[currentQuestionIndex].korean}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-6">
              {adverbQuizData.adverb.questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setUserAnswer(option);
                    const isCorrect = option === adverbQuizData.adverb.questions[currentQuestionIndex].answer;
                    setIsCorrect(isCorrect);
                    setShowFeedback(true);
                    if (isCorrect) setScore(score + 1);
                  }}
                  className={`p-4 text-left rounded-lg text-black font-medium transition-colors
                    ${showFeedback 
                      ? option === adverbQuizData.adverb.questions[currentQuestionIndex].answer
                        ? 'bg-green-100 hover:bg-green-200'
                        : option === userAnswer
                          ? 'bg-red-100 hover:bg-red-200'
                          : 'bg-gray-100 hover:bg-gray-200'
                      : 'bg-blue-100 hover:bg-blue-200'
                    }
                  `}
                  disabled={showFeedback}
                >
                  {option}
                </button>
              ))}
            </div>

            {showFeedback && (
              <div className={`mt-6 p-4 rounded-lg ${
                isCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <p className="text-black">
                  {isCorrect ? '정답입니다! 🎉' : '틀렸습니다. 다시 시도해보세요.'}
                </p>
                <p className="text-black font-semibold mt-2">
                  정답: {adverbQuizData.adverb.questions[currentQuestionIndex].answer}
                </p>
                <p className="text-black mt-2">
                  {adverbQuizData.adverb.questions[currentQuestionIndex].english}
                </p>
                <p className="text-gray-600 mt-2 italic">
                  {adverbQuizData.adverb.questions[currentQuestionIndex].explanation}
                </p>
              </div>
            )}

            {showFeedback && (
              <button
                onClick={handleNextQuestion}
                className="w-full mt-4 bg-green-600 text-white py-4 rounded-lg text-xl hover:bg-green-700 transition-colors duration-200"
              >
                다음 문제
              </button>
            )}
          </div>
        </div>
      )}

      {selectedLevel === 'wordOrder' && !showScore && (
        <div className="w-full max-w-3xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">순서 맞추기 연습</h2>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full">
                {currentQuestionIndex + 1}/{wordOrderQuizData.wordOrder.questions.length}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-xl text-gray-800 mb-4">
                {wordOrderQuizData.wordOrder.questions[currentQuestionIndex].korean}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6 min-h-[60px] p-4 border-2 border-dashed border-gray-300 rounded-lg">
              {selectedWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectedWordClick(word, index)}
                  className="bg-green-100 p-3 rounded-lg text-black font-medium hover:bg-green-200 transition-colors"
                >
                  {word}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {availableWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(word, index)}
                  className="bg-blue-100 p-3 rounded-lg text-black font-medium hover:bg-blue-200 transition-colors"
                >
                  {word}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  const isCorrect = selectedWords.join(' ') === 
                    wordOrderQuizData.wordOrder.questions[currentQuestionIndex].correctOrder.join(' ');
                  setWordOrderCorrect(isCorrect);
                  setShowFeedback(true);
                  if (isCorrect) setScore(score + 1);
                }}
                className="flex-1 bg-[#004649] text-white py-4 rounded-lg text-xl hover:bg-[#003639] transition-colors duration-200"
              >
                정답 확인
              </button>
              {showFeedback && (
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 bg-green-600 text-white py-4 rounded-lg text-xl hover:bg-green-700 transition-colors duration-200"
                >
                  다음 문제
                </button>
              )}
            </div>

            {showFeedback && (
              <div className={`mt-6 p-4 rounded-lg ${
                wordOrderCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <p className="text-black">
                  {wordOrderCorrect ? '정답입니다! 🎉' : '틀렸습니다. 다시 시도해보세요.'}
                </p>
                <p className="text-black font-semibold mt-2">
                  정답: {wordOrderQuizData.wordOrder.questions[currentQuestionIndex].correctOrder.join(' ')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {showScore && (
        <div className="w-full max-w-3xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-black mb-6 text-center">
            {selectedLevel === 'warmup' ? '기초 문법 테스트 결과' : '관용 표현 영작 결과'}
          </h2>
          
          {selectedLevel === 'warmup' ? (
            <div>
              <p className="text-xl text-black mb-6 text-center">
                총 {beginnerQuizData.warmup.questions.length}문제 중 {score}문제 정답
              </p>
              <div className="space-y-4 mb-6">
                {beginnerQuizData.warmup.questions.map((question, index) => {
                  const isCorrect = userAnswers[index] === question.correctAnswer;
                  return (
                    <div
                      key={question.id}
                      className={`p-4 rounded-lg ${
                        isCorrect ? 'bg-green-100' : 'bg-pink-100'
                      }`}
                    >
                      <p className="text-lg text-gray-800 mb-2">
                        {index + 1}. {question.question}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <span className="font-semibold">정답:</span> {question.correctAnswer}
                      </p>
                      <p className={`${isCorrect ? 'text-green-700' : 'text-red-700'} mb-2`}>
                        <span className="font-semibold">내 답안:</span> {userAnswers[index]}
                      </p>
                      <p className={`${isCorrect ? 'text-green-700' : 'text-red-700'} text-sm italic`}>
                        {isCorrect 
                          ? '정답입니다! 문법 규칙을 잘 이해하고 있네요.' 
                          : `틀렸습니다. 정답은 "${question.correctAnswer}"입니다. ${question.explanation || '이 부분을 다시 한 번 학습해보세요.'}`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xl text-gray-800 mb-6 text-center">
                총 {shuffledQuestions.length}문제 중 {score}문제 정답
              </p>
              <div className="space-y-4">
                {shuffledQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="p-4 rounded-lg bg-gray-50"
                  >
                    <p className="font-bold text-lg text-gray-800 mb-2">
                      {question.representativeExpression}
                    </p>
                    <p className="text-gray-600 mb-2">
                      {question.exampleSentence}
                    </p>
                    <p className="text-gray-800 mb-2">
                      정답: {question.correctAnswer}
                    </p>
                    <p className={`text-gray-800 ${
                      checkAnswer(userAnswers[index] || '', question.correctAnswer)
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      내 답안: {userAnswers[index] || '(답안 없음)'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setSelectedLevel(null);
              setCurrentQuestionIndex(0);
              setScore(0);
              setUserAnswers([]);
              setShowScore(false);
              setShowFeedback(false);
            }}
            className="w-full mt-6 bg-[#004649] text-white py-4 rounded-lg text-xl hover:bg-[#003639] transition-colors duration-200"
          >
            처음으로 돌아가기
          </button>
        </div>
      )}
    </main>
  );
}