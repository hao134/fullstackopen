import { Alert } from "@mui/material";

const Notify = ({ message }) => {
  if (!message) {
    return null;
  }
  return <Alert severity="success">{message}</Alert>;
};
  
export default Notify;