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
        const stopDate = new Date(entry.date);
        stopDate.setMonth(stopDate.getMonth() + 12);

        console.log("START DATE:", nextDate.toLocaleDateString('en-CA'));
        console.log("STOP DATE:", stopDate.toLocaleDateString('en-CA'));
        
        const seriesID = entry.id;
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


            const newData = {
                id: Date.now() + Math.random(),
                seriesID: seriesID,
                source: entry.source,
                amount: entry.amount,
                date: dateString,
                isRecurring: entry.isRecurring,
                repeatAmount: entry.isRecurring ? entry.repeatAmount : null
            }
            data.income.push(newData);

            if (nextDate > stopDate) break;
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

        const now = Date.now()

        const entry = {
            id: now,
            seriesID: now,
            source: source,
            amount: Number(amount),
            date: date,
            isRecurring: isRecurring,
            repeatAmount: isRecurring ? repeatAmount : null
            };
        

        if(validCheck(entry)){


            if(editingID == ""){
                const data = loadData();
                data.income.push(entry);


                if(isRecurring) {
                    saveData(data)
                    const updatedList = handleRecurring(entry);
                    setIncomes(updatedList);

                } else {
                    saveData(data)
                    setIncomes(data.income);
                }
                alert("Saved " + source + " (£" + amount + ") on " + date);
                if (onAction) onAction();
            }
            else{

                const data = loadData();

                data.income = data.income.map((item) => {
                    if (item.seriesID === editingID){
                        return{
                            ...item,
                            source,
                            amount: Number(amount),
                            
                            isRecurring,
                            repeatAmount: isRecurring ? repeatAmount : null
                        };
                    }
                    return item;
                });
                saveData(data)
                setIncomes(data.income);
                if (onAction) onAction();
            }
        }
        else{
            alert("Invalid Input");
        }

  

        
        setSource("");
        setAmount(0);
        setDate("");
        setEditingID("");
        setIsRecurring(false);
        setRepeatAmount("monthly");

    };

    function handleDelete(itemID){

        const data = loadData();//loads user data
        const filteredValues = data.income.filter((item) => item.id!=itemID &&  item.seriesID != itemID );//filter out all values with ID == itemID
        data.income = filteredValues; //put the filtered expenditures back in the whole data object
        saveData(data);//return all values - that one filtered out ID
        setIncomes(data.income);//updating the expenditures state once saveData is called so the display adjusts
        if (onAction) onAction();
    }

    function handleEdit(itemID){

            const data = loadData();//loads user data from localStorage
            const ourEntry = data.income.find(
                (item) => item.id ===itemID);//search the expenditures array for the ID equal to itemID
            
            
            setEditingID(itemID);//fills in the form with values from the selected expenditure
            setSource(ourEntry.source || "");
            setAmount(ourEntry.amount || 0);
            setDate(ourEntry.date || ""); 
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




        </div>
        
    );

};

export default Income;