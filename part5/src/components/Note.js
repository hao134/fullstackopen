const Note = ({ note, toggoleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'
  return (
    <li className="note">
      <span>{note.content}</span>
      <button onClick={toggoleImportance}>{label}</button>
    </li>
  )
}

export default Note