import useField from './components/useField'
const App = () => {
  const name = useField('text')
  const born = useField('date')
  const height = useField('number')

  return (
    <div>
        <form>
            name:
            <input
              type={name.type}
              value={name.value}
              onChange={name.onChange}
            />
            <br/>
            birthdate:
            <input
              type={born.type}
              value={born.value}
              onChange={born.onChange}
            />
            <br/>
            height:
            <input
              type={height.type}
              value={height.value}
              onChange={height.onChange}
            />
            <br/>
        </form>
        <div>
          {name.value} {born.value} {height.value} 
        </div>
    </div>
  )
}
 
export default App