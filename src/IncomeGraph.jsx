import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IncomeGraph = () => {
  // 1. Load data using your team's EXACT storage key
  const stored = localStorage.getItem("pocketFinanceData");
  const dataObject = stored ? JSON.parse(stored) : { income: [], expenditures: [] };
  
  const incomeList = dataObject.income || [];
  const expenditureList = dataObject.expenditures || []; // Fixed the spelling here!

  // 2. Helper to sum up numbers for each month
  const getTotalsForMonth = (monthNum) => {
    const monthIncome = incomeList
      .filter(item => item.date && new Date(item.date).getMonth() === monthNum)
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const monthExpenses = expenditureList
      .filter(item => item.date && new Date(item.date).getMonth() === monthNum)
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    return { 
      income: monthIncome, 
      expenses: monthExpenses 
    };
  };

  // 3. Build the data for the bars
  const chartData = [
    { month: 'Jan', ...getTotalsForMonth(0) },
    { month: 'Feb', ...getTotalsForMonth(1) },
    { month: 'Mar', ...getTotalsForMonth(2) },
    { month: 'Apr', ...getTotalsForMonth(3) },
  ];

  return (
    <div style={{ width: '100%', height: 350, backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', marginTop: '20px', border: '1px solid #333' }}>
      <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Monthly Overview</h2>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="month" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} />
          <Legend />
          <Bar dataKey="income" fill="#4caf50" name="Income (£)" />
          <Bar dataKey="expenses" fill="#f44336" name="Expenses (£)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeGraph;