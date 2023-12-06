import patients from '../../data/patients';
import { v1 as uuid } from 'uuid';

import {
  Entry,
  NewEntry,
  NewPatient,
  Patient,
  PatientNonSensitiveData
} from '../types';

const getPatients = (): Patient[] => {
  return patients;
};

const getPatientById = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
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

const addEntry = (patientId: Patient['id'], newEntry: NewEntry): Entry => {
  const patientIndex = patients.findIndex(
    (patient) => patient.id === patientId
  );
  if (patientIndex < 0) {
    throw new Error('Patient not found');
  }

  const originalPatient = patients[patientIndex];

  const entryId: string = uuid();
  const entryToAdd: Entry = {
    ...newEntry,
    id: entryId
  };

  const updatedPatient: Patient = {
    ...originalPatient,
    entries: originalPatient.entries.concat(entryToAdd)
  };

  patients[patientIndex] = updatedPatient;

  return entryToAdd;
};

export default {
  getPatients,
  getPatientById,
  getPatientsNonSensitiveData,
  addPatient,
  addEntry
};
