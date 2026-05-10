import { act, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ExpenditureForm from './ExpenditureForm'
import Income from './Income'
import AskQuestionForm from './AskQuestionForm.jsx'
import Savings from './Savings.jsx'
import { calculateExpendableIncome } from './data'

function App() {
  const [count, setCount] = useState(0)
  const [activeTab, setActiveTab] = useState("income");
  const [balance, setBalance] = useState(calculateExpendableIncome());
  const [refreshKey, setRefreshKey] = useState(0); // 👈 NEW

  const refresh = () => {
    setBalance(calculateExpendableIncome());
    setRefreshKey(prev => prev + 1); 
  }

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

        {/*savings*/}
        <button
        className={activeTab === "savings" ? "active" : ""}
        onClick={() => setActiveTab("savings")}
        >
          Savings
        </button>

        <button
          className={activeTab ==="ask" ? "active" : ""}//don't wholly understand it but I can copy it from josh
          onClick={() => setActiveTab("ask")}
        >
          Ask
        </button>

      </div>

      <div>
        {activeTab === "income" ? <Income onAction={refresh}/> :""}
        {activeTab === "expenses"?<ExpenditureForm onAction={refresh}/>: ""}
        {activeTab === "ask" ? <AskQuestionForm onAction={refresh}/>: ""}
        {activeTab === "savings" ? <Savings onAction={refresh}/>: ""}
      </div>
      <div>
        <h2>
          Balance: £{balance}
      
        </h2>
      </div>
  
    </div>
  )
}

export default App