interface Result {
    numberDays: number;
    trainingDays: number;
    target: number;
    average: number;
    success: boolean;
    rating: number;
    raringDescription: string;
}

const calculateExercises = (dailyHours: number[], target: number): Result => {
  const numberDays = dailyHours.length;
  const trainingDays = dailyHours.filter(hour => hour !== 0).length;
  const average = dailyHours.reduce((a, b) => a + b, 0) / numberDays;
  const success = average >= target;

  const getRating = (average: number, target: number): number => {
    if (average < target * 0.7) return 1;
    if (average < target) return 2;
    if (average >= target) return 3;
  };

  const getRatingDescription = (rating: number): string => {
    if (rating === 1) return 'fail';
    if (rating === 2) return 'acceptable';
    if (rating === 3) return 'good';
  };

  const rating = getRating(average, target);
  const raringDescription = getRatingDescription(rating);

  return {
    numberDays,
    trainingDays,
    target,
    average,
    success,
    rating,
    raringDescription
  }
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 0.5))