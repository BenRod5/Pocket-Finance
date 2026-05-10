import { useState } from 'react';
import './Income.css'
import { loadData, saveData } from './data.js'; 

const Income = ({ onAction }) => {
    const [source, setSource] = useState("");
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");
    const [isRecurring, setIsRecurring] = useState(false);
    const [repeatAmount, setRepeatAmount] = useState("monthly");
    const [refresh, setRefresh] = useState(0);
    const [incomes, setIncomes] = useState(loadData().income);
    const [editingID, setEditingID] = useState("");

    function handleRecurring(entry){
        const data = loadData();
        let nextDate = new Date(entry.date);
        const today = new Date("2026-05-01");        
        const stopDate = new Date("2026-07-01");
        const seriesID = entry.id;

        if(nextDate.getMonth() == today.getMonth()){
            while (true) {
                console.log(entry)
                if (entry.repeatAmount === "weekly") {
                    nextDate.setDate(nextDate.getDate() + 7);
                } else if (entry.repeatAmount === "bi-weekly") {
                    nextDate.setDate(nextDate.getDate() + 14);
                } else if (entry.repeatAmount === "monthly") {
                    nextDate.setMonth(nextDate.getMonth() + 1);
                }

                const dateString = nextDate.toLocaleDateString('en-CA');
                console.log(dateString.slice(0,7))
                console.log(data.month)
                console.log(stopDate.toLocaleDateString('en-CA').slice(0,7))
                if (dateString.slice(0,7) > stopDate.toLocaleDateString('en-CA').slice(0,7)) break;
                
                const newData = {
                    id: Date.now() + Math.random(),
                    seriesID: seriesID,
                    source: entry.source,
                    amount: entry.amount,
                    date: dateString,
                    category: entry.category,
                    isRecurring: entry.isRecurring,
                    repeatAmount: entry.isRecurring ? entry.repeatAmount : null
                }

                data.income.push(newData);
                console.log("Dates:")
                console.log(nextDate.getMonth())
                console.log(stopDate.getMonth())
                if (nextDate.getMonth() > stopDate.getMonth()) break;
            }
        }
        saveData(data);
        return data.income;
    }

    function validCheck(data){
        let valid = true;
        if(source=="") valid = false;
        if(amount==0) valid = false;
        if(date == "") valid = false;
        return valid;
    }

    const handleSave = () => {
        const entry = {
            id: Date.now(),
            source: source,
            amount: Number(amount),
            date: date,
            isRecurring: isRecurring,
            repeatAmount: isRecurring ? repeatAmount : null
        };

        if(validCheck(entry)){
            const data = loadData();

            if(editingID) {
                data.income = data.income.filter((item) => item.id !== editingID && item.seriesID !== editingID);
                data.income.push(entry);
                saveData(data);
                setEditingID("");
                if(isRecurring) {
                    const updatedList = handleRecurring(entry);
                    setIncomes(updatedList);
                    console.log(updatedList)
                } else {
                    console.log(data.income)
                    setIncomes(data.income);
                }
                alert("Edit saved!");
            } else {
                data.income.push(entry);
                saveData(data);
                if(isRecurring) {
                    const updatedList = handleRecurring(entry);
                    setIncomes(updatedList);
                    console.log(updatedList)
                } else {
                    console.log(data.income)
                    setIncomes(data.income);
                }
                alert("Saved " + source + " (£" + amount + ") on " + date);
                if (onAction) onAction();
                setRefresh(prev => prev + 1); 
            }
        } else {
            alert("Invalid Input");
        }

        setSource("");
        setAmount(0);
        setDate("");
    };

    function handleDelete(itemID){
        const data = loadData();
        const filteredValues = data.income.filter((item) => item.id!=itemID && (item.isRecurring && item.seriesID != itemID));
        data.income = filteredValues;
        saveData(data);
        setIncomes(data.income);
        console.log(data.income)
        if (onAction) onAction();
    }

    function handleEdit(itemID){
        const data = loadData();
        const ourEntry = data.income.find((item) => item.id == itemID);
        setEditingID(itemID);
        setSource(ourEntry.source);
        setAmount(ourEntry.amount);
        setDate(ourEntry.date);
        setIsRecurring(ourEntry.isRecurring);
        setRepeatAmount(ourEntry.repeatAmount);
        if (onAction) onAction();
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const filteredIncomes = incomes.filter(item => item.date <= todayStr);
    const totalIncome = filteredIncomes.reduce((sum, item) => sum + item.amount, 0);

    return(
        <div className='container'>
            <h3>Add Income Source</h3>

            <input
                type="text"
                placeholder='Source Name'
                value={source}
                onChange={(e) => setSource(e.target.value)}
            />
            <input 
                type="number" 
                placeholder="Amount" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
            />
            <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
            />
            <label>
                <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                />
                Recurring Payment
            </label>
            {isRecurring && (
                <select value={repeatAmount} onChange={(e) => setRepeatAmount(e.target.value)}>
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            )}
            
            <button className='container' onClick={handleSave}>Save Entry</button>

            <h4>Income History</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {filteredIncomes.map((item) => {
                    const percentage = totalIncome > 0 ? ((item.amount / totalIncome) * 100).toFixed(1) : 0;
                    return (
                        <li key={item.id} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {item.source}: £{item.amount} {item.category}— {item.date} - {percentage}%
                            <button 
                                type="button" 
                                onClick={() => handleEdit(item.id)}
                                style={{ backgroundColor: 'black', color: 'white', border: 'none', padding: '2px 8px', cursor: 'pointer', borderRadius: '4px' }}
                            >Edit</button>                        
                            <button 
                                type="button" 
                                onClick={() => handleDelete(item.id)}
                                style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '2px 8px', cursor: 'pointer', borderRadius: '4px' }}
                            >Delete</button> 
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Income;