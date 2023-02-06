const Course = ({ course }) => {
    return (
        <div>
            <Header name={course.name} />
            <Content parts={course.parts} />
        </div>
    )
}

const Header = ({ name }) => {
    return <h2>{name}</h2>
}

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map((part) => (
                <Part key={part.id} name={part.name} exercises={part.exercises} />
            ))}
        </div>
    )
}

const Part = ({ name, exercises }) => {
    return (
        <p>
            {name}, {exercises}
        </p>
    )
}

export default Course