import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const getQuizSessionKey = (quizId) => `quizSession-${quizId}`;
const loadQuizSession = (quizId) => {
  const data = localStorage.getItem(getQuizSessionKey(quizId));
  return data ? JSON.parse(data) : null;
};
const getAllQuizSessions = () => {
  const sessions = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('quizSession-')) {
      const session = loadQuizSession(key.replace('quizSession-', ''));
      if (session) sessions.push(session);
    }
  }
  return sessions;
};

const QuizTracking = () => {
  const [quizSessions, setQuizSessions] = useState([]);
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setQuizSessions(getAllQuizSessions());
  }, []);

  const handleStartOrRetake = (session) => {
    // Pass quiz params via state or query params if needed
    navigate('/quiz');
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-6 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 border border-gray-100">
        <h1 className="text-3xl font-bold mb-8 text-[#14152E] text-center">Quiz Progress Tracking</h1>
        <div className="overflow-x-auto">
          {quizSessions.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No quiz attempts found. Start a quiz to see your progress here.</div>
          ) : (
            <table className="min-w-full border-collapse text-sm md:text-base">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-b p-3 text-left font-semibold">Quiz ID</th>
                  <th className="border-b p-3 text-left font-semibold">Status</th>
                  <th className="border-b p-3 text-left font-semibold">Score</th>
                  <th className="border-b p-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizSessions.map((session) => {
                  const isCompleted = session.completed;
                  return (
                    <React.Fragment key={session.quizId}>
                      <tr className="even:bg-gray-50">
                        <td className="border-b p-3 font-medium text-[#14152E]">{session.quizId}</td>
                        <td className="border-b p-3 capitalize">
                          {isCompleted ? (
                            <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">Completed</span>
                          ) : (
                            <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold">In Progress</span>
                          )}
                        </td>
                        <td className="border-b p-3">
                          {isCompleted ? (
                            <span className="font-semibold">{session.score}/{session.questions.length}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="border-b p-3">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button onClick={() => handleStartOrRetake(session)} size="sm" variant="outline">Retake</Button>
                            {isCompleted && (
                              <Button onClick={() => setExpandedQuiz(expandedQuiz === session.quizId ? null : session.quizId)} size="sm" variant="secondary">
                                {expandedQuiz === session.quizId ? 'Hide Result' : 'Show Result'}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isCompleted && expandedQuiz === session.quizId && (
                        <tr>
                          <td colSpan={4} className="bg-gray-50 p-4 border-b">
                            <div className="text-left">
                              <h3 className="text-lg font-bold mb-2">Quiz Result</h3>
                              <div className="space-y-4">
                                {session.questions.map((q, idx) => {
                                  const userAnswer = session.userAnswers[idx];
                                  const correct = userAnswer === q.correct_answer;
                                  return (
                                    <div key={idx} className={`p-3 rounded border ${correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                      <div className="flex items-start">
                                        <div className={`mt-1 mr-3 ${correct ? 'text-green-600' : 'text-red-600'}`}>{idx + 1}.</div>
                                        <div className="flex-1">
                                          <p className="font-medium text-[#14152E] mb-2">{q.question}</p>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base">
                                            <div className={`p-2 rounded ${correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                              <span className="font-medium">Your answer:</span> {userAnswer || <span className="italic text-gray-400">No answer</span>}
                                            </div>
                                            {!correct && (
                                              <div className="p-2 rounded bg-green-100 text-green-800">
                                                <span className="font-medium">Correct answer:</span> {q.correct_answer}
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
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTracking; 