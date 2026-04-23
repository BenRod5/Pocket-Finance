import { useState } from 'react' ;
import './Income.css'
import { loadData, saveData } from './data.js'; 
const Income = ({ onAction }) => {
    //Define the globals
    const [source, setSource] = useState("");
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");
    const [isRecurring, setIsRecurring] = useState(false);
    const [repeatAmount, setRepeatAmount] = useState("monthly");
    const [refresh, setRefresh] = useState(0);




    //Shows when save button is clicked
    const handleSave = () => {

        let valid = true;

        if(source==""){
            valid = false};
        if(amount==0){
            valid=false
        } 
        if(date == ""){
            valid = false
        }
        
        

        const entry = {
            id: Date.now(),
            source: source,
            amount: Number(amount),
            date: date,
            isRecurring: isRecurring,
            repeatAmount: isRecurring ? repeatAmount : null
            };

        if(valid){
            const data = loadData(); //we can get away with creating a new data object here because we know that loadData always returns data of the type defaultData 
            data.income.push(entry);
            saveData(data);
            alert("Saved " + source + " (£" + amount + ") on " + date);
            if (onAction) onAction();
            setRefresh(prev => prev + 1); 
        }
        else{
            alert("Invalid Input");
        }

  

        
        setSource("");
        setAmount(0);
        setDate("");

    };

    return(
        <div className='container'>
        

            <h3>Add Income Source</h3>

            <input
                type="text"
                placeholder='Source Name'
                value={source}
                        //onChange is basically when the button is clicked
                        //e.target.value is the actual value inside of the text box
                        //setSource updates our saved value with the value inside of the text box
                onChange={(e) => setSource(e.target.value)}
            />
            <input 
                    type="number" 
                    placeholder="Amount" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
            />

                <input 
                        //date data type creates the calender drop down
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
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
            </select>
	)}
            
            <button className='container' onClick={handleSave}>Save Entry</button>

            {/* This section is for the Income History */}

            <h4>Income History</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {loadData().income.map((item) => (
                    <li key={item.id} style={{ marginBottom: '8px' }}>
                        {item.source}: £{item.amount} — {item.date}
                    </li>
                ))}
            </ul>




        </div>
        
    );

};

export default Income;