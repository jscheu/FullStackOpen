import { CoursePart } from "../types";

const Part = ({ coursePart }: { coursePart: CoursePart }) => {
    const assertNever = (value: never): never => {
        throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`)
    }
    const renderCourseContent = (part: CoursePart) => {
        switch (part.kind) {
            case 'basic':
                return (
                    <i>{part.description}</i>
                )
            case 'group':
                return (
                    <>project exercises {part.groupProjectCount}</>
                )
            case 'background':
                return (
                    <>
                    <i>{part.description}</i>
                    <br></br>
                    <a href={part.backgroundMaterial}>{part.backgroundMaterial}</a>
                    </>
                )
            case 'special':
                return (
                    <>
                    <i>{part.description}</i>
                    <br></br>
                    required skills: {part.requirements.join(', ')}
                    </>
                )
            default:
                return assertNever(part)
        }
    }
    return (
        <p>
            <strong>{coursePart.name} {coursePart.exerciseCount}</strong>
            <br></br>
            {renderCourseContent(coursePart)}
        </p>
    )
}

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
    return (
      <div>
        {courseParts.map(course => (
          <Part key={course.name} coursePart={course} />
        ))}
      </div>
    )
  }

export default Content;
