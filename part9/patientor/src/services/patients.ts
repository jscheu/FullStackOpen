import axios from 'axios';
import { Entry, Patient, PatientFormValues } from '../types';

import { apiBaseUrl } from '../constants';

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);

  return data;
};

const getPatientById = async (id: string): Promise<Patient> => {
  const { data } = await axios.get(`${apiBaseUrl}/patients/${id}`);
  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

  return data;
};

const addEntry = async (patientId: string, values: object): Promise<Entry> => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${patientId}/entries`,
    values
  );

  return data;
};

export default {
  getAll,
  getPatientById,
  create,
  addEntry
};
