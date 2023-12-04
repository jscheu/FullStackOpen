import data from '../data/diagnoses';
import {
  Diagnosis,
  Discharge,
  Entry,
  EntryTypeStringLiterals,
  Gender,
  HealthCheckRating,
  NewEntry,
  NewPatient,
  SickLeave
} from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isArray = (param: unknown): param is Array<unknown> => {
  return Array.isArray(param);
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

const isEntry = (_entry: unknown): _entry is Entry => {
  //Currently 'Entry' is not defined with properties
  return true;
};

const isEntryArray = (entries: Array<unknown>): entries is Entry[] => {
  entries.forEach((entry) => isEntry(entry));
  return true;
};

const parseEntries = (entries: unknown): Entry[] => {
  if (!isArray(entries)) {
    throw new Error('Array expected for property "entries": ' + entries);
  }

  if (!isEntryArray(entries)) {
    throw new Error('Incorrect data in "entries": ' + entries);
  }

  return entries;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing patient data');
  }

  if ('name' in object && 'occupation' in object && 'gender' in object) {
    const newPatient: NewPatient = {
      name: parseName(object.name),
      occupation: parseOccupation(object.occupation),
      gender: parseGender(object.gender),
      entries: 'entries' in object ? parseEntries(object.entries) : []
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

const isEntryType = (param: string): param is Entry['type'] => {
  return EntryTypeStringLiterals.includes(param as Entry['type']);
};

const parseType = (param: unknown): Entry['type'] => {
  if (!isString(param) || !isEntryType) {
    throw new Error('Incorrect entry type' + param);
  }

  return param as Entry['type'];
};

const parseDescriptiton = (param: unknown): string => {
  if (!isString(param)) {
    throw new Error('Incorrect description type: ' + param);
  }

  return param;
};

const parseSpecialist = (param: unknown): string => {
  if (!isString(param)) {
    throw new Error('Incorrect specailist type: ' + param);
  }

  return param;
};

const isNumber = (param: unknown): param is number => {
  return typeof param === 'number' && !isNaN(param);
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (param: unknown): HealthCheckRating => {
  if (!isNumber(param) || !isHealthCheckRating(param)) {
    throw new Error('Incorrect Health Check Rating type: ' + param);
  }

  return param;
};

const parseEmployerName = (param: unknown): string => {
  if (!isString(param)) {
    throw new Error('Incorrect Employer Name: ' + param);
  }

  return param;
};

const isDischarge = (object: unknown): object is Discharge => {
  if (!object || typeof object !== 'object') return false;

  if ('date' in object && 'criteria' in object) {
    if (isString(object.date) && isString(object.criteria)) {
      if (isDate(object.date)) {
        return true;
      }
    }
  }

  return false;
};

const parseDischarge = (object: unknown): Discharge => {
  if (!isDischarge(object)) {
    throw new Error('Incorrect Discharge: ' + object);
  }

  return object;
};

const isDiagnosisCode = (param: unknown): param is Diagnosis['code'] => {
  //Currently only defining constraint of diagnosis code is string
  if (isString(param)) return true;
  else return false;
};

const isDiagnosisCodeArray = (
  array: Array<unknown>
): array is Array<Diagnosis['code']> => {
  array.forEach((code) => {
    if (!isDiagnosisCode(code)) return false;
  });

  return true;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!isArray(object) || !isDiagnosisCodeArray(object)) {
    throw new Error('Incorrect diagnosis codes: ' + object);
  }

  return object;
};

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing patient data');
  }

  if (
    'type' in object &&
    'date' in object &&
    'description' in object &&
    'specialist' in object
  ) {
    const type = parseType(object.type);

    interface BaseProperties {
      date: string;
      description: string;
      specialist: string;
      diagnosisCodes?: Array<Diagnosis['code']>;
      sickLeave?: SickLeave;
    }
    const baseProperties: BaseProperties = {
      date: parseDate(object.date),
      description: parseDescriptiton(object.description),
      specialist: parseSpecialist(object.specialist)
    };

    //TODO optional properties
    if ('diagnosisCodes' in object) {
      baseProperties.diagnosisCodes = parseDiagnosisCodes(
        object.diagnosisCodes
      );
    }

    if (type === 'HealthCheck' && 'healCheckRating' in object) {
      return {
        ...baseProperties,
        type,
        healthCheckRating: parseHealthCheckRating(object.healCheckRating)
      };
    }

    if (type === 'OccupationalHealthcare' && 'employerName' in object) {
      return {
        ...baseProperties,
        type,
        employerName: parseEmployerName(object.employerName)
      };
    }

    if (type === 'Hospital' && 'discharge' in object) {
      return {
        ...baseProperties,
        type,
        discharge: parseDischarge(object.discharge)
      };
    }
  }

  throw new Error('Missing required property');
};
