import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { clearNotify } from "../reducers/notificationReducer"

const Notification = () => {
  const message = useSelector(state => state.notification)
  const dispatch = useDispatch()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  useEffect(() => {
    if(message) {
      const timerId = setTimeout(() => {
        dispatch(clearNotify())
      }, 5000)

      return () => clearTimeout(timerId)
    }
  }, [message, dispatch])

  return message ? <div style={style}>{message}</div> : null
}

export default Notification