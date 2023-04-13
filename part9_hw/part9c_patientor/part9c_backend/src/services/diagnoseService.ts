import diagnoseData from '../../data/diagnoses';

import { DiagnoseEntry } from '../types';

const getEntries = (): DiagnoseEntry[] => {
  return diagnoseData;
};

export default {
  getEntries
};