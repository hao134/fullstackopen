export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export enum DianosisCodes {
  N300 = "N30.0",
  H547 = "H54.7",
  J030 = "J03.0",
  L601 = "L60.1",
  Z743 = "Z74.3",
  L20 = "L20",
  F432 = "F43.2",
  S625 = "S62.5",
  H3529 = "H35.29"
}

export const EntryTypes = [
  "HealthCheck",
  "Hospital",
  "OccupationalHealthcare",
] as const;

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
  type: typeof EntryTypes[number]; 
  // represent type only can be one of [ "HealthCheck","Hospital","OccupationalHealthcare"].
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export type newHealthCheckEntry = Omit<HealthCheckEntry, 'id' | 'type'>;
export type newHospitalEntry = Omit<HospitalEntry, 'id' | 'type'>;
export type newOccupationalHealthcareEntry = Omit<
  OccupationalHealthcareEntry,
  'id' | 'type'
>;

export type newEntry =
  | newHealthCheckEntry
  | newHospitalEntry
  | newOccupationalHealthcareEntry;

interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

interface HospitalDischarge {
  date: string;
  criteria: string;
}

interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: HospitalDischarge;
}

interface SickLeave {
  startDate: string;
  endDate: string;
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: SickLeave;
}

export type Entry = 
  | HealthCheckEntry
  | HospitalEntry
  | OccupationalHealthcareEntry;

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries?: Entry[];
}

export interface PatientPageRouteProps {
  id: string;
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;