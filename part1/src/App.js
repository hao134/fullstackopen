const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
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
      <Hello />
      <Hello name="Shih Hao" age = {47-19} />
      <Hello name={name} age={age}/>
      <Footer />
    </>
  )
}



export default App