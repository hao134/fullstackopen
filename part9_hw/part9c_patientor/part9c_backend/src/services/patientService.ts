import patientsData from '../../data/patients';
import { v1 as uuid } from 'uuid';

import { 
  NonSensitivePatient, 
  Patient, 
  NewPatientEntry,
  Entry,
  NewEntry
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

const addEntry = ( newEntry: NewEntry, patientID: string ): Entry => {
  const id = uuid();
  const entryWithID = { ...newEntry, id};
  patientsData.forEach((patient) => {
    if (patient.id === patientID){
      patient.entries.push(entryWithID);
      return patient;
    }
    return patient;
  });

  return entryWithID;
}

export default {
  getEntries,
  getNonSensitivePatientEntry,
  findById,
  addPatient,
  addEntry
};