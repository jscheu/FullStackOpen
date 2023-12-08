import {
  Diagnosis,
  SickLeave,
  NewEntry,
  EntryTypeStringLiterals,
  HealthCheckRating,
  Discharge
} from './types';

/* basic data types */
/*---------------------------------------*/

const isString = (param: unknown): param is string => {
  return typeof param === 'string' || param instanceof String;
};

export const isNumber = (param: unknown): param is number => {
  return typeof param === 'number' && !isNaN(param);
};

export const isDate = (param: string): boolean => {
  return Boolean(Date.parse(param));
};

const isArray = (param: unknown): param is Array<unknown> => {
  return Array.isArray(param);
};

/* application specific data types */
/*---------------------------------------*/

const isEntryType = (param: string): param is NewEntry['type'] => {
  return EntryTypeStringLiterals.includes(param as NewEntry['type']);
};

const isDiagnosisCode = (param: unknown): param is Diagnosis['code'] => {
  //Currently only defining constraint of diagnosis code is string
  return isString(param);
};

export const isDiagnosisCodeArray = (
  array: Array<unknown>
): array is Array<Diagnosis['code']> => {
  for (const code of array) {
    if (!isDiagnosisCode(code)) return false;
  }

  return true;
};

const isSickLeave = (object: unknown): object is SickLeave => {
  if (!object || typeof object !== 'object') return false;

  if ('startDate' in object && 'endDate' in object) {
    if (isString(object.startDate) && isString(object.endDate)) {
      if (isDate(object.startDate) && isDate(object.endDate)) return true;
    }
  }

  return false;
};

export const isHealthCheckRating = (
  param: number
): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
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

/* parse functions */
/*---------------------------------------*/

const parseType = (param: unknown): NewEntry['type'] => {
  if (!isString(param) || !isEntryType) {
    throw new Error('Incorrect entry type' + param);
  }

  return param as NewEntry['type'];
};

const parseDate = (param: unknown): string => {
  if (!isString(param) || !isDate(param)) {
    throw new Error('Incorrect or missing date: ' + param);
  }

  return param;
};

const parseDescriptiton = (param: unknown): string => {
  if (!isString(param)) {
    throw new Error('Incorrect or missing description: ' + param);
  }

  return param;
};

const parseSpecialist = (param: unknown): string => {
  if (!isString(param)) {
    throw new Error('Incorrect or missing specialist: ' + param);
  }

  return param;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!isArray(object) || !isDiagnosisCodeArray(object)) {
    throw new Error('Incorrect diagnosis codes: ' + object);
  }

  return object;
};

const parseSickLeave = (object: unknown): SickLeave => {
  if (!isSickLeave(object)) {
    throw new Error('Incorrect sick leave: ' + object);
  }

  return object;
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

const parseDischarge = (object: unknown): Discharge => {
  if (!isDischarge(object)) {
    throw new Error('Incorrect Discharge: ' + object);
  }

  return object;
};

/* constructor functions */
/*---------------------------------------*/

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing entry data: ' + object);
  }

  const missingProperties: string[] = [];

  if (!('type' in object)) missingProperties.push('type');
  if (!('date'! in object)) missingProperties.push('date');
  if (!('description'! in object)) missingProperties.push('description');
  if (!('specialist'! in object)) missingProperties.push('specialist');

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

    if ('diagnosisCodes' in object) {
      baseProperties.diagnosisCodes = parseDiagnosisCodes(
        object.diagnosisCodes
      );
    }

    if ('sickLeave' in object && object.sickLeave) {
      baseProperties.sickLeave = parseSickLeave(object.sickLeave);
    }

    if (type === 'HealthCheck') {
      if ('healthCheckRating' in object) {
        return {
          ...baseProperties,
          type,
          healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
        };
      } else missingProperties.push('healthCheckRating');
    }

    if (type === 'OccupationalHealthcare') {
      if ('employerName' in object) {
        return {
          ...baseProperties,
          type,
          employerName: parseEmployerName(object.employerName)
        };
      } else missingProperties.push('employerName');
    }

    if (type === 'Hospital') {
      if ('discharge' in object) {
        return {
          ...baseProperties,
          type,
          discharge: parseDischarge(object.discharge)
        };
      } else missingProperties.push('discharge');
    }
  }

  throw new Error('Missing required property: ' + missingProperties);
};
