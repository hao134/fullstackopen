import { useState, useEffect } from 'react';
import { Diary } from './types';
import { getAllDiaries, createDiary } from './diaryService';

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [newDiary, setNewDiary] = useState({ date: "", weather: "", visibility: "", comment: ""})

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data)
    })
  }, [])

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    createDiary({ 
      date: newDiary.date, 
      weather: newDiary.weather, 
      visibility: newDiary.visibility, 
      comment: newDiary.comment 
    }).then(data => {
      setDiaries(diaries.concat(data))
    })
    setNewDiary({ date: '', weather: '', visibility: '', comment: '' });
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // form's name and value
    const { name, value } = event.target;
    // form of newPerson: {name: '', number: ''}
    // when [name] is name is "a" -> add {name: "a"}
    // when [name] is number is "1" -> add {number: "1"}
    setNewDiary({ ...newDiary, [name]: value });
  }

  return (
    <div>
      <form onSubmit={diaryCreation}>
        <div>
          date:{" "}
          <input name="date" value={newDiary.date} onChange={handleChange}/>
        </div>
        <div>
          weather:{" "}
          <input name="weather" value={newDiary.weather} onChange={handleChange}/>
        </div>
        <div>
          visibility:{" "}
          <input name="visibility" value={newDiary.visibility} onChange={handleChange}/>
        </div>
        <div>
          comment:{" "}
          <input name="comment" value={newDiary.comment} onChange={handleChange}/>
        </div>
        <button type='submit'>add</button>
      </form>
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
