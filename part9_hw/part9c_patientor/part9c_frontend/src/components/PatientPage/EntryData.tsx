import { Entry, HealthCheckRating } from "../../types";
import MoodIcon from '@mui/icons-material/Mood';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import WarningIcon from '@mui/icons-material/Warning';
import TaskIcon from '@mui/icons-material/Task';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';

const HealthRating:React.FC<{ rating: HealthCheckRating }> =({ rating }) => {
  switch (rating) {
    case HealthCheckRating.Healthy:
        return <MoodIcon/>;
    case HealthCheckRating.LowRisk:
        return <SentimentSatisfiedIcon />;
    case HealthCheckRating.HighRisk:
        return <WarningIcon />;
    case HealthCheckRating.CriticalRisk:
        return <MoodBadIcon />;
    default:
        return null;
  }
}

const assertNever = (value: never): never => {
   throw new Error(
     `Unhandled discriminated union number: ${JSON.stringify(value)}`
   );
 };
const EntryData = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return (
        <div>
          <TaskIcon/><br/>
          <HealthRating rating={entry.healthCheckRating}/><br/>
          diagnose by {entry.specialist}
        </div>
      );
    case "Hospital":
      return (
        <div>
            <LocalHospitalIcon/>
            <div className="message">
                <h2>Discharge</h2>
                {entry.discharge.date}<br/>
                {entry.discharge.criteria}
            </div>
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div className="message">  
            <WorkIcon/> {entry.employerName}
            <h2>SickLeave</h2>
            {entry.sickLeave?.startDate} to {entry.sickLeave?.endDate}
        </div>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryData;