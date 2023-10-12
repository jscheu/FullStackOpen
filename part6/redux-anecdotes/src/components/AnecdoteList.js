import { useSelector, useDispatch } from "react-redux"
import { incrementVote } from '../reducers/anecdoteReducer'
import { notify } from "../reducers/notificationReducer"

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const filter = useSelector(state => state.filter)
  const anecdotes = useSelector(state =>
    state.anecdotes.filter(a =>
      a.content.toLowerCase().includes(filter.toLowerCase())))

  const vote = (id) => {
    dispatch(incrementVote(id))
    dispatch(notify(`you voted '${anecdotes.find(a => a.id === id).content}'`))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList