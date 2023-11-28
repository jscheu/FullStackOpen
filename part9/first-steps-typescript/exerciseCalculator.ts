export interface calculateExercisesResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export interface exerciseCalulatorInputValues {
  trainingData: number[];
  target: number;
}

const parseInputValues = (args: string[]): exerciseCalulatorInputValues => {
  if (args.length < 4) throw new Error('Missing input data.');

  const target: number = Number(args[2]);
  if (isNaN(target)) throw new Error('Target value must be a number.');

  const trainingData: number[] = [];
  for (let i = 3; i < args.length; i++) {
    const trainingHours: number = Number(args[i]);
    if (isNaN(trainingHours))
      throw new Error('Training hours must be numbers.');

    trainingData.push(trainingHours);
  }

  return {
    trainingData,
    target
  };
};

export const calculateExercises = (
  trainingData: number[],
  target: number
): calculateExercisesResult => {
  if (target <= 0) throw new Error('Target must be greater than zero.');
  if (trainingData.length === 0) throw new Error('No data was given.');

  const periodLength: number = trainingData.length;
  let totalHours: number = 0;
  let trainingDays: number = 0;

  for (let i = 0; i < trainingData.length; i++) {
    const currentDayTrainingHours: number = trainingData[i];

    if (currentDayTrainingHours < 0)
      throw new Error('Training hours cannot be less than zero.');

    totalHours += currentDayTrainingHours;
    if (currentDayTrainingHours > 0) trainingDays++;
  }

  const average: number = totalHours / periodLength;
  const success: boolean = average >= target;

  let rating: number;
  if (average < target / 2) rating = 1;
  else if (average < target) rating = 2;
  else rating = 3;

  let ratingDescription: string;
  if (rating === 1) ratingDescription = 'Needs improvement.';
  else if (rating === 2) ratingDescription = 'Not bad but could be better.';
  else if (rating === 3)
    ratingDescription = 'Great job! Keep up the good work.';
  else ratingDescription = 'The laws of physics have collapsed.';

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

try {
  const { trainingData, target } = parseInputValues(process.argv);
  console.log(calculateExercises(trainingData, target));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
    console.log(errorMessage);
  }
}
