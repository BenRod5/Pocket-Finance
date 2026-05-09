import React, { useState } from "react";
import './Income.css'
import {loadData, saveData,calculateExpendableIncome,} from './data.js'

//to-do 
//display spending money
//make user select savings amount from total income
//plug in real spendingMoney, and savings goal values to make it make more sense
//display graph
//make it prettier
//check for AI looking comments

 const checkAffordability = (purchaseValue, spendingMoney, savingsGoal, daysTillIncome) =>
        {//the function for determining the affordability of a purchase
            //Case 1, Red, purchase Value exceeds spending money and savings goal
            if (purchaseValue > (spendingMoney + savingsGoal)) {
                return {
                status: "red",
                label: "Critical",
                message: "This purchase will exceed your spending money AND your savings money, definitely wait"
                };
            }

            //Case 2, Red, purchase exceeds spending mone and we aren't near our next income
            if (purchaseValue > spendingMoney && daysTillIncome> 3) {
                return {
                status: "red",
                label: "Stop",
                message: `Buying this means you won't hit your ${savingsGoal}% savings target this month, and you're not near your payday so we don't reccomend it.`
                };
            }

            //Case 3, Amber, Purchase exceeds spending money but its payday soon, proceed with caution
            if (purchaseValue > spendingMoney && daysTillIncome <= 3) {
                return {
                status: "yellow",
                label: "Caution",
                message: "Technically over budget, but payday is so close you'll be fine, just don't spend any more!"
                };
            }

            //Case 4, Amber, Serious amount of money spend but it isn't greater then sspending money because it wouldn't have made it this far
            if (purchaseValue > (spendingMoney * 0.6)) {
                return {
                status: "yellow",
                label: "Warning",
                message: "You can afford this, but it will leave you with very little for the rest of the month, so be careful(payday isn't for a while)."
                };
            }

            //Case 5, Green, this is fine actually we don't mind
            return {
                status: "green",
                label: "Safe",
                message: "Treat yourself! This is well within your monthly spending limits."
            };
        }        


function AskQuestionForm() { //the function containing all our form logic
    const [name, setName] = useState("");//establish name of item in question
    const [amount, setAmount] = useState(0);//establish amount the item is worth
    const [quantity, setQuantity] = useState(1);//establish quantity of items purchased
    const [result, setResult] = useState(null);
    // const [category, setCategory] = useState("luxury")
    
   


    function handleSubmit(e) //the function that is called when the form needs to be submitted
    {
        e.preventDefault();//preventDefault here stops the default page activity(reloading the page) before it can erase user data
        
        if(name==="" || amount<=0 || quantity<=0)
        {
            alert("Invalid values detected, please try again");
            return;
        }
    
        const savingsGoal = 0; //I need a way of retreiving savingsGoal here (Josh you gotta finish the feature for asking for it before I can)
        const spendingMoney = calculateExpendableIncome() - savingsGoal;//now we have a value with which to advise the user
        console.log(spendingMoney);
        const data = loadData();
        const today = new Date();

        //function for calculating which income is nearest to todays date
        const nearestToToday = data.income.reduce((best,current) => {

            //handles initial null iteration
            if(best==null)
            {
                return current;
            }

            //establish dates for each value
            const currentDate = new Date(current.date); //current.date is the date value inputted earlier by our IncomeForm
            const bestDate = new Date(best.date);

            //for reference there are 86,400,000 milliseconds in a day
            const daysTillBest = (bestDate-today)/86400000; //should return in milliseconds/86400000 converted to days
            const daysTillCurrent = (currentDate-today)/86400000 //same deal
           
            //choosing between the current date or the best date
            if(daysTillCurrent<0)
            {
                return best;
                //do nothing
            }
            if(daysTillBest<0)
            {
                return current;
            }
            if(daysTillBest>daysTillCurrent)
            {//if current date is closer than best date then take current, otherwise do nothing, meaning take best.
                return current;
            }
            return best;

        }, null);

        //calculates days till next income, including some rounding for clarities sake
        const daysTillIncome= nearestToToday
        ? Math.round((new Date(nearestToToday)-today)/86400000)
        :999;//if no income is found assume the next income is far far away

        //now we have the income source nearest to today and spending money
        const purchaseValue=amount*quantity;//total value of the purchase

        //we can run our affordability function which checks if this purchase is affordable at its current value
        const affordability = checkAffordability(purchaseValue, spendingMoney, savingsGoal, daysTillIncome);


        setResult(affordability); //updates result state so display changes
        setName("");
        setAmount(0);
        setQuantity(1);
        }
    

    const colors = {
        red: '#ff4d4d',
        yellow: '#ffcc00',
        green: '#2ecc71'
    };//these are our traffic light colours 

    return (
        <div className='container'>
        <form onSubmit={handleSubmit}> {/*The form with an attached handleSubmit function*/}
        <h3>Can I Afford This Item?</h3> {/*A label for the ask feature*/}

        
        <input  //an input handler for the name
        type = "text"
        placeholder = "What are you buying?" //placeholders act as default values before one has been assigned by the users input
        value = {name}  //value refers to the backend, stating that the value written in the field should be attached to the variable name(which has a useState established earlier)
        onChange={(e) => setName(e.target.value)} 
        /> {/*this will update the name state variable whenever the user types into the name input field*/}
        



        <input //A standard input handler for amount the item is worth
        type="number"
        placeholder = "Price in £"
        value = {amount}
        onChange={(e) => setAmount(e.target.value)} 
        /> {/*this will update the amount state variable whenever the user types into the amount input field*/}

        
       

        <input
            type="number"
            placeholder = "Qty"
            value = {quantity}
            onChange={(e) => setQuantity(e.target.value)}
        />

        <button className='container' onSubmit>Save Entry</button>

        </form>
        {/*Display the answer to their question*/}
            {result && (
                <div className={`result-container ${result.status}`}
                style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',    // Centers every element horizontally
                        paddingBottom: '20px',   // Adds space at the bottom so its not off the edge
                        textAlign: 'center'      // Centers all the text
                    }}
                >
                    <div className="traffic-light-box">
                        {/* The colored circle */}
                        <div className={`bulb ${result.status}`}
                        style={{
                            width:  '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: colors[result.status] ||'grey'
                        }}
                        ></div>
                        
                        {/*Creates the label, safe, warning, stop*/}
                        <h4 style={{color: colors[result.status], margin: 0}}>
                            {result.label}</h4>
                    </div>

                    {/* The written justification */}
                    <p className="justification-text">
                        {result.message}
                    </p>

                    {/*A button to clear the existing values and try again */}
                    <button onClick={() => setResult(null)} 
                        style={{ alignItems: 'center',backgroundColor: 'black', color: 'white', border: 'none', padding: '10px 16px', cursor: 'pointer', borderRadius: '4px' }}>
                        Check another item 
                    </button>
                </div>
            )}
        </div>
    );
}


/* <select //is this item a luxury or a necessity
        value = {category}
        onChange = {(e) => setCategory(e.target.value)} 
        >{/*Note it is important we attach a value setter and onChange to the select container but not the option as the options don't need to know this logic, only their container*/
            //<option value = "necessity">
            //Necessity    
            //</option> {/*Important note that the value is what is recorded in the backend, the necessity in between the two options is what is displayed to the user */}
            
            //<option value = "luxury"> 
            //Luxury
            //</option>
        //</select>
        // 

export default AskQuestionForm;