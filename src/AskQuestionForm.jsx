import React, { useState } from "react";
import './Income.css'
import {loadData, saveData} from './data.js'

//to-do 
//Create the input form
//Create the background logic for calculating if the item is affordable, then decide red, yellow, green
//create functionality to display traffic lights and a written justification

function AskQuestionForm() { //the function containing all our form logic
    const [name, setName] = useState("");//establish name of item in question
    const [amount, setAmount] = useState(0);//establish amount the item is worth
    const [quantity, setQuantity] = useState(0);//establish quantity of items purchased
    const [category, setCategory] = useState("luxury")
    


    function handleSubmit(e) //the function that is called when the form needs to be submitted
    {
        e.preventDefault();//preventDefault here stops the default page activity(reloading the page) before it can erase user data
        const newItem = 
        {//this is an item object containing the values of each useState
            name: name,
            amount: amount,
            category: category,
            quantity: quantity,
        };
        
        let valid = true; //validation code to make sure the users input isn't blank

        if(name==""){valid = false;} //ah I see this is for making sure the user hasn't inputted invalid data, nice

        if(amount==0) {valid=false;} 

        if(quantity ==0) {valid = false;}
        //need to create new code here to handle the calculation and displau logic on submit
    
    

        setName("");//Sets the state values back to default again after the form has been submitted 
        setAmount(0);
        setCategory("necessity");
        setQuantity(0);
    }



    return (
        <div className='container'>
        <form onSubmit={handleSubmit}> {/*The form with an attached handleSubmit function*/}
        <h3>Can I Afford This Item?</h3> {/*A label for the ask feature*/}

        <input  //an input handler for the name
        type = "text"
        placeholder = "Name" //placeholders act as default values before one has been assigned by the users input
        value = {name}  //value refers to the backend, stating that the value written in the field should be attached to the variable name(which has a useState established earlier)
        onChange={(e) => setName(e.target.value)} 
        /> {/*this will update the name state variable whenever the user types into the name input field*/}
        



        <input //A standard input handler for amount the item is worth
        type="number"
        placeholder = "0"
        value = {amount}
        onChange={(e) => setAmount(e.target.value)} 
        /> {/*this will update the amount state variable whenever the user types into the amount input field*/}


        <select //is this item a luxury or a necessity
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
            type="number"
            placeholder = "0"
            value = {quantity}
            onChange={(e) => setQuantity(e.target.checked)}
        />

        <button className='container' onSubmit>Save Entry</button>

        </form>
        </div>
    );
}

export default AskQuestionForm;