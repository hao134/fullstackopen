import { createContext, useReducer, useContext } from 'react'

const setNotificationReducer = (state, action) => {
  switch (action.type) {
    case "VOTE":
      return `VOTE ${action.payload}` 
    case "CREATE":
      return `CREATE ${action.payload}`
    case "ERASE":
      return null
    case "ERROR":
      return `Error ${action.payload}`
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] =  useReducer(setNotificationReducer, null)
  
  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      { props.children }
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

export default NotificationContext