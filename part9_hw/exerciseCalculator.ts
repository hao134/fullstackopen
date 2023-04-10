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

function isArrayNumeric(arr: any[]): boolean {
  return arr.every(item => !isNaN(item));
}
  
const parseInput = (args: string[]): ExerciseValues => {
    if (args.length < 4) throw new Error('Not enough arguments');
    const target = Number(args[2]);
    const dailyHours = args.slice(3).map(Number);
  
    if (!isNaN(target) && isArrayNumeric(dailyHours)) {
      return {
        target: target,
        dailyHours: dailyHours
      }
    } else {
      throw new Error('Provided values were not numbers!')
    }
}

const calculateExercises = (target: number, dailyHours: number[]): Result => {
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


try {
  const { target, dailyHours } = parseInput(process.argv);
  console.log(calculateExercises(target, dailyHours))
} catch (error: unknown) {
  let errorMessage = 'Something bad happend.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message
  }
    console.log(errorMessage)
}