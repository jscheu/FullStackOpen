import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from './services/anecdotes'
import { useNotificationDispatch } from './NotificationContext'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

const App = () => {
  const notificationDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const voteMutation = useMutation(anecdoteService.vote, {
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(a => a.id === updatedAnecdote.id ? updatedAnecdote : a))
    }
  })

  const handleVote = (anecdote) => {
    voteMutation.mutate(anecdote.id)
    notificationDispatch('INFO', `you voted '${anecdote.content}'`, 5)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll,
    retry: false
  })

  if(result.isLoading) return <div>loading data...</div>
  if(result.isError) return <div>anecdote service not available due to problems in server</div>

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
