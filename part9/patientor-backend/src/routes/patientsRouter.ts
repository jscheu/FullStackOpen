import express from 'express';
import patientsService from '../services/patientsService';
import { toNewEntry, toNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientsService.getPatientsNonSensitiveData());
});

router.get('/:id', (req, res) => {
  const patient = patientsService.getPatientById(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.status(404).send('patient not found');
  }
});

router.post('/:id/entries', (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send('Missing id parameter');
  }

  try {
    const newEntry = toNewEntry(req.body);

    try {
      const addedEntry = patientsService.addEntry(id, newEntry);
      res.json(addedEntry);
    } catch (error) {
      res.status(404).send('Patient not found');
    }
  } catch (error) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }

    res.status(400).send(errorMessage);
  }
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientsService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
