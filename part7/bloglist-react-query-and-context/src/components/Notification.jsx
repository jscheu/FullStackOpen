import { useEffect } from "react";
import { useNotificationValue, useNotificationDispatch, clearNotification } from "../contexts/NotificationContext"

const Notification = () => {
  const dispatch = useNotificationDispatch()
  const { type, message, timeout } = useNotificationValue()
  const timeoutMilisecods = Number.isInteger(timeout) ? timeout * 1000 : 5000;

  useEffect(() => {
    let timerId;
    if (message) {
      timerId = setTimeout(() => {
        dispatch(clearNotification());
      }, timeoutMilisecods);
    }
    return () => clearTimeout(timerId);
  }, [type, message, timeoutMilisecods]);

  if (!message) return null;

  return <div className={type}>{message}</div>;
}

export default Notification