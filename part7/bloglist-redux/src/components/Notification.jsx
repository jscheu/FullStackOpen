import { useSelector, useDispatch } from 'react-redux';
import { clearNotification } from '../reducers/notificationReducer';
import { useEffect } from 'react';

import { Alert } from 'react-bootstrap';

const Notification = () => {
  const dispatch = useDispatch();
  const { type, message, timeout } = useSelector((state) => state.notification);
  const timeoutMilisecods = Number.isInteger(timeout) ? timeout * 1000 : 5000;

  useEffect(() => {
    let timerId;
    if (message) {
      timerId = setTimeout(() => {
        dispatch(clearNotification());
      }, timeoutMilisecods);
    }
    return () => clearTimeout(timerId);
  }, [type, message, timeoutMilisecods, dispatch]);

  if (!message) return null;

  return <Alert variant={type}>{message}</Alert>;
};

export default Notification;
