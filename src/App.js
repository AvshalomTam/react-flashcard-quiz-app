import { useState, useEffect, useRef } from 'react'
import FlashcardList from "./FlashcardList";
import './app.css'
import axios from 'axios'

function App() {
  const [flashcards, setFlashcards] = useState(SAMPLE_FLASHCARDS)
  const categoryEl = useRef()

  useEffect(() => {
    axios
    .get('https://opentdb.com/api_category.php')
    .then(response => {
      const {data} = response
      console.log(data.trivia_categories)
    })
  }, [])

  useEffect(() => {
    axios
    .get('https://opentdb.com/api.php?amount=10')
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
  }, [])

  // this function converts all html chars inside the questions to normal string
  function decodeString(str) {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = str
    return textArea.value
  }

  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <>
    <form className="header" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select id="category" ref={categoryEl}>
        </select>
      </div>
    </form>
    
    <div>
      <FlashcardList flashcards={flashcards}/>
    </div>
    </>
  );
}

const SAMPLE_FLASHCARDS = [
  {
    id: 1,
    question: 'what is 2+2?',
    answer: '4',
    options: [
      '2',
      '3',
      '4',
      '5'
    ]
  }, {
    id: 2,
    question: 'what is 2+5?',
    answer: '7',
    options: [
      '7',
      '3',
      '4',
      '5'
    ]
  }, {
    id: 3,
    question: 'what is 2+10?',
    answer: '12',
    options: [
      '2',
      '12',
      '4',
      '5'
    ]
  }
]

export default App;
