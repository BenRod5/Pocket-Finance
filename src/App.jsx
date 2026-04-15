import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ExpenditureForm from './ExpenditureForm'
import Income from './Income'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
      <ExpenditureForm />
      <Income />
    </>
  )
}

export default App
