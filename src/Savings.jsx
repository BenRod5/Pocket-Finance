import { useState } from 'react';
import { loadData, saveData } from './data.js';
import './Income.css';

const Savings = ({ onAction }) => {
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositDate, setDepositDate] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [goals, setGoals] = useState(loadData().savings || []);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [startDate, setStartDate] = useState("");
  // Add savings goal
  const handleAddGoal = () => {
    if (goalName === "" || goalAmount == 0) {
      alert("Please enter a goal name and amount");
      return;
    }

    const newGoal = {
      id: Date.now(),
      name: goalName,
      target: Number(goalAmount),
      monthlyAmount: Number(monthlyAmount),
      startDate: startDate,
      deposits: []
    };

    const data = loadData();
    if (!data.savings) data.savings = [];
    data.savings.push(newGoal);
    saveData(data);
    setGoals(data.savings);
    setGoalName("");
    setGoalAmount(0);
    setMonthlyAmount(0);
    setStartDate("");
    if (onAction) onAction();
  };

  // Add deposit to a goal
  const handleAddDeposit = () => {
    if (selectedGoalId === "" || depositAmount == 0 || depositDate === "") {
      alert("Please select a goal, enter an amount and a date");
      return;
    }

    const data = loadData();
    if (!data.savings) data.savings = [];

    data.savings = data.savings.map(goal => {
      if (goal.id === Number(selectedGoalId)) {
        return {
          ...goal,
          deposits: [...goal.deposits, {
            id: Date.now(),
            amount: Number(depositAmount),
            date: depositDate
          }]
        };
      }
      return goal;
    });

    saveData(data);
    setGoals(data.savings);
    setDepositAmount(0);
    setDepositDate("");
    if (onAction) onAction();
  };

  // Delete a goal
  const handleDeleteGoal = (goalId) => {
    const data = loadData();
    data.savings = data.savings.filter(goal => goal.id !== goalId);
    saveData(data);
    setGoals(data.savings);
    if (onAction) onAction();
  };

  // Calculate total saved for a goal
  const getTotalSaved = (goal) => {
    return goal.deposits.reduce((sum, d) => sum + d.amount, 0);
  };

  return (
    <div className='container'>
      <h3>Add Savings Goal</h3>

      <input
        type="text"
        placeholder="What are you saving for?"
        value={goalName}
        onChange={(e) => setGoalName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Target Amount (£)"
        value={goalAmount}
        onChange={(e) => setGoalAmount(e.target.value)}
      />

      <input
        type="number"
        placeholder="How much can you save per month? (£)"
        value={monthlyAmount}
        onChange={(e) => setMonthlyAmount(e.target.value)}
      />

       <input
        type="date"
        placeholder="Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <button className='container' onClick={handleAddGoal}>Add Goal</button>

      <h3>Add Deposit to a Goal</h3>

      <select
        value={selectedGoalId}
        onChange={(e) => setSelectedGoalId(e.target.value)}
      >
        <option value="">Select a Goal</option>
        {goals.map(goal => (
          <option key={goal.id} value={goal.id}>{goal.name}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Deposit Amount (£)"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
      />
      <input
        type="date"
        value={depositDate}
        onChange={(e) => setDepositDate(e.target.value)}
      />
      <button className='container' onClick={handleAddDeposit}>Add Deposit</button>

      <h3>Your Savings Goals</h3>

      {goals.length === 0 && <p style={{ color: '#ccc' }}>No savings goals yet. Add one above!</p>}

      {goals.map(goal => {
        const totalSaved = getTotalSaved(goal);
        const percentage = Math.min((totalSaved / goal.target) * 100, 100).toFixed(0);
        const remaining = Math.max(goal.target - totalSaved, 0);

        return (
          <div key={goal.id} style={{ backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #333' }}>
            <h4 style={{ color: '#fff', marginBottom: '8px' }}> {goal.name}</h4>
            <p style={{ color: '#ccc' }}>Target: £{goal.target}</p>
            <p style={{ color: '#ccc' }}>Saved: £{totalSaved}</p>
            <p style={{ color: '#ccc' }}>Remaining: £{remaining}</p>

            {/* Progress Bar */}
            <div style={{ backgroundColor: '#333', borderRadius: '5px', height: '20px', marginTop: '8px' }}>
              <div style={{
                width: `${percentage}%`,
                backgroundColor: percentage >= 100 ? '#4caf50' : '#f4c430',
                height: '100%',
                borderRadius: '5px',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <p style={{ color: '#ccc', marginTop: '4px' }}>{percentage}% complete</p>

            {percentage >= 100 && (
              <p style={{ color: '#4caf50', fontWeight: 'bold' }}>🎉 Goal Reached!</p>
            )}

            {goal.monthlyAmount > 0 && percentage < 100 && (() => {
            const totalMonthsNeeded = Math.ceil(goal.target / goal.monthlyAmount);
            const start = goal.startDate ? new Date(goal.startDate) : new Date();
            start.setMonth(start.getMonth() + totalMonthsNeeded - 1 );
            const reachStr = start.toLocaleString('default', { month: 'long', year: 'numeric' });
              return (
                <div style={{ marginTop: '8px' }}>
                  <p style={{ color: '#f4c430' }}> Saving £{goal.monthlyAmount}/month</p>
                  <p style={{ color: '#f4c430' }}> Goal reached in {totalMonthsNeeded} month{totalMonthsNeeded !== 1 ? 's' : ''} ({reachStr})</p>
                </div>
              );
            })()}

            <button
              onClick={() => handleDeleteGoal(goal.id)}
              style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '4px 10px', cursor: 'pointer', borderRadius: '4px', marginTop: '8px' }}
            >
              Delete Goal
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Savings;