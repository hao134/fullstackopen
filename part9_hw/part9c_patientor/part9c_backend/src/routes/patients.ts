import express from 'express';
import patientService from '../services/patientService';
import toNewPatient from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitivePatientEntry());
});

router.post('/', (req, res) => {
  try{
    const newPatientEntry = toNewPatient(req.body);

    const addedEntry = patientService.addPatient(newPatientEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
  // const { name, dateOfBirth, ssn, gender, occupation } = req.body;
  // const addedEntry = patientService.addPatient({
  //   name,
  //   dateOfBirth,
  //   ssn,
  //   gender,
  //   occupation
  // });
  // res.json(addedEntry);
  
});

export default router;