//here we will write a function which returns 5 values (ID, Name, Amount, Date, Category) which will be used to create a new expenditure entry in the expenditures array of our data structure, we will also write a function to handle the form submission and update the data structure accordingly
//to-do
//write import useState from react 
//write the four state declarations for the form inputs (name, amount, date, category)
//return a form with four inputs, each wired up to onChange
import React, { useState } from "react";
import './Income.css'
import {loadData, saveData} from './data.js'

//to-do, link the users input to the database, storing data as part of the expenditures array inside of the defaultData object
//call saveData to save the data in localStorage
//create a submit button




function ExpenditureForm() {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("necessity"); //default value for category is "necessity"
    



    function handleSubmit(e) //takes an event as input, I don't understand how handleSubmit is supposed to be inside another function, I've never seen a function declared inside a function before
    {

        let valid = true;

        if(name==""){
            valid = false};
        if(amount==0){
            valid=false
        } 
        if(date == ""){
            valid = false
        }
        
        if(valid){
            
            const data = loadData(); //we can get away with creating a new data object here because we know that loadData always returns data of the type defaultData 
            data.expenditures.push(newExpenditure);
            saveData(data)

            alert("Saved " + name + " (£" + amount + ") on " + date);

        }
        else{
            alert("Invalid Input")
        }


        e.preventDefault();
        const newExpenditure = {
            id: Date.now(),
            name: name,
            amount: amount,
            date: date,
            category: category
        };



        setName("");
        setAmount("");
        setDate("");
        setCategory("necessity");
    }


    return (
        <div className='container'>
        <form onSubmit={handleSubmit}> 
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

        <button className='container' onSubmit>Save Entry</button>

        </form>
        </div>
    );
}

export default ExpenditureForm;