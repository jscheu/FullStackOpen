import express from 'express';
const app = express();

import { calculateBmi } from './bmiCalculator';
import {
  calculateExercisesResult,
  calculateExercises
} from './exerciseCalculator';

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack');
});

app.get('/bmi', (req, res): void => {
  if (!req.query.height || !req.query.weight) {
    res.status(400).json({ error: 'Missing height or weight parameter.' });
  }

  const height: number = Number(req.query.height);
  const weight: number = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    res
      .status(400)
      .json({ error: 'Height and weight should be valid numbers.' });
  }

  const bmi: string = calculateBmi(height, weight);

  res.json({
    weight,
    height,
    bmi
  });
});

app.post('/exercises', (req, res): void => {
  interface ExerciseRequestBody {
    daily_exercises: number[];
    target: number;
  }

  const { daily_exercises, target } = req.body as ExerciseRequestBody;

  if (!daily_exercises || !target) {
    res.status(400).json({ error: 'Missing parameters.' });
  }

  if (
    !Array.isArray(daily_exercises) ||
    !daily_exercises.every((item) => typeof item === 'number')
  ) {
    res
      .status(400)
      .json({ error: 'daily_exercises must be an array of numbers.' });
  }

  if (typeof target !== 'number') {
    res.status(400).json({ error: 'target must be a number' });
  }

  try {
    const result: calculateExercisesResult = calculateExercises(
      daily_exercises,
      target
    );
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(422)
        .json({ error: `An error was encountered: ${error.message}` });
    }
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
