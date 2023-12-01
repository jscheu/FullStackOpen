import diagnoses from '../../data/diagnoses';

import { Diagnosis } from '../types';

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

const getDiagnosisByCode = (code: string): Diagnosis | undefined => {
  const diagnosis = diagnoses.find((item) => item.code === code);
  return diagnosis;
};

export default { getDiagnoses, getDiagnosisByCode };
