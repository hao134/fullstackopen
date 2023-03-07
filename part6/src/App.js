import NewNote from "./components/Newnote"
import Notes from "./components/Notes"
import VisibilityFilter from "./components/VisibilityFilter"

const App = () => {
  return (
    <div>
      <NewNote />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}

export default App