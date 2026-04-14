//here we will write a function which returns 5 values (ID, Name, Amount, Date, Category) which will be used to create a new expenditure entry in the expenditures array of our data structure, we will also write a function to handle the form submission and update the data structure accordingly
//to-do
//write import useState from react 
//write the four state declarations for the form inputs (name, amount, date, category)
//return a form with four inputs, each wired up to onChange
import React, { useState } from "react";

function ExpenditureForm() {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("necessity"); //default value for category is "necessity"
   
    return (
        <form> 
        <input 
        placeholder = "Name" //placeholders act as default values before one has been assigned by the users input
        value = {name}  
        onChange={(e) => setName(e.target.value)} 
        /> {/*this will update the name state variable whenever the user types into the name input field*/}
        
        <input 
        placeholder = "0"
        value = {amount}
        onChange={(e) => setAmount(e.target.value)} 
        /> {/*this will update the amount state variable whenever the user types into the amount input field*/}
        
        <input 
        placeholder = "00/00/0000"
        value = {date}
        onChange={(e) => setDate(e.target.value)    }
        /> {/*this will update the date state variable whenever the user types into the date input field*/}
        
        <input 
        placeholder = "necessity"
        value = {category}
        onChange={(e) => setCategory(e.target.value)}
        /> {/*this will update the category state variable whenever the user selects a different option in the category dropdown*/}
        </form>
    );
}

export default ExpenditureForm;