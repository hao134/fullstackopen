import { useNotificationValue } from "../NotificationContext"
import { Alert } from "@mui/material";

const Notification = () => {
  const notification = useNotificationValue()
  if (notification === null) {
    return null
  }
  if (notification.includes('Error:')){
    return <Alert severity="error">{notification}</Alert>
  }
  return <Alert severity="success">{notification}</Alert>
}

export default Notification