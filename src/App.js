import { useState, useEffect, useRef } from 'react'
import FlashcardList from "./FlashcardList";
import './app.css'
import axios from 'axios'

function App() {
  const [flashcards, setFlashcards] = useState([])
  const [categories, setCategories] = useState([])
  const categoryEl = useRef()
  const amountEl = useRef()

  useEffect(() => {
    axios
    .get('https://opentdb.com/api_category.php')
    .then(response => {
      const {data} = response
      setCategories(data.trivia_categories)
    })
  }, [])

  useEffect(() => {
    
  }, [])

  // this function converts all html chars inside the questions to normal string
  function decodeString(str) {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = str
    return textArea.value
  }

  function handleSubmit(e) {
    e.preventDefault()
    axios
    .get('https://opentdb.com/api.php', {
      params: {
        amount: amountEl.current.value,
        category: categoryEl.current.value
      }
    })
    .then((response) => {
      const {data} = response
      const {results} = data 
      const properQuestions = results.map((questionItem, index) => {
        const answer = decodeString(questionItem.correct_answer)
        const fourOptions = [
          answer,
           ...questionItem.incorrect_answers.map(ans => {
             return decodeString(ans)
           })
          ]

        return {
          id: `${index}-${Date.now()}`,
          question: decodeString(questionItem.question),
          answer: answer,
          options: fourOptions.sort(() => Math.random() - .5)
        }
      })

      setFlashcards(properQuestions)
    })
  }

  return (
    <>
    <form className="header" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select id="category" ref={categoryEl}>
          {categories.map(category => {
            return <option value={category.id} key={category.id}>{category.name}</option>
          })}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input 
          type="number" 
          id="amount" 
          min="1" 
          step="1"
          defaultValue={10}
          ref={amountEl}
           >
        </input>
      </div>

      <div className="form-group">
          <button className="btn">Generate</button>
      </div>
    </form>
    
    <div>
      <FlashcardList flashcards={flashcards}/>
    </div>
    </>
  );
}

export default App;