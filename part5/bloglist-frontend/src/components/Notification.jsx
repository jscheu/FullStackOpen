const Notification = ({ note }) => {
  if(!note) return null
  return <div className={note.type}>{note.message}</div>
}

export default Notification