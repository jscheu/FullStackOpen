import express from 'express';
import diagnosesService from '../services/diagnosesService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diagnosesService.getDiagnoses());
});

router.get('/:code', (req, res) => {
  const code = req.params.code;
  const diagnosis = diagnosesService.getDiagnosisByCode(code);
  if (diagnosis) {
    res.send(diagnosis);
  } else {
    res.status(404).send('Diagnosis not found');
  }
});

export default router;
