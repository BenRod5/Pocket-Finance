import { act, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ExpenditureForm from './ExpenditureForm'
import Income from './Income'
import { calculateExpendableIncome } from './data'

function App() {
  const [count, setCount] = useState(0)
  const [activeTab, setActiveTab] = useState("income");

  return (
    <div>
      <h1>Pocket Finance</h1>
      
      <div className='tabs'>
        <button
          className={activeTab === "income" ? "active" : ""}
          onClick={() => setActiveTab("income")}
        >
          Income
        </button>

        <button
        className={activeTab === "expenses" ? "active" : ""}
        onClick={() => setActiveTab("expenses")}
        >
          Expenses
        </button>

      </div>

      <div>
        {activeTab === "income" ? <Income /> : < ExpenditureForm />}
      </div>
      <div>
        <h2>
          Balance: £{calculateExpendableIncome()}
        </h2>
      </div>
  
    </div>
  )
}

export default App
