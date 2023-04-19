import axios from "axios";
import { Patient, PatientPageRouteProps } from "../../types";
import { useState, useEffect } from "react";
import { apiBaseUrl } from "../../constants";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
 

const PatientPage: React.FC<PatientPageRouteProps> = ({ id }) => {
  const [patientData, setPatientData] = useState<Patient>();

  useEffect(() => {
    axios.get(`${apiBaseUrl}/patients/${id}`).then(response => {
      setPatientData(response.data);
    });
  }, [id]);

  if (!patientData) {
    return <div>loading</div>
  }

  type GenderIconProps = {
    gender: "male" | "female" | "other";
  };

  const GenderIcon = ({ gender }: GenderIconProps) => {
    switch (gender) {
      case 'male':
        return <MaleIcon />;
      case 'female':
        return <FemaleIcon />;
      default:
        return <TransgenderIcon />;
    }
  }

  return (
    <div>
      <h2>Patient {id}</h2>
      <h2>{patientData.name} {<GenderIcon gender={patientData.gender}/>} </h2>
      
      ssn: {patientData.ssn}<br/>
      occupation: {patientData.occupation}
    </div>
  );
};

export default PatientPage;