// I kept the income history intact as a sort of
// convenience feature. So that users can look at their past sources
// of income to determine what their savings goal may be.
// Let me know if I need to remove it.
import { useState } from 'react' ;
import './Savings.css'
import { calculateExpendableIncome, loadData, saveData, setSavingsGoal } from './data.js'; 
function Savings({ onAction }) {
    //Define the globals. Is required to display the Income History in the savings section.
    const [source, setSource] = useState("");
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");
    const [isRecurring, setIsRecurring] = useState(false);
    const [repeatAmount, setRepeatAmount] = useState("monthly");
    const [refresh, setRefresh] = useState(0);
    const [incomes, setIncomes] = useState(loadData().income);
    const [editingID, setEditingID] = useState("");
    // If editingID is "" then nothing needs to be edited if it contains an
    // ID then we are editing values rather than adding a new value.

    // Global Savings goal variable.
    const [savingsGoal, setSavings] = useState(0);

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


    const handleSavings = () => {

        // Calculate balance to use in determining whether the
        // savingsGoal is valid.
        const balance = calculateExpendableIncome();
        console.log(balance);
        

        if(savingsGoal <= balance){
            // Not sure if a good fix. - Please check this if possible.
            const data = loadData(); //we can get away with creating a new data object here because we know that loadData always returns data of the type defaultData
            setSavingsGoal(data, savingsGoal);
            alert("Savings goal set to: £" + savingsGoal);
            console.log(savingsGoal);

        }
        else{
            alert("Invalid Input");
        }

    };


// HTML Section of Savings.jsx
    const todayStr = new Date().toISOString().split('T')[0];
    // I moved the income here to declare them as variables.
    const filteredIncomes = incomes.filter(item => item.date <= todayStr);
    const totalIncome = filteredIncomes.reduce((sum, item) => sum + item.amount, 0);
    return(
        <div className='container'>
            <h3>Set Savings Goal</h3>
            
            <input 
                    type="number" 
                    placeholder="Savings Goal" 
                    value={savingsGoal}
                        //onChange is basically when the button is clicked
                        //e.target.value is the actual value inside of the text box
                        //setSource updates our saved value with the value inside of the text box
                    onChange={(e) => setSavings(e.target.value)} 
            />

            {/*Submit Savings goal button.*/}
            <button className='container' onClick={handleSavings}>Submit Entry</button>

            {/* This section is for the Income History */}
            <h4>Income History</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {filteredIncomes.map((item) => {
                    // Ternary operation: Won't calculate % if no income is present.
                    const percentage = totalIncome > 0 ? ((item.amount / totalIncome) * 100).toFixed(1):0;
                return (
                    <li key={item.id} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/*Display Source, Amount and Percentage. I decided to keep this incase the user wants
                        to look through their income history while determining a savings goal.*/}
                        {item.source}: £{item.amount} {item.category}— {item.date} - {percentage}%
                    </li>
                );
            })}       
            </ul>
        </div>
        
    );

};

export default Savings;