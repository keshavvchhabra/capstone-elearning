import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  Award, 
  Book, 
  Clock, 
  BarChart, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Target, 
  HelpCircle, 
  List, 
  Calendar, 
  Timer,
  ArrowRight,
  AlertTriangle,
  Layout,
  Grid,
  Check,
  X,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setQuizProgress } from '@/lib/quizProgress';

const QuizApp = () => {
  const [step, setStep] = useState('category'); // category -> difficulty -> type -> quiz -> results
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [difficulty, setDifficulty] = useState('');
  const [type, setType] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizEndTime, setQuizEndTime] = useState(null);
  
 
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('https://opentdb.com/api_category.php');
        const data = await res.json();
        setCategories(data.trivia_categories);
      } catch (err) {
        setError('Failed to load categories. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  

  useEffect(() => {
    if (step === 'quiz' && questions.length > 0 && !quizStartTime) {
      setQuizStartTime(new Date());
    }
  }, [step, questions, quizStartTime]);
  
  
  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const url = `https://opentdb.com/api.php?amount=10&category=${selectedCategory.id}&difficulty=${difficulty}&type=${type}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.response_code === 0) {
        // Success
        setQuestions(data.results);
        setStep('quiz');
      } else {
        
        switch(data.response_code) {
          case 1:
            setError('Not enough questions available. Try with different options.');
            break;
          case 2:
            setError('Invalid parameter in API request.');
            break;
          default:
            setError('Something went wrong. Please try again.');
        }
      }
    } catch (err) {
      setError('Failed to load questions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setStep('difficulty');
  };
  
  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setStep('type');
  };
  
  const handleTypeSelect = (selectedType) => {
    setType(selectedType);
    fetchQuestions();
  };
  
  const handleAnswerSelect = (answer) => {
    const newAnswers = {
      ...answers,
      [currentQuestionIndex]: answer
    };
    setAnswers(newAnswers);
    // Save session to localStorage as user answers
    const quizId = `${selectedCategory?.id}-${difficulty}-${type}`;
    if (questions.length > 0 && selectedCategory && difficulty && type) {
      const session = loadQuizSession(quizId) || {
        quizId,
        questions,
        userAnswers: {},
        startedAt: quizStartTime ? quizStartTime.toISOString() : new Date().toISOString(),
        completed: false,
        score: 0,
        completedAt: null,
      };
      session.userAnswers = newAnswers;
      saveQuizSession(quizId, session);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizComplete(true);
      setQuizEndTime(new Date());
      setStep('results');
      // Save progress to localStorage
      const quizId = `${selectedCategory.id}-${difficulty}-${type}`;
      const score = calculateScore();
      const progress = {
        status: 'completed',
        lastAttemptDate: new Date().toISOString(),
        score,
        totalQuestions: questions.length,
        answers: questions.map((question, index) => ({
          question: question.question,
          userAnswer: answers[index],
          correctAnswer: question.correct_answer,
          explanation: '' // No explanation from API
        }))
      };
      setQuizProgress(quizId, progress);
      // Update quiz session with completion info
      const session = loadQuizSession(quizId);
      if (session) {
        session.completed = true;
        session.score = score;
        session.completedAt = new Date().toISOString();
        session.userAnswers = { ...answers };
        saveQuizSession(quizId, session);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        score++;
      }
    });
    return score;
  };

  const calculateQuizTime = () => {
    if (!quizStartTime || !quizEndTime) return "00:00";
    
    const seconds = Math.floor((quizEndTime - quizStartTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const resetQuiz = () => {
    setStep('category');
    setSelectedCategory(null);
    setDifficulty('');
    setType('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizComplete(false);
    setQuizStartTime(null);
    setQuizEndTime(null);
  };
  
  // Helper to decode HTML entities
  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };
  
  // Shuffle array for randomizing answer options
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Get all answers (correct + incorrect) for current question
  const getAllAnswers = () => {
    if (!questions[currentQuestionIndex]) return [];
    
    const correct = questions[currentQuestionIndex].correct_answer;
    const incorrect = questions[currentQuestionIndex].incorrect_answers;
    
    // Create a cached property for shuffled answers to maintain consistent order
    if (!questions[currentQuestionIndex].allAnswers) {
      questions[currentQuestionIndex].allAnswers = shuffleArray([correct, ...incorrect]);
    }
    
    return questions[currentQuestionIndex].allAnswers;
  };

  // Get difficulty icon
  const getDifficultyIcon = (difficultyLevel) => {
    switch(difficultyLevel) {
      case 'easy': 
        return <Book className="h-6 w-6 text-green-500" />;
      case 'medium': 
        return <BookOpen className="h-6 w-6 text-yellow-500" />;
      case 'hard': 
        return <Target className="h-6 w-6 text-red-500" />;
      default: 
        return <HelpCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  // Get category icon (simplified version)
  const getCategoryIcon = (categoryName) => {
    if (categoryName?.includes("Science")) return <BarChart className="h-5 w-5 text-[#A84261]" />;
    if (categoryName?.includes("History")) return <Calendar className="h-5 w-5 text-[#A84261]" />;
    if (categoryName?.includes("Geography")) return <Layout className="h-5 w-5 text-[#A84261]" />;
    if (categoryName?.includes("Entertainment")) return <Grid className="h-5 w-5 text-[#A84261]" />;
    if (categoryName?.includes("Sports")) return <Target className="h-5 w-5 text-[#A84261]" />;
    return <List className="h-5 w-5 text-[#A84261]" />;
  };

  const getQuizSessionKey = (quizId) => `quizSession-${quizId}`;

  const saveQuizSession = (quizId, session) => {
    localStorage.setItem(getQuizSessionKey(quizId), JSON.stringify(session));
  };

  const loadQuizSession = (quizId) => {
    const data = localStorage.getItem(getQuizSessionKey(quizId));
    return data ? JSON.parse(data) : null;
  };
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA] text-center p-4">
        <div className="bg-red-50 text-red-800 p-6 rounded-lg mb-6 max-w-md w-full shadow-md">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
        <Button onClick={resetQuiz} className="bg-[#D9614E] hover:bg-[#C54E3D] text-white font-medium flex items-center gap-2 px-6 py-3">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#14152E]">
      {/* Header */}
      <div className="text-center pt-12 pb-6 px-4">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#14152E]">
            <span className="text-[#A84261]">Akademy</span> Quiz
          </h1>
        </div>
        <p className="text-gray-600 mt-2">Test your knowledge with our interactive quizzes</p>
      </div>
      
      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32">
            <RefreshCw className="animate-spin h-16 w-16 text-[#D9614E] mb-4" />
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        )}
        
        {/* Category selection */}
        {!isLoading && step === 'category' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-[#14152E] mb-3 flex items-center">
              <List className="h-6 w-6 text-[#D9614E] mr-2" />
              Select a Category
            </h2>
            <p className="text-gray-600 mb-8">Choose a topic that interests you</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-5 text-left transition-all hover:shadow-md group"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {getCategoryIcon(category.name)}
                      <span className="font-medium text-[#14152E] ml-2">{category.name}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#D9614E] transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Difficulty selection */}
        {!isLoading && step === 'difficulty' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="mb-8">
              <button 
                onClick={() => setStep('category')} 
                className="text-[#A84261] hover:text-[#D9614E] hover:underline flex items-center gap-1 mb-4 font-medium"
              >
                <ChevronLeft className="h-4 w-4" /> Back to Categories
              </button>
              <h2 className="text-3xl font-bold text-[#14152E] mb-3 flex items-center">
                <Target className="h-6 w-6 text-[#D9614E] mr-2" />
                Select Difficulty
              </h2>
              <div className="flex items-center text-gray-600 mt-2 bg-gray-50 p-3 rounded-md inline-block">
                {getCategoryIcon(selectedCategory?.name)}
                <p className="ml-2">Category: {selectedCategory?.name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { level: 'easy', label: 'Easy', icon: <Book className="h-6 w-6" />, color: 'text-green-500', bg: 'bg-green-50' },
                { level: 'medium', label: 'Medium', icon: <BookOpen className="h-6 w-6" />, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                { level: 'hard', label: 'Hard', icon: <Target className="h-6 w-6" />, color: 'text-red-500', bg: 'bg-red-50' }
              ].map((item) => (
                <button
                  key={item.level}
                  onClick={() => handleDifficultySelect(item.level)}
                  className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-8 text-center transition-all hover:shadow-md flex flex-col items-center group"
                >
                  <div className={`${item.bg} p-4 rounded-full mb-4 group-hover:scale-110 transition-transform`}>
                    <div className={item.color}>{item.icon}</div>
                  </div>
                  <span className="font-medium text-xl capitalize text-[#14152E]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Type selection */}
        {!isLoading && step === 'type' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="mb-8">
              <button 
                onClick={() => setStep('difficulty')} 
                className="text-[#A84261] hover:text-[#D9614E] hover:underline flex items-center gap-1 mb-4 font-medium"
              >
                <ChevronLeft className="h-4 w-4" /> Back to Difficulty
              </button>
              <h2 className="text-3xl font-bold text-[#14152E] mb-3 flex items-center">
                <HelpCircle className="h-6 w-6 text-[#D9614E] mr-2" />
                Select Question Type
              </h2>
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-md">
                  {getCategoryIcon(selectedCategory?.name)}
                  <p className="ml-2">Category: {selectedCategory?.name}</p>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-md">
                  {getDifficultyIcon(difficulty)}
                  <p className="ml-2 capitalize">Difficulty: {difficulty}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <button
                onClick={() => handleTypeSelect('multiple')}
                className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-8 text-center transition-all hover:shadow-md flex flex-col items-center group"
              >
                <div className="bg-[#A84261] bg-opacity-10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <List className="h-8 w-8 text-[#A84261]" />
                </div>
                <span className="font-medium text-xl text-[#14152E]">Multiple Choice</span>
                <p className="text-gray-600 text-base mt-2">Choose from several possible answers</p>
              </button>
              
              <button
                onClick={() => handleTypeSelect('boolean')}
                className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-8 text-center transition-all hover:shadow-md flex flex-col items-center group"
              >
                <div className="bg-[#A84261] bg-opacity-10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <div className="flex">
                    <Check className="h-8 w-8 text-green-500 mr-1" />
                    <X className="h-8 w-8 text-red-500" />
                  </div>
                </div>
                <span className="font-medium text-xl text-[#14152E]">True / False</span>
                <p className="text-gray-600 text-base mt-2">Answer with True or False only</p>
              </button>
            </div>
          </div>
        )}
        
        {/* Quiz questions */}
        {!isLoading && step === 'quiz' && questions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-[#14152E] flex items-center">
                  <HelpCircle className="h-6 w-6 text-[#D9614E] mr-2" />
                  Question {currentQuestionIndex + 1}/{questions.length}
                </h2>
                <span className="text-base bg-[#A84261] bg-opacity-10 text-[#A84261] px-4 py-2 rounded-full font-medium flex items-center">
                  <Timer className="h-5 w-5 mr-2" />
                  Quiz in progress
                </span>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="flex items-center text-gray-600 bg-gray-100 p-2 rounded-md text-sm">
                  {getCategoryIcon(selectedCategory?.name)}
                  <p className="ml-1">{selectedCategory?.name}</p>
                </div>
                <div className="flex items-center text-gray-600 bg-gray-100 p-2 rounded-md text-sm">
                  {getDifficultyIcon(difficulty)}
                  <p className="ml-1 capitalize">{difficulty}</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mt-6">
                <div 
                  className="bg-[#D9614E] h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-2xl font-medium text-[#14152E] mb-8">
                {decodeHTML(questions[currentQuestionIndex].question)}
              </h3>
              
              <div className="space-y-4">
                {getAllAnswers().map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(answer)}
                    className={`w-full text-left p-4 rounded-lg border transition-all flex items-center ${
                      answers[currentQuestionIndex] === answer
                        ? 'bg-[#A84261] bg-opacity-10 border-[#A84261] ring-2 ring-[#A84261] text-[#14152E]'
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-[#14152E]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center ${
                      answers[currentQuestionIndex] === answer
                        ? 'bg-[#D9614E] text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    {decodeHTML(answer)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-5 py-3 flex items-center gap-2 ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              
              <Button
                onClick={handleNextQuestion}
                disabled={answers[currentQuestionIndex] === undefined}
                className={`px-6 py-3 flex items-center gap-2 ${
                  answers[currentQuestionIndex] === undefined
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-[#D9614E] hover:bg-[#C54E3D] text-white'
                }`}
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>Next <ArrowRight className="h-4 w-4" /></>
                ) : (
                  <>Finish Quiz <CheckCircle2 className="h-4 w-4" /></>
                )}
              </Button>
            </div>

            {/* Question navigation */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-3 justify-center">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-medium transition-all
                      ${currentQuestionIndex === index 
                        ? 'bg-[#D9614E] text-white' 
                        : answers[index] !== undefined 
                          ? 'bg-[#A84261] bg-opacity-20 text-[#A84261]' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Results */}
        {!isLoading && step === 'results' && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
            <div className="mb-8 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-5xl font-bold text-[#A84261]">
                  {calculateScore()}/{questions.length}
                </div>
              </div>
              <svg className="w-48 h-48 mx-auto" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E6E6E6"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#D9614E"
                  strokeWidth="2"
                  strokeDasharray={`${(calculateScore() / questions.length) * 100}, 100`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            
            <Award className="h-20 w-20 mx-auto text-[#D9614E] mb-4" />
            <h2 className="text-4xl font-bold text-[#14152E] mb-3">Quiz Complete!</h2>
            <p className="text-gray-600 mb-6 text-lg">
              You scored <span className="font-bold text-[#A84261]">{calculateScore()}</span> out of <span className="font-bold">{questions.length}</span>
            </p>
            
            <div className="flex justify-center gap-10 mb-10">
              <div className="text-center">
                <div className="bg-[#A84261] bg-opacity-10 p-4 rounded-full mb-3 inline-block">
                  <Clock className="h-8 w-8 text-[#A84261]" />
                </div>
                <p className="text-base text-gray-600">Time</p>
                <p className="font-semibold text-xl text-[#14152E]">{calculateQuizTime()}</p>
              </div>
              <div className="text-center">
                <div className="bg-[#A84261] bg-opacity-10 p-4 rounded-full mb-3 inline-block">
                  <Target className="h-8 w-8 text-[#A84261]" />
                </div>
                <p className="text-base text-gray-600">Accuracy</p>
                <p className="font-semibold text-xl text-[#14152E]">{Math.round((calculateScore() / questions.length) * 100)}%</p>
              </div>
              
              <div className="text-center">
                <div className="bg-[#A84261] bg-opacity-10 p-4 rounded-full mb-3 inline-block">
                  <BarChart className="h-8 w-8 text-[#A84261]" />
                </div>
                <p className="text-base text-gray-600">Difficulty</p>
                <p className="font-semibold text-xl text-[#14152E] capitalize">{difficulty}</p>
              </div>
            </div>
            
            <div className="flex justify-center mb-12">
              <Button
                onClick={resetQuiz}
                className="bg-[#D9614E] hover:bg-[#C54E3D] text-white px-8 py-4 text-lg font-medium flex items-center gap-2"
              >
                <RefreshCw className="h-5 w-5" /> Start New Quiz
              </Button>
            </div>
            
            {/* Question review */}
            <div className="mt-12 text-left border-t border-gray-200 pt-8">
              <h3 className="text-2xl font-bold text-[#14152E] mb-6 flex items-center">
                <List className="h-6 w-6 text-[#D9614E] mr-2" />
                Review Your Answers
              </h3>
              <div className="space-y-5">
                {questions.map((question, index) => {
                  const isCorrect = answers[index] === question.correct_answer;
                  
                  return (
                    <div key={index} className={`p-5 rounded-lg border ${
                      isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-start">
                        <div className={`mt-1 mr-3 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {isCorrect ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#14152E] mb-3 text-lg">
                            {index + 1}. {decodeHTML(question.question)}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base">
                            <div className={`p-3 rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              <span className="font-medium">Your answer:</span> {decodeHTML(answers[index])}
                            </div>
                            
                            {!isCorrect && (
                              <div className="p-3 rounded bg-green-100 text-green-800">
                                <span className="font-medium">Correct answer:</span> {decodeHTML(question.correct_answer)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizApp;