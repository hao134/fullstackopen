import express from 'express';
import { calculateBmi } from './bmiCalculator';

const app = express();

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.get('/bmi', (req, res) => {
  const weight = req.query.weight;
  const height = req.query.height;
  const validParameters: boolean =
    !isNaN(Number(weight)) && !isNaN(Number(height));

  if (!validParameters || !weight || !height) {
    res.status(400).send({ error: "malformatted parameters" });
  }

  const result = {
    weight: weight,
    height: height,
    bmi: calculateBmi(Number(height), Number(weight))
  };

  res.send(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});