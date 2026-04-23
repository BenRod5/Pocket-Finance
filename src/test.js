// // Import the respective functions from ./data.js for testing.
// import { calculateExpendableIncome, setSavingsGoal, rolloverleftoverToNextMonth } from './data.js';

// function assert(description, actual, expected) {
//   if (actual === expected) {
//     console.log(`:D PASS: ${description}`);
//   } else {
//     console.log(`D: FAIL: ${description} — expected ${expected}, got ${actual}`);
//   }
// }

// // Test 1: Expendable income is income minus expenditures
// const data1 = {
//   income: [{ id: 1, source: "Job", amount: 1500 }],
//   expenditures: [{ id: 1, name: "Rent", amount: 500 }],
//   savingsGoal: 0, spendingMoney: 0, month: "2026-04"
// };
// assert("calculateExpendableIncome", calculateExpendableIncome(data1), 1000);

// // Test 2: Savings goal updates spendingMoney correctly
// // data2 contains all of the properties from data1
// // data3 meanwhile is the same, but has spendingMoney overridden to 1000
// const data2 = { ...data1 };
// setSavingsGoal(data2, 200);
// assert("spendingMoney after savings goal", data2.spendingMoney, 800);

// // Test 3: Rollover carries unspent money forward
// const data3 = { ...data1, spendingMoney: 1000 };
// rolloverleftoverToNextMonth(data3, "2026-05");
// assert("Rollover unspent money", data3.spendingMoney, 2000); // 1500 fresh income + 1000 unspent