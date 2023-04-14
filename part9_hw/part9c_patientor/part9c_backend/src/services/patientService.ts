import patientsData from '../../data/patients';
import { v1 as uuid } from 'uuid';

import { 
  NonSensitivePatientEntry, 
  PatientEntry, 
  NewPatientEntry 
} from '../types';

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

const addPatient = ( entry: NewPatientEntry ): PatientEntry => {
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };

  patientsData.push(newPatientEntry);
  return newPatientEntry;
}

export default {
  getEntries,
  getNonSensitivePatientEntry,
  addPatient
};