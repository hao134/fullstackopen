export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other"
}

export interface DiagnoseEntry {
    code: string;
    name: string;
    latin?: string;
}

interface BaseEntry {
    id: string;
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Array<DiagnoseEntry['code']>;
}

export enum HealthCheckRating {
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3
}

interface HealthCheckEntry extends BaseEntry {
    type: "HealthCheck";
    healthCheckRating: HealthCheckRating;
}

export interface SickLeave {
    startDate: string,
    endDate: string
}

interface OccupationalHealthcareEntry extends BaseEntry {
    type: "OccupationalHealthcare";
    sickLeave?: SickLeave;
    employerName: string;
}

export interface HospitalDischarge {
    date: string;
    criteria: string;
}
interface HospitalEntry extends BaseEntry {
    type: "Hospital";
    discharge: HospitalDischarge;
}

export type Entry = 
 | HealthCheckEntry
 | OccupationalHealthcareEntry
 | HospitalEntry;

export interface Patient {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: Gender;
    occupation: string;
    entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatientEntry = Omit<Patient, 'id'>;