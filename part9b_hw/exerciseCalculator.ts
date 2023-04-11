interface Result {
  numberDays: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: number;
  raringDescription: string;
}
interface ExerciseValues {
  target: number;
  dailyHours: number[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isArrayNumeric(arr: any[]): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return arr.every(item => !isNaN(item));
}

export const parseInput = (target: string, dailyHours: string[]): ExerciseValues => {
  if (Number(target) <= 0) {
    throw new Error("Target must be a positive value!");
  }
  if (!Array.isArray(dailyHours)) {
    throw new Error("Exercised days must be an array of values!");
  }

  if (!isNaN(Number(target)) && isArrayNumeric(dailyHours)) {
    return {
      target: Number(target),
      dailyHours: dailyHours.map((hour) => Number(hour))
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calculateExercises = (target: number, dailyHours: number[]): Result => {
  const numberDays = dailyHours.length;
  const trainingDays = dailyHours.filter(hour => hour !== 0).length;
  const average = dailyHours.reduce((a, b) => a + b, 0) / numberDays;
  const success = average >= target;

  const getRating = (average: number, target: number): number => {
    if (average < target * 0.7) return 1;
    if (average < target) return 2;
    return 3;
  };

  const getRatingDescription = (rating: number): string => {
    if (rating === 1) return 'fail';
    if (rating === 2) return 'acceptable';
    return 'good';
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
  };
};


// try {
//   const { target, dailyHours } = parseInput(process.argv[2], process.argv.slice(3));
//   console.log(calculateExercises(target, dailyHours));
// } catch (error: unknown) {
//   let errorMessage = 'Something bad happend.';
//   if (error instanceof Error) {
//     errorMessage += ' Error: ' + error.message;
//   }
//   console.log(errorMessage);
// }