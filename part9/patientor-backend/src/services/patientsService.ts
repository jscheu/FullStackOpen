import patients from '../../data/patients';
import { v1 as uuid } from 'uuid';

import { NewPatient, Patient, PatientNonSensitiveData } from '../types';

const getPatients = (): Patient[] => {
  return patients;
};

const getPatientsNonSensitiveData = (): PatientNonSensitiveData[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (newPatient: NewPatient): Patient => {
  const id: string = uuid();
  const patientToAdd: Patient = {
    ...newPatient,
    id
  };

  patients.push(patientToAdd);

  return patientToAdd;
};

export default {
  getPatients,
  getPatientsNonSensitiveData,
  addPatient
};
