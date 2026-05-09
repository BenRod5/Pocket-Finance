import { useState } from 'react'
import IncomeGraph from './IncomeGraph';
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ExpenditureForm from './ExpenditureForm'
import Income from './Income'
import AskQuestionForm from './AskQuestionForm.jsx'
import { calculateExpendableIncome } from './data'

function App() {
  const [count, setCount] = useState(0)
  const [activeTab, setActiveTab] = useState("income");
  const [balance, setBalance] = useState(calculateExpendableIncome());
  const [refreshKey, setRefreshKey] = useState(0); // 👈 NEW

  const refresh = () => {
    setBalance(calculateExpendableIncome());
    setRefreshKey(prev => prev + 1); // 👈 forces graph to rebuild
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

        <button
          className={activeTab === "ask" ? "active" : ""}
          onClick={() => setActiveTab("ask")}
        >
          Ask
        </button>
      </div>

      <div>
        {activeTab === "income" ? <Income onAction={refresh}/> : ""}
        {activeTab === "expenses" ? <ExpenditureForm onAction={refresh}/> : ""}
        {activeTab === "ask" ? <AskQuestionForm onAction={refresh}/> : ""}
      </div>

      <div>
        <h2>Balance: £{balance}</h2>
        <IncomeGraph key={refreshKey} /> {/* 👈 rebuilds when refreshKey changes */}
      </div>
    </div>
  )
}

export default App