import { useState, useEffect } from 'react';
import { Diary } from './types';
import { getAllDiaries } from './diaryService';

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  //const [newNote, setNewNote] = useState('');

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data)
    })
  }, [])

  // const noteCreation = (event: React.SyntheticEvent) => {
  //   event.preventDefault()
  //   createNote({ content: newNote }).then(data => {
  //     setNotes(notes.concat(data))
  //   })
  //   // axios.post<Note>('http://localhost:3001/notes', { content: newNote })
  //   //   .then(response => {
  //   //     setNotes(notes.concat(response.data))
  //   //   })
  //   setNewNote('');
  // }

  return (
    <div>
      {/* <form onSubmit={noteCreation}>
        <input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
        />
        <button type='submit'>add</button>
      </form> */}
      <h2>Diary Entries</h2>
      {diaries.map((diary) =>
        <div key={diary.id}>
          <div>
            <h3>{diary.date}</h3>
          </div>
          visibility: {diary.visibility}<br/>
          weather: {diary.weather}
        </div> 
      )}
    </div>
  )
}

export default App;
