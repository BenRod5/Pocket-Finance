# Pocket Finance

A budgeting web app for students. Track income, expenses and savings goals in one place, see the year at a glance, and ask it whether you can afford something before you buy it.

Built in React by a team of four as a second-year Software Engineering group project at Lancaster University (April to May 2026). Everything runs in the browser and your data stays on your own machine.

## Features

**Income**
- Add income sources with an amount and date, such as student finance or a part-time job.
- Mark an entry as recurring (weekly, bi-weekly or monthly) and the app generates the series for the next 12 months.
- Edit or delete an entry, and the whole recurring series updates with it.

**Expenses**
- Log expenditures as either a necessity or a luxury.
- Recurring expenses work the same way as recurring income, so rent only needs entering once.
- Scrollable history with edit and delete.

**Savings**
- Create named goals with a target, an optional monthly amount and a start date.
- Record deposits against a goal and watch the progress bar fill.
- If you set a monthly amount, the app tells you how many months until you reach the goal and which month that will be.

**Ask: "Can I afford this?"**
- Enter what you want to buy, its price and quantity.
- The app compares the total to your spending money and how many days it is until your next income, then gives a traffic-light answer with a short explanation.

**Overview**
- A running balance: all income to date, minus expenses to date, minus savings deposits to date.
- A monthly bar chart of income, expenses and savings for the current year, with a dashed line marking your combined savings target.

## How the affordability check works

The Ask tab works out a purchase's total, your current spending money and the days until your next income, then applies these rules in order:

| Result | When |
|---|---|
| Red, Critical | The purchase costs more than your spending money and your savings target combined |
| Red, Stop | It exceeds your spending money and payday is more than three days away |
| Amber, Caution | It exceeds your spending money but payday is within three days |
| Amber, Warning | It is affordable but would use more than 60% of what you have left |
| Green, Safe | Everything else |

## Tech stack

- [React 19](https://react.dev/) with hooks for all state
- [Vite 8](https://vite.dev/) for the dev server and build
- [Recharts](https://recharts.org/) for the monthly overview chart
- Plain CSS
- Browser `localStorage` for persistence. There is no backend and no account system: each browser holds its own data under a single key, so nothing ever leaves your machine.

## Running it locally

You need [Node.js](https://nodejs.org/) 22 or newer.

```bash
git clone https://github.com/BenRod5/Pocket-Finance.git
cd Pocket-Finance
npm install
npm run dev
```

Then open the address Vite prints, normally `http://localhost:5173`.

Other scripts:

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Project structure

```
src/
  App.jsx              Tab navigation, balance and the overview chart
  data.js              Shared data shape, localStorage load/save and the balance calculation
  Income.jsx           Income form, recurring series and history
  ExpenditureForm.jsx  Expense form, recurring series and history
  Savings.jsx          Savings goals, deposits and progress
  AskQuestionForm.jsx  The affordability check
  IncomeGraph.jsx      Monthly overview chart (Recharts)
  *.css                Styles
public/                Favicon and icons
```

All user data lives in one object in `localStorage` under the key `pocketFinanceData`:

```js
{
  income: [],        // { id, seriesID, source, amount, date, isRecurring, repeatAmount }
  expenditures: [],  // { id, seriesID, name, amount, date, category, isRecurring, repeatAmount }
  savings: [],       // { id, name, target, monthlyAmount, startDate, deposits: [{ id, amount, date }] }
  savingsGoal: 0,
  spendingMoney: 0,
  month: ...
}
```

Entries in a recurring series share a `seriesID`, which is how editing or deleting one updates all of them.

## Limitations

- Data is stored per browser. Clearing site data, or opening the app in another browser, starts from empty.
- Recurring entries are generated for 12 months from the start date, not indefinitely.
- The Ask tab treats the monthly savings goal as zero. Wiring it to the Savings tab was planned but not finished.
- There is no automated test suite. `src/test.js` holds an early set of assertions for the balance logic that is currently commented out.

## Team

Built by Ben Rodman (team lead), Josh Skyner, Saleh and Mark, working on feature branches and merging through pull requests.
