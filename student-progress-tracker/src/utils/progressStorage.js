// src/utils/progressStorage.js

export function getProgressHistory() {
  const data = localStorage.getItem("progressHistory");
  return data ? JSON.parse(data) : [];
}

export function saveMonthlyProgress(monthData) {
  const history = getProgressHistory();
  history.push(monthData);
  localStorage.setItem("progressHistory", JSON.stringify(history));
}
