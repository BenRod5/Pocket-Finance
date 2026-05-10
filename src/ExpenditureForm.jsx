import React, { useState } from "react";
import './Income.css'
import {loadData, saveData} from './data.js'

function ExpenditureForm({ onAction }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("necessity");
    const [editingID, setEditingID] = useState("");
    const [isRecurring, setIsRecurring] = useState(false);
    const [repeatAmount, setRepeatAmount] = useState("monthly");
    const [expenditures, setExpenditures] = useState(loadData().expenditures);

    function validCheck(data){
        let valid = true;
        if(name=="") valid = false;
        if(amount==0) valid = false;
        if(date == "") valid = false;
        return valid;
    }

    function handleRecurring(entry){
        const data = loadData();
        let nextDate = new Date(entry.date);
        const today = new Date("2026-05-01");        
        const stopDate = new Date("2026-07-01");
        const seriesID = entry.id;

        if(nextDate.getMonth() == today.getMonth()){
            while (true) {
                if (entry.repeatAmount === "weekly") {
                    nextDate.setDate(nextDate.getDate() + 7);
                } else if (entry.repeatAmount === "bi-weekly") {
                    nextDate.setDate(nextDate.getDate() + 14);
                } else if (entry.repeatAmount === "monthly") {
                    nextDate.setMonth(nextDate.getMonth() + 1);
                }

                const dateString = nextDate.toLocaleDateString('en-CA');
                if (dateString.slice(0,7) > stopDate.toLocaleDateString('en-CA').slice(0,7)) break;
                
                const newData = {
                    id: Date.now() + Math.random(),
                    seriesID: seriesID,
                    name: entry.name,
                    amount: entry.amount,
                    date: dateString,
                    category: entry.category,
                    isRecurring: entry.isRecurring,
                    repeatAmount: entry.isRecurring ? entry.repeatAmount : null
                }

                data.expenditures.push(newData);
                if (nextDate.getMonth() > stopDate.getMonth()) break;
            }
        }
        saveData(data);
        return data.expenditures;
    }

    function handleSubmit(e){
        e.preventDefault();
        const newExpenditure = {
            id: Date.now(),
            name: name,
            amount: Number(amount),
            date: date,
            category: category,
            isRecurring: isRecurring,
            repeatAmount: isRecurring ? repeatAmount : null
        };

        if(validCheck(newExpenditure)){
            if(editingID == ""){
                const data = loadData();
                data.expenditures.push(newExpenditure);
                saveData(data);

                if(isRecurring) {
                    const updatedList = handleRecurring(newExpenditure);
                    setExpenditures(updatedList);
                } else {
                    setExpenditures(data.expenditures);
                }
                alert("Saved " + name + " (£" + amount + ") on " + date);
                if (onAction) onAction();
            } else {
                const data = loadData();
                const filteredArray = data.expenditures.filter((item) => item.id != editingID);
                data.expenditures = filteredArray;
                data.expenditures.push(newExpenditure);
                saveData(data);
                setExpenditures(data.expenditures);                    
                if (onAction) onAction();
            }
        } else {
            alert("Invalid Input");
        }

        setName("");
        setAmount("");
        setDate("");
        setCategory("necessity");
        setEditingID("");
        setIsRecurring(false);
        setRepeatAmount("monthly");
    }

    // Kept Mark's original delete logic
    function handleDelete(itemID){
        const data = loadData();
        const filteredValues = data.expenditures.filter((item) => item.id!==itemID && item.seriesID !== itemID);
        data.expenditures = filteredValues;
        saveData(data);
        setExpenditures(data.expenditures);
        if (onAction) onAction();
    }
    
    // Kept Mark's original edit logic
    function handleEdit(itemID){
        const data = loadData();
        const ourEntry = data.expenditures.find((item) => item.id === itemID);
        setEditingID(itemID);
        setName(ourEntry.name || "");
        setAmount(ourEntry.amount || 0);
        setCategory(ourEntry.category || "necessity");
        setDate(ourEntry.date || "");
        if (onAction) onAction();
    }

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className='container'>
        <form onSubmit={handleSubmit}>
        <h3>Add Expenditure</h3>

        <input 
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)} 
        />
        <input 
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)} 
        />
        <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
        />
        <select
            value={category}
            onChange={(e) => setCategory(e.target.value)} 
        >
            <option value="necessity">Necessity</option>
            <option value="luxury">Luxury</option>
        </select>

        <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
        />
        Recurring Payment
        {isRecurring && (
            <select value={repeatAmount} onChange={(e) => setRepeatAmount(e.target.value)}>
                <option value="monthly">Monthly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="weekly">Weekly</option>
            </select>
        )}

        <button className='container' type="submit">Save Entry</button>
        <h4>Expenditure History</h4>
            <ul style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}>
                {expenditures.filter(item => item.date <= todayStr)
                .map((item) => (   
                    <li key={item.id} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.name}: £{item.amount} {item.category}— {item.date} 
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
                ))}
            </ul>
        </form>
        </div>
    );
}

export default ExpenditureForm;