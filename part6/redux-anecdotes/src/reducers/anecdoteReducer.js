const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

export const createAnecdote = (content) => {
  return {
    type: 'NEW_ANECDOTE',
    payload: { content }
  }
}

export const incrementVote = (id) => {
  return {
    type: 'VOTE',
    payload: { id }
  }
}

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const sortByVotes = (anecdotes) => {
  return anecdotes.sort((a, b) => b.votes - a.votes)
}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)

  switch(action.type) {
    case 'VOTE':
      const id = action.payload.id
      const stateAfterVote = state.map(a => a.id === id ? { ...a, votes: a.votes + 1 } : a)
      console.log('new state: ', stateAfterVote)
      return sortByVotes(stateAfterVote)
    case 'NEW_ANECDOTE':
      const anecdote = action.payload.content
      const stateAfterNew = [...state, asObject(anecdote)]
      console.log('new state: ', stateAfterNew)
      return stateAfterNew
    default: return state
  }
}

export default reducer