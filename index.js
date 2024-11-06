import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { FaInstagram, FaYoutube, FaVolumeUp, FaFilePdf, FaQuestionCircle } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';
import beginnerQuizData from '../data/beginnerquizdata.json';
import { idiomQuizData } from '../data/idiomQuizData';
import adverbQuizData from '../data/adverbQuizData.json';
import wordOrderQuizData from '../data/wordOrderQuizData.json';

// BackButton 컴포넌트 수정
const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-8 left-8 px-6 py-3 bg-white/90 backdrop-blur-sm text-[#004649] rounded-xl 
    hover:bg-white/80 transition-all duration-200 shadow-lg z-50
    font-medium text-lg flex items-center gap-2 hover:transform hover:translate-x-[-4px]"
    style={{ fontFamily: "'Pretendard', sans-serif" }}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5" 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path 
        fillRule="evenodd" 
        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
        clipRule="evenodd" 
      />
    </svg>
    뒤로가기
  </button>
);

// Warm-up 레슨 데이터 추가
const warmupLessons = [
  { id: 1, title: "am, is, are 사용법 알아보기" },
  { id: 2, title: "과거형 be 동사: was, were" },
  { id: 3, title: "주어에 맞는 be 동사 고르기" },
  { id: 4, title: "be 동사 부정문 만들기" },
  { id: 5, title: "be 동사 의문문 만들기" },
  { id: 6, title: "일반 동사와 be 동사의 차이" },
  { id: 7, title: "he, she, it 같은 대명사 사용법" },
  { id: 8, title: "일반 동사 현재형: do, does 사용" },
  { id: 9, title: "일반 동사 부정문 만들기" },
  { id: 10, title: "일반 동사 의문문 만들기" },
  { id: 11, title: "what, where, who로 질문하기" },
  { id: 12, title: "기분 표현하기 (I'm happy 등)" },
  { id: 13, title: "내 것, 네 것: 소유격 배우기" },
  { id: 14, title: "There is / There are로 존재 표현하기" },
  { id: 15, title: "a, an, the 관사 사용법" },
  { id: 16, title: "복수형 만들기 (s 붙이기)" },
  { id: 17, title: "현재, 과거, 미래 시제 이해하기" },
  { id: 18, title: "현재진행형: -ing 사용법" },
  { id: 19, title: "현재형: 일상 표현하기" },
  { id: 20, title: "will로 미래 표현하기" },
  { id: 21, title: "and, but, or로 문장 연결하기" },
  { id: 22, title: "색깔, 크기, 감정 설명하기" },
  { id: 23, title: "always, sometimes, never 같은 빈도부사" },
  { id: 24, title: "Why, How로 질문하는 법" },
  { id: 25, title: "주어와 목적어 구분하기" },
  { id: 26, title: "this, that, these, those 지시대명사" },
  { id: 27, title: "can으로 가능성 표현하기" },
  { id: 28, title: "should와 have to로 해야 할 일 표현" },
  { id: 29, title: "mine, yours 같은 소유격 대명사" },
  { id: 30, title: "비교하기: 더 크고, 제일 큰" },
  { id: 31, title: "no, not, never로 부정하기" },
  { id: 32, title: "in, on, at으로 장소, 시간 표현하기" },
  { id: 33, title: "for와 since로 기간 표현하기" },
  { id: 34, title: "명령문으로 간단히 지시하기" },
  { id: 35, title: "현재완료 시제: have + p.p." },
  { id: 36, title: "수량 표현하기: much, many, few, little" },
  { id: 37, title: "과거형 만들기: 규칙/불규칙 동사" },
  { id: 38, title: "미래 표현: be going to" },
  { id: 39, title: "if로 조건문 만들기" },
  { id: 40, title: "시간 표현법 배우기" },
  { id: 41, title: "want to로 희망 표현하기" },
  { id: 42, title: "would like: 공손하게 요청하기" },
  { id: 43, title: "Like와 dislike로 취향 표현하기" },
  { id: 44, title: "so와 because로 이유 말하기" },
  { id: 45, title: "too와 also로 ~도 표현하기" },
  { id: 46, title: "How much와 How many로 물어보기" },
  { id: 47, title: "how often으로 자주 하는 일 물어보기" },
  { id: 48, title: "Let's로 제안하기" },
  { id: 49, title: "-ing로 동명사 표현하기" },
  { id: 50, title: "What a ~! / How ~! 로 감탄하기" }
];

// 페이지네이션 관련 상수
const ITEMS_PER_PAGE = 10; // 한 페이지당 보여줄 레슨 수

// 레슨 상세 정보 데이터 추가
const lessonDetails = {
  1: {
    videoUrl: "https://www.youtube.com/watch?v=cHNjufT1O20",
    pdfUrl: "/pdfs/lesson1.pdf",  // PDF 파일 경로
  },
  // ... 다른 레슨들의 상세 정보
};

// 단어 1500개 상세 정보 데이터
const wordsDetails = {
  videoUrl: "https://www.youtube.com/watch?v=example",  // 실제 URL로 변경 필요
};

// 접속사 100개 상세 정보 데이터
const conjunctionsDetails = {
  videoUrl: "https://www.youtube.com/watch?v=example",  // 실제 URL로 변경 필요
  pdfUrl: "/pdfs/conjunctions.pdf",  // 실제 PDF 변경 필요
};

// Core Strength 상세 정보 데이터 추가
const coreStrengthDetails = {
  patterns: {
    videoUrl: "https://www.youtube.com/watch?v=example1",
    pdfUrl: "/pdfs/patterns.pdf",
  },
  questions: {
    videoUrl: "https://www.youtube.com/watch?v=example2",
    pdfUrl: "/pdfs/questions.pdf",
  },
  travel: {
    videoUrl: "https://www.youtube.com/watch?v=example3",
    pdfUrl: "/pdfs/travel.pdf",
  },
  responses: {
    videoUrl: "https://www.youtube.com/watch?v=example4",
    pdfUrl: "/pdfs/responses.pdf",
  }
};

// Core Strength 카테고리별 상세 화면 렌더링
const renderCoreStrengthDetail = (category) => {
  const details = coreStrengthDetails[category];
  const titles = {
    patterns: "영어 패턴 100개 DIN 연습하기 (1-50레슨)",
    questions: "일상에서 꼭 써먹는 의문문 패턴 50개",
    travel: "여행가서 쓸 수 있는 질문 100개",
    responses: "Yes! 대신 쓸 수 있는 영어 맞장구 100개"
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {titles[category]}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* YouTube 버튼 */}
          <a
            href={details?.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-6 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            <span className="text-xl font-medium">YouTube 영상 바로가기</span>
            <FaYoutube size={24} />
          </a>

          {/* PDF 다운로드 버튼 */}
          <a
            href={details?.pdfUrl}
            download
            className="flex items-center justify-between p-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <span className="text-xl font-medium">PDF 자료 다운로드</span>
            <FaFilePdf size={24} />
          </a>

          {/* 퀴즈 버튼 */}
          <button
            onClick={() => {
              // 퀴즈 시작 로직 추가
            }}
            className="flex items-center justify-between p-6 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <span className="text-xl font-medium">퀴즈로 확인하기</span>
            <FaQuestionCircle size={24} />
          </button>
        </div>

        {/* 뒤로 기 버튼 */}
        <button
          onClick={() => setCoreCategory(null)}
          className="mt-6 w-full p-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
        >
          카테고리 목록으로 가기
        </button>
      </div>
      <BackButton onClick={() => {
        setCoreCategory(null);
      }} />
    </div>
  );
};

// 상황별 영어 표현 데이터
const situationLessons = [
  {
    id: 1,
    title: "아침에 일어날 때",
    expressions: ["I need to get up", "I'm so sleepy"]
  },
  {
    id: 2,
    title: "아침 식사 준비할 때",
    expressions: ["What should I eat for breakfast?"]
  },
  // ... 나머지 데이터들도 동일한 형식으로 추가
];

// 상황별 영어 표현 상세 정보
const situationDetails = {
  1: {
    videoUrl: "https://youtube.com/...",  // 실제 비디오 URL로 교체 필요
    pdfUrl: "/pdfs/situation-1.pdf",      // 실제 PDF 경로로 교체 필요
  },
  2: {
    videoUrl: "https://youtube.com/...",
    pdfUrl: "/pdfs/situation-2.pdf",
  },
  // ... 각 레슨별 상세 정보 추가
};

// 상황별 영어 표현 레슨 목록 렌더링
const renderSituationLessons = () => {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLessons = situationLessons.slice(startIndex, endIndex);

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">상황별 쓰는 영어 표현</h2>
        <p className="text-gray-200">학습하고 싶은 레슨을 선택하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentLessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => {
              setSelectedLesson(lesson.id);
              setShowLessonDetail(true);
            }}
            className="bg-white/90 backdrop-blur-sm p-6 rounded-xl hover:bg-white/80 
            transition-all duration-200 text-left group"
          >
            <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639] mb-2">
              {lesson.id.toString().padStart(2, '0')}. {lesson.title}
            </h3>
            <div className="space-y-1">
              {lesson.expressions.map((exp, index) => (
                <p key={index} className="text-gray-600">
                  • {exp}
                </p>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-[#004649] text-white hover:bg-[#003639]'
          }`}
        >
          이전
        </button>
        
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-lg ${
                currentPage === i + 1
                  ? 'bg-[#004649] text-white'
                  : 'bg-white text-[#004649] hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-[#004649] text-white hover:bg-[#003639]'
          }`}
        >
          다음
        </button>
      </div>

      <BackButton onClick={() => {
        setSpeedCategory(null);
        setCurrentPage(1);  // 카테고리를 나갈 때 페이지 초기화
      }} />
    </div>
  );
};

// 상황별 영어 표현 상세 화면 렌더링
const renderSituationDetail = (lessonId) => {
  const lesson = situationLessons.find(l => l.id === lessonId);
  const details = situationDetails[lessonId];

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {lesson.id.toString().padStart(2, '0')}. {lesson.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* YouTube 버튼 */}
          <a
            href={details?.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-6 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            <span className="text-xl font-medium">YouTube 영상 바로가기</span>
            <FaYoutube size={24} />
          </a>

          {/* PDF 다운로드 버튼 */}
          <a
            href={details?.pdfUrl}
            download
            className="flex items-center justify-between p-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <span className="text-xl font-medium">PDF 자료 다운로드</span>
            <FaFilePdf size={24} />
          </a>

          {/* 퀴즈 버튼 */}
          <button
            onClick={() => {
              setShowLessonDetail(false);
              // 퀴즈 시작 로직 추가
            }}
            className="flex items-center justify-between p-6 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <span className="text-xl font-medium">퀴즈로 확인하기</span>
            <FaQuestionCircle size={24} />
          </button>
        </div>

        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => {
            setShowLessonDetail(false);
            setSelectedLesson(null);
          }}
          className="mt-6 w-full p-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
        >
          레슨 목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

// 랜덤 퀴즈 카테고리 렌더링 함수 추가
const renderRandomQuizCategories = () => (
  <div className="w-full max-w-4xl mx-auto p-8">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-white mb-2">랜덤 퀴즈 풀기</h2>
      <p className="text-gray-200">연습하고 싶은 퀴즈를 선택하세요</p>
    </div>
    
    <div className="space-y-4">
      {/* 관용 표현 영작 연습 */}
      <button
        onClick={() => setSelectedLevel('idiom')}
        className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
        transition-all duration-200 text-left group"
      >
        <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
          관용 표현 영작 연습
        </h3>
        <p className="text-gray-600 mt-2">
          자주 사용되는 관용 표현들을 랜덤하게 연습해보세요
        </p>
      </button>

      {/* 부사 연습하기 */}
      <button
        onClick={() => setSelectedLevel('adverb')}
        className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
        transition-all duration-200 text-left group"
      >
        <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
          부사 연습하기
        </h3>
        <p className="text-gray-600 mt-2">
          문장을 더욱 풍부하게 만들어주는 부사 사용법을 연습해보세
        </p>
      </button>

      {/* 순서 맞추기 연습 */}
      <button
        onClick={() => setSelectedLevel('wordOrder')}
        className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
        transition-all duration-200 text-left group"
      >
        <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
          순서 맞추기 연습
        </h3>
        <p className="text-gray-600 mt-2">
          올바른 문장 구조를 익는 단어 배열 연습을 해보세요
        </p>
      </button>
    </div>

    <BackButton onClick={() => setSelectedLevel(null)} />
  </div>
);

// 메인 메뉴 렌더링 함수 추가
const renderMainMenu = () => (
  <div className="w-full max-w-4xl mx-auto p-8">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-white mb-2">학습 레벨 선택</h2>
      <p className="text-gray-200">학습하고 싶은 레벨을 선택하세요</p>
    </div>
    
    <div className="space-y-4">
      {/* Warm-up */}
      <button
        onClick={() => setSelectedLevel('warmup')}
        className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
        transition-all duration-200 text-left group"
      >
        <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
          기초 (Warm-up)
        </h3>
        <p className="text-gray-600 mt-2">
          영어의 기본 문법과 구조를 체계적으로 학습합니다
        </p>
      </button>

      {/* Core Strength */}
      <button
        onClick={() => setSelectedLevel('core')}
        className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
        transition-all duration-200 text-left group"
      >
        <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
          초급 (Core Strength)
        </h3>
        <p className="text-gray-600 mt-2">
          실용적인 영어 패턴과 표현을 학습합니다
        </p>
      </button>

      {/* Speed Training */}
      <button
        onClick={() => setSelectedLevel('speed')}
        className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
        transition-all duration-200 text-left group"
      >
        <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
          중급 (Speed Training)
        </h3>
        <p className="text-gray-600 mt-2">
          상황별 영어 표현과 관용구를 학습합니다
        </p>
      </button>

      {/* Random Quiz */}
      <button
        onClick={() => setSelectedLevel('random')}
        className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
        transition-all duration-200 text-left group"
      >
        <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
          랜덤 퀴즈 풀기
        </h3>
        <p className="text-gray-600 mt-2">
          다양한 유형의 퀴즈로 학습 내용을 복습합니다
        </p>
      </button>

      {/* 로고와 소셜 미디어 링크 */}
      <div className="flex justify-center items-center gap-8 mt-12">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={250}
          height={250}
          priority
          className="opacity-90 hover:opacity-100 transition-opacity"
        />
        
        {/* 소셜 미디어 링크 */}
        <div className="flex gap-4">
          <a
            href="https://www.youtube.com/@user-speakenglish"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors"
          >
            <FaYoutube size={32} />
          </a>
          
          <a
            href="https://www.instagram.com/speakenglish_in_situation/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors"
          >
            <FaInstagram size={32} />
          </a>
          
          <a
            href="https://blog.naver.com/speakenglishinsituation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors"
          >
            <SiNaver size={32} />
          </a>
        </div>
      </div>
    </div>
  </div>
);

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
  const correctSoundRef = useRef(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLessonDetail, setShowLessonDetail] = useState(false);
  const [warmupCategory, setWarmupCategory] = useState(null);
  const [coreCategory, setCoreCategory] = useState(null);
  const [speedCategory, setSpeedCategory] = useState(null);
  const [totalPages, setTotalPages] = useState(Math.ceil(situationLessons.length / ITEMS_PER_PAGE));

  useEffect(() => {
    correctSoundRef.current = new Audio('/sounds/correct.mp3');
    if (correctSoundRef.current) {
      correctSoundRef.current.volume = 0.5;
    }
  }, []);

  const playCorrectSound = () => {
    if (correctSoundRef.current) {
      correctSoundRef.current.currentTime = 0;
      const playPromise = correctSoundRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Audio play error:', error);
        });
      }
    }
  };

  useEffect(() => {
    if (selectedLevel === 'idiom') {
      const questions = [...idiomQuizData.idiom.questions];
      const shuffled = questions.sort(() => Math.random() - 0.5);
      setShuffledQuestions(shuffled);
    }
  }, [selectedLevel]);

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
      playCorrectSound();
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
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const correct = checkAnswer(
      userAnswer,
      currentQuestion.answer
    );
    
    if (correct) {
      playCorrectSound();
      setScore(score + 1);
    }
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
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
    
    if (correct) {
      playCorrectSound();
      setScore(score + 1);
    }
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
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

  const handleWordOrderCheck = () => {
    const currentQuestion = wordOrderQuizData.wordOrder.questions[currentQuestionIndex];
    const userAnswer = selectedWords.join(' ');
    const correctAnswer = currentQuestion.correctOrder.join(' ');
    const isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) {
      playCorrectSound();
      setScore(score + 1);
    }
    
    setWordOrderCorrect(isCorrect);
    setShowFeedback(true);
    
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = userAnswer;
    setUserAnswers(newUserAnswers);
  };

  // 페이지네이션 계산
  const warmupTotalPages = Math.ceil(warmupLessons.length / ITEMS_PER_PAGE);
  const situationTotalPages = Math.ceil(situationLessons.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLessons = warmupLessons.slice(startIndex, endIndex);

  // Warm-up 레슨 선택 화면
  const renderWarmupLessons = () => (
    <div className="w-full max-w-4xl mx-auto p-8">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => setWarmupCategory(null)}
        className="mb-8 px-6 py-3 bg-white/90 backdrop-blur-sm text-[#004649] rounded-xl 
        hover:bg-white/80 transition-all duration-200 shadow-lg 
        font-medium text-lg flex items-center gap-2 hover:transform hover:translate-x-[-4px]"
        style={{ fontFamily: "'Pretendard', sans-serif" }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
            clipRule="evenodd" 
          />
        </svg>
        뒤로가기
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">기초 (Warm-up)</h2>
        <p className="text-gray-200">학습하고  레슨을 선하세요</p>
      </div>
      
      {/* 레슨 록 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentLessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson.id)}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl 
              transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-[#004649] group-hover:text-[#003639]">
                  {lesson.id.toString().padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 group-hover:text-black">
                    {lesson.title}
                  </h3>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-[#004649] text-white hover:bg-[#003639]'
          }`}
        >
          이전
        </button>
        
        <div className="flex gap-2">
          {[...Array(warmupTotalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-lg ${
                currentPage === i + 1
                  ? 'bg-[#004649] text-white'
                  : 'bg-white text-[#004649] hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, warmupTotalPages))}
          disabled={currentPage === warmupTotalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === warmupTotalPages 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-[#004649] text-white hover:bg-[#003639]'
          }`}
        >
          다음
        </button>
      </div>

      {/* 현재 페이지 표시 */}
      <p className="text-center mt-4 text-white">
        {currentPage} / {warmupTotalPages} 페이지
      </p>
    </div>
  );

  // 레슨 상세 화면
  const renderLessonDetail = (lessonId) => {
    const lesson = warmupLessons.find(l => l.id === lessonId);
    const details = lessonDetails[lessonId];

    return (
      <div className="w-full max-w-4xl mx-auto p-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {lesson.id.toString().padStart(2, '0')}. {lesson.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* YouTube 버튼 */}
            <a
              href={details?.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-6 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              <span className="text-xl font-medium">YouTube 영상 바로가기</span>
              <FaYoutube size={24} />
            </a>

            {/* PDF 다운로드 버튼 */}
            <a
              href={details?.pdfUrl}
              download
              className="flex items-center justify-between p-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <span className="text-xl font-medium">PDF 자료 다운로드</span>
              <FaFilePdf size={24} />
            </a>

            {/* 퀴즈 버튼 */}
            <button
              onClick={() => {
                setShowLessonDetail(false);
                // 퀴즈 시작 로직 추가
              }}
              className="flex items-center justify-between p-6 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <span className="text-xl font-medium">퀴즈로 확인하기</span>
              <FaQuestionCircle size={24} />
            </button>
          </div>

          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => {
              setShowLessonDetail(false);
              setSelectedLesson(null);
            }}
            className="mt-6 w-full p-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
          >
            레슨 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  };

  // Warm-up 카테고리 선택 화면
  const renderWarmupCategories = () => (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">기초 (Warm-up)</h2>
        <p className="text-gray-200">학습하고 싶은 카테고리를 선택하세요</p>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={() => setWarmupCategory('core')}
          className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
          transition-all duration-200 text-left group"
        >
          <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
            영어 핵심 뼈대 (1-50레슨)
          </h3>
          <p className="text-gray-600 mt-2">
            영어의 기본 문법과 구조를 체계적으로 학습합니다
          </p>
        </button>

        <button
          onClick={() => setWarmupCategory('words')}
          className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
          transition-all duration-200 text-left group"
        >
          <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
            미국인이 매일 쓰는 단어 1500개
          </h3>
          <p className="text-gray-600 mt-2">
            실생활에서 자주 사용되는 필수 영단어를 학습합니다
          </p>
        </button>

        <button
          onClick={() => setWarmupCategory('conjunctions')}
          className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
          transition-all duration-200 text-left group"
        >
          <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
            무조건 사용하는 접속사 100개
          </h3>
          <p className="text-gray-600 mt-2">
            문장을 자연스게 연결하는 필수 접속사를 학습합니다
          </p>
        </button>
      </div>

      <BackButton onClick={() => {
        setSelectedLevel(null);
        setWarmupCategory(null);
      }} />
    </div>
  );

  // 어 1500개 상세 화면
  const renderWordsDetail = () => (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            미국인이 매일 쓰는 단어 1500개
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* YouTube 버튼 */}
          <a
            href={wordsDetails.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-6 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            <span className="text-xl font-medium">YouTube 영상 바로가기</span>
            <FaYoutube size={24} />
          </a>

          {/* 퀴즈 버튼 */}
          <button
            onClick={() => {
              // 즈 시작 로직 추가
            }}
            className="flex items-center justify-between p-6 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <span className="text-xl font-medium">퀴즈로 확인하기</span>
            <FaQuestionCircle size={24} />
          </button>
        </div>

        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => setWarmupCategory(null)}
          className="mt-6 w-full p-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
        >
          카테고리 목록으로 돌아가기
        </button>
      </div>
      <BackButton onClick={() => setWarmupCategory(null)} />
    </div>
  );

  // 접속사 100개 상세 화면
  const renderConjunctionsDetail = () => (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            무조 사용하는 접속사 100개
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* YouTube 버튼 */}
          <a
            href={conjunctionsDetails.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-6 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            <span className="text-xl font-medium">YouTube 영상 바로가기</span>
            <FaYoutube size={24} />
          </a>

          {/* PDF 다운로드 버튼 */}
          <a
            href={conjunctionsDetails.pdfUrl}
            download
            className="flex items-center justify-between p-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <span className="text-xl font-medium">PDF 자료 다운로드</span>
            <FaFilePdf size={24} />
          </a>

          {/* 퀴즈 버튼 */}
          <button
            onClick={() => {
              // 퀴즈 시작 로직 추가
            }}
            className="flex items-center justify-between p-6 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <span className="text-xl font-medium">퀴즈로 확인하기</span>
            <FaQuestionCircle size={24} />
          </button>
        </div>

        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => setWarmupCategory(null)}
          className="mt-6 w-full p-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
        >
          카테고리 목록으로 돌아가기
        </button>
      </div>
      <BackButton onClick={() => setWarmupCategory(null)} />
    </div>
  );

  // Core Strength 카테고리 선택 화면
  const renderCoreCategories = () => (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">초급 (Core Strength)</h2>
        <p className="text-gray-200">학습하고 싶은 카테고리를 선택하세요</p>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={() => setCoreCategory('patterns')}
          className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
          transition-all duration-200 text-left group"
        >
          <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
            ⭐영어 패턴 100개 DIN 연습하기 (평서문-의문문-부정문)
          </h3>
          <p className="text-gray-600 mt-2">
            실용적인 영어 패턴을 체계적으로 학습합니다
          </p>
        </button>

        <button
          onClick={() => setCoreCategory('questions')}
          className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
          transition-all duration-200 text-left group"
        >
          <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
            일상에서 꼭 써먹는 의문문 패턴 50개
          </h3>
          <p className="text-gray-600 mt-2">
            실생활에서 자주 사용되는 의문문을 학습합니다
          </p>
        </button>

        <button
          onClick={() => setCoreCategory('travel')}
          className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
          transition-all duration-200 text-left group"
        >
          <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
            여행가서 쓸 수 있는 질문 100개
          </h3>
          <p className="text-gray-600 mt-2">
            여행시 필요한 실용적인 질문들을 학습합니다
          </p>
        </button>

        <button
          onClick={() => setCoreCategory('responses')}
          className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
          transition-all duration-200 text-left group"
        >
          <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
            Yes! 대신 쓸 수 있는 영어 맞장구 100개
          </h3>
          <p className="text-gray-600 mt-2">
            자연스러 영어 대화를 위한 다양한 맞장구 표현을 학습합니다
          </p>
        </button>
      </div>

      <BackButton onClick={() => {
        setSelectedLevel(null);
        setCoreCategory(null);
      }} />
    </div>
  );

  // Speed Training 카테고리 렌더링 함수 추가
  const renderSpeedCategories = () => (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">중급 (Speed Training)</h2>
        <p className="text-gray-200">학습하고 싶은 카테고리를 선택하세요</p>
      </div>
      
      <div className="space-y-4">
        {/* 상황별 쓰는 영어 표현 */}
        <button
          onClick={() => setSpeedCategory('situations')}
          className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
          transition-all duration-200 text-left group"
        >
          <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
            ⭐상황별 쓰는 영어 표현 (1-50레슨)
          </h3>
          <p className="text-gray-600 mt-2">
            다양한 상황에서 자주 사용되는 영어 표현을 학습합니다
          </p>
        </button>

        {/* 부사 100개 */}
        <button
          onClick={() => setSpeedCategory('adverbs')}
          className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
          transition-all duration-200 text-left group"
        >
          <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
            속 시원하게 말하게 도와주는 부사 100개
          </h3>
          <p className="text-gray-600 mt-2">
            자연스러운 영어 표현을 위한 핵심 부사를 학습합니다
          </p>
        </button>

        {/* 관용표현 100개 */}
        <button
          onClick={() => setSpeedCategory('idioms')}
          className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
          transition-all duration-200 text-left group"
        >
          <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
            원어민이 매일 쓰는 관용표현 100개
          </h3>
          <p className="text-gray-600 mt-2">
            실제 원어민들이 자주 사용하는 관용구를 학습합니다
          </p>
        </button>

        {/* 사진 묘사 연습 */}
        <button
          onClick={() => setSpeedCategory('description')}
          className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
          transition-all duration-200 text-left group"
        >
          <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
            사진 묘사하고 핵심 표현 연습하기
          </h3>
          <p className="text-gray-600 mt-2">
            사진을 보고 상황을 설명하는 표현을 학습합니다
          </p>
        </button>
      </div>

      <BackButton onClick={() => setSelectedLevel(null)} />
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#004649] to-[#002829] p-8">
      {/* 메인 메뉴 */}
      {!selectedLevel && !warmupCategory && !coreCategory && !speedCategory && (
        <div className="w-full max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">학습 레벨 선택</h2>
            <p className="text-gray-200">학습하고 싶은 레벨을 선택하세요</p>
          </div>
          
          <div className="space-y-4">
            {/* Warm-up */}
            <button
              onClick={() => setSelectedLevel('warmup')}
              className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
              transition-all duration-200 text-left group"
            >
              <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
                기초 (Warm-up)
              </h3>
              <p className="text-gray-600 mt-2">
                영어의 기본 문법과 구조를 체계적으로 학습합니다
              </p>
            </button>

            {/* Core Strength */}
            <button
              onClick={() => setSelectedLevel('core')}
              className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
              transition-all duration-200 text-left group"
            >
              <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
                초급 (Core Strength)
              </h3>
              <p className="text-gray-600 mt-2">
                실용적인 영어 패턴과 표현을 학습합니다
              </p>
            </button>

            {/* Speed Training */}
            <button
              onClick={() => setSelectedLevel('speed')}
              className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
              transition-all duration-200 text-left group"
            >
              <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
                중급 (Speed Training)
              </h3>
              <p className="text-gray-600 mt-2">
                상황별 영어 표현과 관용구를 학습합니다
              </p>
            </button>

            {/* Random Quiz */}
            <button
              onClick={() => setSelectedLevel('random')}
              className="w-full p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white/80 
              transition-all duration-200 text-left group"
            >
              <h3 className="text-xl font-bold text-[#004649] group-hover:text-[#003639]">
                랜덤 퀴즈 풀기
              </h3>
              <p className="text-gray-600 mt-2">
                다양한 유형의 퀴즈로 학습 내용을 복습합니다
              </p>
            </button>

            {/* 로고와 소셜 미디어 링크 */}
            <div className="flex justify-center items-center gap-8 mt-12">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={200}
                height={200}
                priority
                className="opacity-90 hover:opacity-100 transition-opacity"
              />
              
              {/* 소셜 미디어 링크 */}
              <div className="flex gap-4">
                <a
                  href="https://www.youtube.com/@user-speakenglish"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <FaYoutube size={32} />
                </a>
                
                <a
                  href="https://www.instagram.com/speakenglish_in_situation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <FaInstagram size={32} />
                </a>
                
                <a
                  href="https://blog.naver.com/speakenglishinsituation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <SiNaver size={32} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warm-up 카테고리 */}
      {selectedLevel === 'warmup' && !warmupCategory && renderWarmupCategories()}
      {selectedLevel === 'warmup' && warmupCategory === 'core' && renderWarmupLessons()}
      {selectedLevel === 'warmup' && warmupCategory === 'words' && renderWordsDetail()}
      {selectedLevel === 'warmup' && warmupCategory === 'conjunctions' && renderConjunctionsDetail()}

      {/* Core Strength 카테고리 */}
      {selectedLevel === 'core' && !coreCategory && renderCoreCategories()}
      {selectedLevel === 'core' && coreCategory && renderCoreStrengthDetail(coreCategory)}

      {/* Speed Training 카테고리 */}
      {selectedLevel === 'speed' && !speedCategory && renderSpeedCategories()}
      {selectedLevel === 'speed' && speedCategory === 'situations' && !showLessonDetail && renderSituationLessons()}
      {selectedLevel === 'speed' && speedCategory === 'situations' && showLessonDetail && renderSituationDetail(selectedLesson)}

      {/* Random Quiz */}
      {selectedLevel === 'random' && renderRandomQuizCategories()}
      {selectedLevel === 'idiom' && !showScore && shuffledQuestions.length > 0 && renderIdiomQuiz()}
      {selectedLevel === 'adverb' && !showScore && renderAdverbQuiz()}
      {selectedLevel === 'wordOrder' && !showScore && renderWordOrderQuiz()}
      {showScore && renderScore()}
    </main>
  );
}