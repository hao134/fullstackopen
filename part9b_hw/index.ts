import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises, parseInput } from './exerciseCalculator';

const app = express();
app.use(express.json());

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

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { weekTarget, dailyExcercises } = req.body;
  //console.log(req.body);

  if (!(weekTarget && dailyExcercises)) {
    res.status(400).send({ error: "parameters missing"});
  }

  try {
    const { target, dailyHours } = parseInput(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      weekTarget,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      dailyExcercises
    );
    res.send(calculateExercises(target, dailyHours));
  } catch (exception) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    res.send(400).send({error: exception.message});
  }

});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});