import { useState } from 'react' ;
import './Income.css'
const Income = () => {
    //Define the globals
    const [source, setSource] = useState("");
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");
    const [isRecurring, setIsRecurring] = useState(false);
    const [repeatAmount, setRepeatAmount] = useState("monthly");




    //Shows when save button is clicked
    const handleSave = () => {
            alert("Saved " + source + " (£" + amount + ") on " + date);
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
                
                Recurring Payement
            </label>
        {isRecurring && (
            <select value={repeatAmount} onChange={(e) => setRepeatAmount(e.target.value)}>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
            </select>
	)}
            
            <button className='container' onClick={handleSave}>Save Entry</button>


        </div>
    );

};

export default Income;