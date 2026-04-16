// Shared data structure for Pocket Finance
// All features read from and write to localStorage using these keys do not access localStorage directly, in order to enforce as much modularity as we can we want to only use save and load data, keep things simple

//fun note about localStorage, it is unique to each user and stored on their browser, so even if they all have the same pocketFinanceData storage key, their data will never overlap which saves us a lot of complexity and the headache of storing their data on a server

export const STORAGE_KEY = "pocketFinanceData"; //A key used to store all user data in localStorage, each user will have one defaultData object


export const defaultData = { //exported default data structure for any other file to access
  income: [
    // { id, source, amount, dayOfMonth } the shape of each income entry
    // e.g. { id: 1, source: "Student Finance", amount: 1200, dayOfMonth: 1 }
  ], 
  expenditures: [
    // { id, name, amount, date, category } //the shape of each input to the expenditures array
    // category must be either "necessity" or "luxury"
    // e.g. { id: 1, name: "Rent", amount: 500, date: "2026-04-01", category: "necessity" }
  ],
  savingsGoal: 0,       // amount user wants to save this month
  spendingMoney: 0,     // expendable income minus savings goal
  month: "2026-04"      // current active month, in "YYYY-MM" format, storing it this way makes it easy to compare and sort dates
};

// Call this to load data from localStorage
export function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY); //retrieves all user data stored under STORAGE_KEY from localStorage as text, if it exists
  return stored ? JSON.parse(stored) : defaultData; //converts said text retrieved from localStorage into a javaScript object (JSON)
}//returns either the parsed data from localStorage if it exists, or the defaultData object(to start out a new user) if it doesn't, ensuring that the application always has a valid data structure to work with
//stored ? checks if there is data in stored, if so then call JSON.parse(stored), otherwise return defaultData

// Call this to save data to localStorage
export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); //converts the dataObject into a String(JSON) and saves it localStorage under the key defined by STORAGE_KEY, allowing the application to persist user data across sessions
}


// Task 1: Calculate the expendable income based on: (total income - expenditures).
export function calculateExpendableIncome(data) {
  // Calculates both the total income and expenditure received from the user
  // and then calculates the difference between the two to find
  // the expendable income.
  const totalIncome = data.income.reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenditure = data.expenditures.reduce((sum, entry) => sum + entry.amount, 0);
  const expendableIncome = totalIncome - totalExpenditure;
  return expendableIncome;


}

// Task 2: Facilitate a savings goal per month made with regard
// to the amount of expendable income they wish to save.
export function setSavingsGoal(data, goal) {
  // Uses expendableIncome function to receive data.
  const expendableIncome = calculateExpendableIncome(data);
  data.savingsGoal = goal;
  
  // Calculates the spending money based on expendableIncome
  // and savings goal.
  data.spendingMoney = expendableIncome - goal;

  // Saves and returns the data to the local storage (STORAGE_KEY).
  saveData(data);
  return data;
}

// Task 3: Add unspent money to the next months spending money.
export function rolloverleftoverToNextMonth(data, newMonth) {
  // Takes input from the user to calculate the total money spent.
  const actualSpend = data.expenditures.reduce((sum, entry) => sum + entry.amount, 0);
  const unspent = data.spendingMoney - actualSpend;

  // Resets the data while rolling over the spending money to next month.
  // E.g., Resets expenditures, increments month (i.e. "2026-07")
  // also resets the savings goal so that the user can set a new one.
  // and will carry over the unspent money and add it to expendable
  // income.
  data.expenditures = [];
  data.month = newMonth;
  data.savingsGoal = 0;
  data.spendingMoney = calculateExpendableIncome(data) + unspent;

  // Saves and returns the data to the local storage (STORAGE_KEY).
  saveData(data);
  return data;

}



