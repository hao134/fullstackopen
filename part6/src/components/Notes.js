import { useDispatch, useSelector } from "react-redux"
import { Toggleimportance } from "../reducers/noteReducer"

const Note = ({ note, handleClick }) => {
  return(
    <li onClick={handleClick}>
      {note.content}
      <strong> {note.important ? 'important' : ''}</strong>
    </li>
  )
}

const Notes = () => {
  const dispatch = useDispatch()
  const notes = useSelector(state => {
    if ( state.filter === 'ALL' ) {
      return state.notes
    }
    return state.filter === 'IMPORTANT'
      ? state.notes.filter(note => note.important)
      : state.notes.filter(note => !note.important)
  })

  const handleUpdate = (note, id) =>{
    const updatedNote = {...note, important: !note.important}
    //await noteService.update(id, updatedNote)
    dispatch(Toggleimportance(id, updatedNote))
  }
 
  return(
    <ul>
        {notes.map(note => 
          <Note
            key={note.id}
            note={note}
            handleClick={() => handleUpdate(note,note.id)}
          />    
        )}
    </ul>
  )
}

export default Notes