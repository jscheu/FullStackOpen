import { useNotificationValue } from "../NotificationContext"

const Notification = () => {
  const notification = useNotificationValue()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  if (!notification) return null

  let cssClass
  if(notification.type === "INFO") cssClass = 'info'
  else if(notification.type === "ERROR") cssClass = 'error'
  else cssClass = ''

  return (
    <div style={style} className={cssClass}>
      {notification.message}
    </div>
  )
}

export default Notification
