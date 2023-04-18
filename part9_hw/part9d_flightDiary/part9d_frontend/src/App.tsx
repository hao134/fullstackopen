import { useState, useEffect } from 'react';
import { Diary } from './types';
import { getAllDiaries, createDiary } from './diaryService';
import axios from 'axios';

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [message, setMessage] = useState<string | null>(null)
  const [newDiary, setNewDiary] = useState({ date: "", weather: "", visibility: "", comment: ""})

  useEffect(() => {
    getAllDiaries().then(data=> {
      setDiaries(data);
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
    }).catch(error =>{
      if (axios.isAxiosError(error)){
        setMessage(error.response?.data || 'unknown error occurred.');
        setTimeout(() => {
        setMessage(null)
      }, 5000)
      }
      
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
      <h2>Add new entry</h2>
      {message && (
        <div className='error'>
          {message}
        </div>
      )}
      <form onSubmit={diaryCreation}>
        <div>
          date:{" "}
          <input type="date" name="date" value={newDiary.date} onChange={handleChange}/>
        </div>
        <div>
          weather:{" "}
          <input name="weather" type = "radio" value="sunny" checked={newDiary.weather==="sunny"} onChange={handleChange}/>
          <label htmlFor="sunny">sunny</label>
          <input name="weather" type = "radio" value="rainy" checked={newDiary.weather==="rainy"} onChange={handleChange}/>
          <label htmlFor="rainy">rainy</label>
          <input name="weather" type = "radio" value="cloudy" checked={newDiary.weather==="cloudy"} onChange={handleChange}/>
          <label htmlFor="cloudy">cloudy</label>
          <input name="weather" type = "radio" value="stormy" checked={newDiary.weather==="stormy"} onChange={handleChange}/>
          <label htmlFor="stormy">stormy</label>
          <input name="weather" type = "radio" value="windy" checked={newDiary.weather==="windy"} onChange={handleChange}/>
          <label htmlFor="windy">windy</label>
        </div>
        <div>
          visibility:{" "}
          <input name="visibility" type = "radio" value="great" checked={newDiary.visibility==="great"} onChange={handleChange}/>
          <label htmlFor="great">great</label>
          <input name="visibility" type = "radio" value="good" checked={newDiary.visibility==="good"} onChange={handleChange}/>
          <label htmlFor="good">good</label>
          <input name="visibility" type = "radio" value="ok" checked={newDiary.visibility==="ok"} onChange={handleChange}/>
          <label htmlFor="ok">ok</label>
          <input name="visibility" type = "radio" value="poor" checked={newDiary.visibility==="poor"} onChange={handleChange}/>
          <label htmlFor="poor">poor</label>
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
