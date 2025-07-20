// quizProgress.js: Helper for quiz progress tracking in localStorage

// Key used in localStorage
const STORAGE_KEY = 'quizProgress';

// Get all quiz progress data
export function getAllQuizProgress() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

// Get progress for a specific quizId
export function getQuizProgress(quizId) {
  const all = getAllQuizProgress();
  return all[quizId] || null;
}

// Set/update progress for a specific quizId
export function setQuizProgress(quizId, progress) {
  const all = getAllQuizProgress();
  all[quizId] = progress;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

// Reset all quiz progress (for debugging/testing)
export function resetAllQuizProgress() {
  localStorage.removeItem(STORAGE_KEY);
} 