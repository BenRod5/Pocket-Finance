import React, { useState } from "react";
import './Income.css'
import {loadData, saveData} from './data.js'

//to-do 
//still need to implement the functionality for adding recurring expenditures, with the handleSubmit, duplicated dates method


function ExpenditureForm({ onAction }) { //the function containing all our form logic
    const [name, setName] = useState("");//establishing the variables name, amount, date, category in the back end, establishing an initial state and setter functions for each variable
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("necessity"); //default value for category is "necessity"
    const [editingID, setEditingID] = useState("");//if editingID is "" then nothing needs to be edited if it contains an ID then we are editing values rather than adding a new value
    const [isRecurring, setIsRecurring] = useState(false);
    const [repeatAmount, setRepeatAmount] = useState("monthly");
    const [expenditures, setExpenditures] = useState(loadData().expenditures);

    //these variables name, amount, etc act as the contents of our input fields when the user presses submit. 
    //they are live values which change with each use input

    function validCheck(data){
            let valid = true; //validation code to make sure the users input isn't blank

            if(name==""){//ah I see this is for making sure the user hasn't inputted invalid data, nice
                valid = false};
            if(amount==0){
                valid=false
            } 
            if(date == ""){
                valid = false
            }
            return valid
    }

    function handleRecurring(entry){
        const data = loadData();
        let nextDate = new Date(entry.date);
        const today = new Date("2026-04-01");        
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        if((nextDate.getMonth() == today.getMonth())){
            while (true) {
                if (entry.repeatAmount === "weekly") {
                    nextDate.setDate(nextDate.getDate() + 7);
                } else if (entry.repeatAmount === "bi-weekly") {
                    nextDate.setDate(nextDate.getDate() + 14);
                } else if (entry.repeatAmount === "monthly") {
                    nextDate.setMonth(nextDate.getMonth() + 1);
                }

                const dateString = nextDate.toLocaleDateString('en-CA')
                if (dateString.slice(0,7) !== data.month) break;
                const newData = {
                    id: Date.now() + Math.random(),
                    name: entry.name,
                    amount: entry.amount,
                    date: dateString,
                    category: entry.category,
                    isRecurring: entry.isRecurring,
                    repeatAmount: entry.isRecurring ? entry.repeatAmount : null
                }

                data.expenditures.push(newData);
                if (nextDate.getMonth() != today.getMonth()) break;
            }
        }
        saveData(data);
        return data.expenditures;
    }
        
    function handleSubmit(e) //the function that is called when the form needs to be submitted
    {
        e.preventDefault();//preventDefault here stops the default page activity(reloading the page) before it can erase user data
        
        const newExpenditure = {//this should work instead
                id: Date.now(),//newExpenditure is an object which takes attributes from the values written by the user in the form
                name: name,
                amount: Number(amount),
                date: date,
                category: category,
                isRecurring: isRecurring,
                repeatAmount: isRecurring ? repeatAmount : null
            };
        
            const valid = validCheck(newExpenditure);
            
            if(valid){
                
                if(editingID == "")
                {//add a value as normal
                    const data = loadData();//creates a new data object in line with what is returned by loadData, (either a blank defualtData object, see data.js, or the users previously filled out localStorage, also originally a defaultData object)
                    data.expenditures.push(newExpenditure);//pushes the new expenditure to the users data
                    saveData(data);//saves the edited data to localStorage
                    if(isRecurring) {
                        const updatedList = handleRecurring(newExpenditure);
                        setExpenditures(updatedList);
                    } else {
                        setExpenditures(data.expenditures);
                    }
                    alert("Saved " + name + " (£" + amount + ") on " + date); //alerts the user as to the successful saving of their data.
                    if (onAction) onAction();
                }
                else
                {
                    const data = loadData();
                    // data.expenditures.map((item) => ) //not sure how the map version works
                    const filteredArray =   data.expenditures.filter((item) => item.id != editingID); //filter out the element we are looking to edit
                    data.expenditures = filteredArray;
                    data.expenditures.push(newExpenditure);//push a new object with the users desired values as decided above
                    saveData(data);//save the values
                    setExpenditures(data.expenditures);                    
                    if (onAction) onAction();

                }
               
            }
            else{
                alert("Invalid Input");
            }
        
       

        setName("");//I assume this sets the state values back to default again
        setAmount("");
        setDate("");
        setCategory("necessity");
        setEditingID("");
        setIsRecurring(false);
        setRepeatAmount("monthly");
    }

    function handleDelete(itemID)
    {
        const data = loadData();//loads user data
        const filteredValues = data.expenditures.filter((item) => item.id!=itemID);//filter out all values with ID == itemID
        data.expenditures = filteredValues; //put the filtered expenditures back in the whole data object
        saveData(data);//return all values - that one filtered out ID
        setExpenditures(data.expenditures);//updating the expenditures state once saveData is called so the display adjusts
        if (onAction) onAction();

    }
    
    function handleEdit(itemID)
    {//is called when the edit button is clicked in the expenditure list
        const data = loadData();//loads user data from localStorage
        const ourEntry = data.expenditures.find((item) => item.id ==itemID);//search the expenditures array for the ID equal to itemID
        setEditingID(itemID);//fills in the form with values from the selected expenditure
        setName(ourEntry.name);
        setAmount(ourEntry.amount);
        setCategory(ourEntry.category);
        setDate(ourEntry.date); 
        if (onAction) onAction();

    }


    return (
        <div className='container'>
        <form onSubmit={handleSubmit}> {/*The form with an attached handleSubmit function which does what it says */}
        <h3>Add Expenditure</h3> {/*Added a label to the expenditure section, good idea josh */}

        <input 
        type = "text"
        placeholder = "Name" //placeholders act as default values before one has been assigned by the users input
        value = {name}  //value refers to the backend, stating that the value written in the field should be attached to the variable name(which has a useState established earlier)
        onChange={(e) => setName(e.target.value)} 
        /> {/*this will update the name state variable whenever the user types into the name input field*/}
        
        <input 
        type="number"
        placeholder = "0"
        value = {amount}
        onChange={(e) => setAmount(e.target.value)} 
        /> {/*this will update the amount state variable whenever the user types into the amount input field*/}
        
        <input 
        type="date" 
        value={date} 
        onChange={(e) => setDate(e.target.value)} 

        /> {/*this will update the date state variable whenever the user types into the date input field*/}
 

        <select
        value = {category}
        onChange = {(e) => setCategory(e.target.value)} 
        >{/*Note it is important we attach a value setter and onChange to the select container but not the option as the options don't need to know this logic, only their container*/}
            <option value = "necessity">
            Necessity    
            </option> {/*Important note that the value is what is recorded in the backend, the necessity in between the two options is what is displayed to the user */}
            
            <option value = "luxury"> 
            Luxury
            </option>
        </select>

        <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
        />
        Recurring Payment
        {isRecurring && (
        <select value = {repeatAmount} onChange = { (e) => setRepeatAmount (e.target.value)}>
            <option value = "monthly"> Monthly </option>
            <option value = "bi-weekly"> Bi-Weekly </option>
            <option value = "weekly"> Weekly </option>
        </select>
        )}

        <button className='container' onSubmit>Save Entry</button>

        <h4>Expenditure History</h4>{/*basically a copied over version of income history with some edit and delete button changes*/}
            <ul style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}>

                {expenditures.map((item) => (   
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