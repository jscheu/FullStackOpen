import diagnoses from '../../data/diagnoses';

import { Diagnosis } from '../types';

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

const getDiagnosisByCode = (code: string): Diagnosis | undefined => {
  return diagnoses.find((item) => item.code === code);
};

export default { getDiagnoses, getDiagnosisByCode };
