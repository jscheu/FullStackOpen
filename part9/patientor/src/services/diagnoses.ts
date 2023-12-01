import axios from 'axios';
import { Diagnosis } from '../types';
import { apiBaseUrl } from '../constants';

const getDiagnoses = async (): Promise<Diagnosis[]> => {
    const { data } = await axios.get(`${apiBaseUrl}/diagnoses`);
    return data;
};

const getDiagnosisByCode = async (code: string): Promise<Diagnosis> => {
    const { data } = await axios.get(`${apiBaseUrl}/diagnoses/${code}`);
    return data;
};

export default { getDiagnoses, getDiagnosisByCode };
