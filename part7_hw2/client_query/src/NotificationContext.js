import { createContext, useReducer, useContext } from 'react'

const setNotificationReducer = (state, action) => {
  switch (action.type) {
    case 'LIKE':
      return `Like ${action.payload}`
    case 'CREATE':
      return `Create ${action.payload[0]} by ${action.payload[1]}`
    case 'DELETE':
      return `The blog ${action.payload} has already been deleted. If the page is not updated, please refresh `
    case 'ERASE':
      return null
    case 'ERROR':
      return `Error: ${action.payload}`
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(setNotificationReducer, null)

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