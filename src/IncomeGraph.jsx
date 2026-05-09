import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const getData = () => {
  const stored = localStorage.getItem("pocketFinanceData");
  return stored ? JSON.parse(stored) : { income: [], expenditures: [] };
};

const IncomeGraph = () => {
  const [chartData, setChartData] = useState([]);

  const buildChartData = () => {
    const dataObject = getData();
    const incomeList = dataObject.income || [];
    const expenditureList = dataObject.expenditures || [];

    const data = MONTHS.map((month, monthNum) => {
      const monthIncome = incomeList
        .filter(item => item.date && new Date(item.date).getMonth() === monthNum)
        .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

      const monthExpenses = expenditureList
        .filter(item => item.date && new Date(item.date).getMonth() === monthNum)
        .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

      return { month, income: monthIncome, expenses: monthExpenses };
    });

    setChartData(data);
  };

  useEffect(() => {
    buildChartData();
    const handleStorageChange = () => buildChartData();
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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