import patientsData from '../../data/patients';
import { v1 as uuid } from 'uuid';

import { 
  NonSensitivePatient, 
  Patient, 
  NewPatientEntry 
} from '../types';

const getEntries = (): Patient[] => {
  return patientsData;
};

const getNonSensitivePatientEntry = (): NonSensitivePatient[] => {
  return patientsData.map(({ id, name, dateOfBirth, gender, occupation}) =>({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
}

const findById = (id: string): Patient | undefined => {
  return patientsData.find(p => p.id === id);
}


const addPatient = ( entry: NewPatientEntry ): Patient => {
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
  findById,
  addPatient
};