import patientsData from '../../data/patients';

import { NonSensitivePatientEntry, PatientEntry } from '../types';

const getEntries = (): PatientEntry[] => {
  return patientsData;
};

const getNonSensitivePatientEntry = (): NonSensitivePatientEntry[] => {
  return patientsData.map(({ id, name, dateOfBirth, gender, occupation}) =>({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
}

export default {
  getEntries,
  getNonSensitivePatientEntry
};