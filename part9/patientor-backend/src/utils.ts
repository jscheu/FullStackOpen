import { Gender, NewPatient } from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isEmptyString = (text: string): boolean => {
  return text.trim().length === 0;
};

const parseName = (name: unknown): string => {
  if (!isString(name) || isEmptyString(name)) {
    throw new Error('Incorrect or missing name: ' + name);
  }

  return name;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation) || isEmptyString(occupation)) {
    throw new Error('Incorrect or missing occupation: ' + occupation);
  }

  return occupation;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((g) => g.toString())
    .includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }

  return gender;
};

const isSsn = (param: string): boolean => {
  //Evaluate format of ssn. Not a current requirment.
  return !isEmptyString(param);
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn) || !isSsn(ssn)) {
    throw new Error('Incorrect or missing ssn: ' + ssn);
  }

  return ssn;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }

  return date;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing patient data');
  }

  if ('name' in object && 'occupation' in object && 'gender' in object) {
    const newPatient: NewPatient = {
      name: parseName(object.name),
      occupation: parseOccupation(object.occupation),
      gender: parseGender(object.gender)
    };

    if ('ssn' in object && object.ssn !== '') {
      newPatient.ssn = parseSsn(object.ssn);
    }
    if ('dateOfBirth' in object && object.dateOfBirth !== '') {
      newPatient.dateOfBirth = parseDate(object.dateOfBirth);
    }

    return newPatient;
  }

  throw new Error('Incorrect data: a field is missing');
};
