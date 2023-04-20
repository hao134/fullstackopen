import {
  Entry,
  EntryTypes,
  Gender,
  HealthCheckRating,
  HospitalDischarge,
  NewEntry,
  NewPatientEntry,
  SickLeave,
  TypeSpecificEntry,
} from './types';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const isArray = (arg: unknown): arg is unknown[] => {
  return Array.isArray(arg);
};

const isObject = (arg: unknown): arg is object => {
  return typeof arg === 'object' && arg !== null;
};

const isUndefinedOrNull = (arg: unknown): arg is undefined | null => {
  return typeof arg === 'undefined' || arg === null;
};

const isString = (arg: unknown): arg is string => {
  return typeof arg === 'string' || arg instanceof String;
};

const isDate = (str: string): boolean => {
  return !!Date.parse(str);
};

const capitalizeFirst = (str: string): string => {
  return str[0].toUpperCase() + str.slice(1);
};

const isGender = (arg: unknown): arg is Gender => {
  return isString(arg) && capitalizeFirst(arg) in Gender;
};

const isHealthCheckRating = (arg: unknown): arg is HealthCheckRating => {
  const enumValues = Object.values(HealthCheckRating);
  return enumValues.slice(enumValues.length / 2).includes(Number(arg));
};

const isHospitalDischarge = (arg: unknown): arg is HospitalDischarge => {
  return (
    isObject(arg) &&
    'date' in arg &&
    isString(arg.date) &&
    isDate(arg.date) &&
    'criteria' in arg &&
    isString(arg.criteria)
  );
};

const isSickLeave = (arg: unknown): arg is SickLeave => {
  return (
    isObject(arg) &&
    'startDate' in arg &&
    isString(arg.startDate) &&
    isDate(arg.startDate) &&
    'endDate' in arg &&
    isString(arg.endDate) &&
    isDate(arg.endDate)
  );
};

const isEntry = (arg: unknown): arg is Entry => {
  return (
    isObject(arg) &&
    'type' in arg &&
    isString(arg.type) &&
    EntryTypes.includes(arg.type as typeof EntryTypes[number])
  );
};

const parseString = (arg: unknown, propertyName: string): string => {
  if (!isString(arg)) throw new Error(`${propertyName} must be a string.`);

  return arg;
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date))
    throw new Error('Date must be formatted properly.');

  return date;
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn) || !ssn.match(/\d{6}-\d{2}(\d|[A-Z]){1,2}/))
    throw new Error('SSN must be formatted properly.');

  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (
    !isString(gender) ||
    !(gender = gender.toLowerCase()) ||
    !isGender(gender)
  )
    throw new Error(
      'Gender must be one of the following: ' +
        Object.values(Gender).join(', ') +
        '.'
    );

  return gender;
};

const parseDiagnosisCodes = (arg: unknown): Entry['diagnosisCodes'] => {
  if (!isArray(arg) || !arg.every((code): code is string => isString(code)))
    throw new Error('Diagnosis codes must be an array of strings.');

  return arg;
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (!isHealthCheckRating(rating))
    throw new Error(
      'Health check rating must be convertible to a number within the accepted range.'
    );

  return Number(rating);
};

const parseHospitalDischarge = (
  hospitalDischarge: unknown
): HospitalDischarge => {
  if (!isHospitalDischarge(hospitalDischarge))
    throw new Error('Hospital discharge must conform to its type.');

  return {
    date: parseDate(hospitalDischarge.date),
    criteria: parseString(hospitalDischarge.criteria, 'Criteria'),
  };
};

const parseSickLeave = (arg: unknown): SickLeave => {
  if (!isSickLeave(arg))
    throw new Error('Sick leave must conform to its type.');

  return {
    startDate: parseDate(arg.startDate),
    endDate: parseDate(arg.endDate),
  };
};

const parseTypeSpecificEntryProperties = (entry: Entry): TypeSpecificEntry => {
  switch (entry.type) {
    case 'HealthCheck':
      return {
        type: entry.type,
        healthCheckRating: parseHealthCheckRating(entry.healthCheckRating),
      };
    case 'Hospital':
      return {
        type: entry.type,
        discharge: parseHospitalDischarge(entry.discharge),
      };
    case 'OccupationalHealthcare':
      return {
        type: entry.type,
        employerName: parseString(entry.employerName, 'Employer name'),
        ...((): object =>
          'sickLeave' in entry
            ? { sickLeave: parseSickLeave(entry.sickLeave) }
            : {})(),
      };
    default:
      return assertNever(entry);
  }
};

const parseEntries = (entries: unknown): Entry[] => {
  if (isUndefinedOrNull(entries)) return [];

  if (!isArray(entries))
    throw new Error('Entries must be convertible to an array.');

  if (!entries.every((entry): entry is Entry => isEntry(entry)))
    throw new Error('Each entry must conform to the Entry type.');

  return entries;
};

export const toNewPatient = ({
  name,
  dateOfBirth,
  ssn,
  gender,
  occupation,
  entries,
}: Record<string, unknown>): NewPatientEntry => {
  return {
    name: parseString(name, 'Name'),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseSsn(ssn),
    occupation: parseString(occupation, 'Occupation'),
    gender: parseGender(gender),
    entries: parseEntries(entries),
  };
};

export const toNewEntry = (entry: Record<string, unknown>): NewEntry => {
  if (!isEntry(entry)) throw new Error('Data must conform to the Entry type.');

  return {
    description: parseString(entry.description, 'Description'),
    date: parseDate(entry.date),
    specialist: parseString(entry.specialist, 'Specialist'),
    ...((): object =>
      'diagnosisCodes' in entry
        ? { diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes) }
        : {})(),
    ...parseTypeSpecificEntryProperties(entry),
  };
};