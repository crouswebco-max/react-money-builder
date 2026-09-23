# Money Builder

An investment calculator built with React and Vite. Enter a starting amount, how much you add each year, the expected return and how many years, and Money Builder shows how your money could grow, with a year-by-year table, a chart and a PDF report you can download. You can also compare two scenarios side by side.

I built it as the React checkpoint project for the IT Online Learning React Essentials course (Module 7). The rest of my coursework is in [itonlinelearning-coursework](https://github.com/crouswebco-max/itonlinelearning-coursework).

**Live demo:** https://crouswebco-max.github.io/react-money-builder/

![Comparing two scenarios in Money Builder](screenshots/money-builder-compare.png)

## Features

- **Live results:** the table and chart update as you type, with a short "Calculating…" state.
- **Validation:** every field is required, negative numbers are refused, and the duration must be at least 1 year. Errors show in red under each field, and the results stay hidden until the inputs are valid.
- **Chart:** a `recharts` line chart of the investment's value and the money you've put in.
- **PDF report:** **Download PDF Report** builds a report with `jspdf`, with the inputs, a table and a summary.
- **Compare scenarios:** tick "Compare with a second scenario" to see Scenario B beside Scenario A, which one ends ahead and by how much.

## Run it

You need [Node.js](https://nodejs.org/) installed.

```text
git clone https://github.com/crouswebco-max/react-money-builder.git
cd react-money-builder
npm install
npm run dev
```

Then open the address Vite prints (usually `http://localhost:5173`). `npm run build` makes a production build in `dist/`, and `npm run deploy` builds it and publishes it to GitHub Pages (with the `gh-pages` package, which pushes `dist/` to the `gh-pages` branch).

## How it's built

```text
src/
├── index.jsx                  Entry point: renders <App /> into #root
├── App.jsx                    State, validation, calculations and layout
├── index.css                  Styles
├── components/
│   ├── Header.jsx             Logo, title and subtitle
│   ├── UserInput.jsx          The four inputs for one scenario
│   ├── OutputData.jsx         The year-by-year results table
│   └── InvestmentChart.jsx    The recharts line chart
└── util/
    ├── investment.js          calculateInvestmentResults() and the money formatter
    └── generateReport.js      generatePDF() for the report
```

## React concepts

### Components

A component is a JavaScript function that returns what should appear on screen. Money Builder is split into small components, each with one job:

- `Header` shows the logo and title.
- `UserInput` shows the four inputs for one scenario. When comparing, the same component is used twice, once for Scenario A and once for Scenario B, just with different props.
- `OutputData` shows the results table.
- `InvestmentChart` draws the chart.

`App` is the parent. It holds the **state** (the inputs, the errors and whether a calculation is running) and passes data down to the other components as **props**, like `<UserInput title="Scenario B" userInput={compareInput} errors={errors.b} onInputChange={handleCompareChange} />`. When a child needs to change something, it calls a function that `App` passed to it (`onInputChange`), so the data always flows one way.

The app also uses these hooks:

- `useState` for the inputs and errors.
- `useEffect` to check the inputs whenever they change.
- `useMemo` so the rows are only worked out again when the inputs change.
- `useCallback` so the download handler stays the same function between renders.

### JSX

JSX is the HTML-like syntax inside the components. It isn't HTML: it's turned into JavaScript function calls before it reaches the browser. That's why it can mix in JavaScript with curly braces:

```jsx
<td>{formatter.format(row.valueEndOfYear)}</td>
```

It also has a few rules that are different from HTML:

- `className` instead of `class`, and `htmlFor` instead of `for`.
- Every tag must close, so it's `<img />` and not `<img>`.
- A component returns one parent element, or a fragment `<>...</>`.
- Lists are made with `.map()`, and each item needs a `key`, like `<tr key={row.year}>`.
- Conditions use `&&` or the ternary operator, like `{hasErrors && <p className="error-banner">...</p>}`.

### The virtual DOM

Changing the real page (the DOM) is slow compared with plain JavaScript. So React keeps a lightweight copy of the page in memory, called the **virtual DOM**.

When state changes, for example when you type a new expected return, this happens:

1. React runs the components again and builds a new virtual DOM.
2. It compares the new version with the old one. This is called **diffing**.
3. It updates only the parts of the real page that actually changed. This is called **reconciliation**.

So typing one number updates the table cells, the chart and the summary, but React doesn't rebuild the inputs or the header. The `key` on each table row helps React match rows between renders, so it knows which ones changed.

### Vite vs Create React App

Both tools set up a React project with a development server and a production build. I used Create React App for some earlier course activities and Vite for this one.

| | Vite | Create React App |
|---|---|---|
| **Starting the dev server** | Almost instant. It serves your files as native ES modules and only transforms a file when the browser asks for it | Slower, because webpack bundles the whole app before the server starts |
| **Updates while coding** | Hot module replacement changes just the edited module, so updates feel immediate | Rebuilds more of the bundle, so it slows down as the project grows |
| **Production build** | Rollup, with code splitting | webpack |
| **Entry point** | `index.html` sits in the project root and loads `src/index.jsx` with a `<script type="module">` | `public/index.html`, with the script added for you |
| **Commands** | `npm run dev`, `npm run build` | `npm start`, `npm run build` |
| **Status** | Actively developed, and recommended by the React docs | Deprecated by the React team in 2025 for new projects |

I chose Vite because it's much faster to start and update. It's also what the React docs recommend now that Create React App is no longer supported for new projects.

## What I learned

- Keeping state in one parent (`App`) and passing it down made validation and comparing scenarios much simpler. Both scenarios use the same `UserInput` component.
- Number inputs give back strings. `"2000" + 100` gives `"2000100"`, so I convert each value with `+value` before storing it.
- The PDF library is big, so it's only loaded when the button is first clicked, with `await import('./util/generateReport')`. That keeps the first load faster.
