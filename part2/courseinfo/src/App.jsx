const Header = ({ text }) => <h1>{text}</h1>

const Total = ({ sum }) => <p><b>total of {sum} exercises</b></p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) =>
  <>
    {parts.map(part => <Part key={part.id} part={part}/>)}
  </>

const Course = ({ course }) => {
  const parts = course.parts
  const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <div>
    <Header text={course.name} />
    <Content parts={parts} />
    <Total sum={totalExercises} />
  </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <Course course={course} />
  )
}

export default App