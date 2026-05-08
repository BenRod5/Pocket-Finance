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
    const [incomes, setIncomes] = useState(loadData().income);
    const [editingID, setEditingID] = useState("");//if editingID is "" then nothing needs to be edited if it contains an ID then we are editing values rather than adding a new value
    




    function handleRecurring(entry){
        const data = loadData();
        let nextDate = new Date(entry.date);
        const today = new Date("2026-05-01");        
        const stopDate = new Date("2026-07-01");
        const seriesID = entry.id;
        if((nextDate.getMonth() == today.getMonth())){
            while (true) {
                console.log(entry)
                if (entry.repeatAmount === "weekly") {
                    nextDate.setDate(nextDate.getDate() + 7);
                } else if (entry.repeatAmount === "bi-weekly") {
                    nextDate.setDate(nextDate.getDate() + 14);
                } else if (entry.repeatAmount === "monthly") {
                    nextDate.setMonth(nextDate.getMonth() + 1);
                }

                const dateString = nextDate.toLocaleDateString('en-CA')
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

    //Shows when save button is clicked




    function validCheck(data){
            let valid = true; //validation code to make sure the users input isn't blank

            if(source==""){//ah I see this is for making sure the user hasn't inputted invalid data, nice
                valid = false};
            if(amount==0){
                valid=false
            } 
            if(date == ""){
                valid = false
            }
            return valid
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
            // Not sure if a good fix. - Please check this if possible.
            const data = loadData(); //we can get away with creating a new data object here because we know that loadData always returns data of the type defaultData

            if(editingID) {
                // Edit mode. - Swap out old entry. Filter out recurring payments
                // when needed.
                // data.income = data.income.map((item) =>
                // item.id === editingID ? entry : item
                // );
                data.income = data.income.filter((item) => item.id !== editingID &&
                item.seriesID !== editingID);

                // Push updated entry back in.
                data.income.push(entry);
                saveData(data);
                //setIncomes(data.income);
                setEditingID("");
                // If you change whether it is recurring.
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
                // Add mode. - If editingID is not set. 
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

        }
        else{
            alert("Invalid Input");
        }

  

        
        setSource("");
        setAmount(0);
        setDate("");

    };

    function handleDelete(itemID){

        const data = loadData();//loads user data
        const filteredValues = data.income.filter((item) => item.id!=itemID && (item.isRecurring && item.seriesID != itemID ));//filter out all values with ID == itemID
        data.income = filteredValues; //put the filtered expenditures back in the whole data object
        saveData(data);//return all values - that one filtered out ID
        setIncomes(data.income);//updating the expenditures state once saveData is called so the display adjusts
        console.log(data.income)
        if (onAction) onAction();
    }

    function handleEdit(itemID){

            const data = loadData();//loads user data from localStorage
            const ourEntry = data.income.find((item) => item.id ==itemID);//search the expenditures array for the ID equal to itemID
            setEditingID(itemID);//fills in the form with values from the selected expenditure
            // Tempoarily commented out to allow 'Edit' to function.
            // Added 'setSource'.
            setSource(ourEntry.source);
            setAmount(ourEntry.amount);
            //setName(ourEntry.source);
            //setCategory(ourEntry.category);
            //setSeriesID(ourEntry.seriesID);
            setDate(ourEntry.date);
            // Added IsRecurring and RepeatAmount.
            setIsRecurring(ourEntry.isRecurring);
            setRepeatAmount(ourEntry.repeatAmount);
            if (onAction) onAction();
            
}



    const todayStr = new Date().toISOString().split('T')[0];
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
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
            </select>
	)}
            
            <button className='container' onClick={handleSave}>Save Entry</button>

            {/* This section is for the Income History */}

            <h4>Income History</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {loadData().income.filter(item => item.date <=todayStr)
                .map((item) => (
                    <li key={item.id} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>

                        {item.source}: £{item.amount} {item.category}— {item.date}

                        {/*Edit button.*/}
                        <button 
                        type="button" 
                        onClick={() => handleEdit(item.id)}
                        style={{ backgroundColor: 'black', color: 'white', border: 'none', padding: '2px 8px', cursor: 'pointer', borderRadius: '4px' }}
                        >Edit</button>                        
                        
                        {/*Delete button.*/}
                        <button 
                        type="button" 
                        onClick={() => handleDelete(item.id)}
                        style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '2px 8px', cursor: 'pointer', borderRadius: '4px' }}
                        >Delete</button> 
                    </li>
                ))}
            </ul>




        </div>
        
    );

};

export default Income;