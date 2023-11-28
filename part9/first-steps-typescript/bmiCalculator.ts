interface BmiInputValues {
  height: number;
  weight: number;
}

const parseInput = (args: string[]): BmiInputValues => {
  if (args.length < 4) throw new Error('Missing input value(s).');
  if (args.length > 4) throw new Error('Too many input values.');

  const height: number = Number(args[2]);
  const weight: number = Number(args[3]);

  if (isNaN(height) || isNaN(weight))
    throw new Error('Input values must be numbers.');

  return {
    height,
    weight
  };
};

export const calculateBmi = (height: number, weight: number): string => {
  if (height <= 0 || weight <= 0)
    throw new Error('Height and weight must be greater than zero.');

  const bmi: number = weight / ((height / 100) ^ 2);

  if (bmi < 18.5) return 'Underweight';
  else if (bmi < 25) return 'Normal (healthy weight)';
  else if (bmi < 30) return 'Overweight';
  else return 'Obese';
};

try {
  const { height, weight } = parseInput(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
