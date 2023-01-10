const Hello = ({name, age}) => {

  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}

const Footer = () => {
  return (
    <div>
      greeting app created by <a href="https://github.com/hao134">hao134</a>
    </div>
  )
}

const App = () => {

  const name = "Liching"
  const age = 47

  return (
    <>
      <h1>Greetings</h1>
      <Hello name="Shih Hao" age = {47-19} />
      <Hello name={name} age={age}/>
      <Footer />
    </>
  )
}



export default App