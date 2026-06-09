// src/ml/featureExtractor.js

export function extractFeatures(habit) {
  const progress = habit.progress; // boolean[]
  const totalDays = progress.length;

  // yesterday status
  const lastDayDone = progress[totalDays - 1] ? 1 : 0;

  // streak length
  let streak = 0;
  for (let i = totalDays - 1; i >= 0; i--) {
    if (progress[i]) streak++;
    else break;
  }

  // misses in last 7 days
  const last7 = progress.slice(-7);
  const missCount7 = last7.filter(d => !d).length;

  // habit age
  const habitAge =
    Math.floor(
      (Date.now() - new Date(habit.creationDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ) || 1;

  // day of week (0–6)
  const dayOfWeek = new Date().getDay();

  return [
    lastDayDone,
    streak,
    missCount7,
    habitAge,
    dayOfWeek,
  ];
}

/**
 * Builds training dataset from habits
 */
export function buildDataset(habits) {
  const xs = [];
  const ys = [];

  habits.forEach(habit => {
    for (let i = 1; i < habit.progress.length; i++) {
      xs.push(extractFeatures({
        ...habit,
        progress: habit.progress.slice(0, i),
      }));

      ys.push(habit.progress[i] ? 1 : 0);
    }
  });

  return { xs, ys };
}
