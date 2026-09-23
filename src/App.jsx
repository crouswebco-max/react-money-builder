import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import UserInput from './components/UserInput';
import OutputData from './components/OutputData';
import InvestmentChart from './components/InvestmentChart';
import { calculateInvestmentResults, formatter } from './util/investment';

const INITIAL_INPUT = { initialInvestment: 10000, annualInvestment: 1200, expectedReturn: 6, duration: 10 };
const NAMES = {
  initialInvestment: 'Initial investment',
  annualInvestment: 'Annual investment',
  expectedReturn: 'Expected return',
  duration: 'Duration',
};

// Task 1: the checks for one scenario. Returns { fieldName: message } for every problem
const validate = (input) => {
  const errors = {};
  Object.keys(NAMES).forEach((key) => {
    if (input[key] === '') {
      errors[key] = `${NAMES[key]} is required.`;
    }
  });
  if (input.duration !== '' && input.duration < 1) {
    errors.duration = 'Duration must be at least 1 year.';
  }
  return errors;
};

// Adds the totals each table row needs
const buildRows = (input) =>
  calculateInvestmentResults(input).map((yearData) => {
    const investedCapital = input.initialInvestment + yearData.annualInvestment * yearData.year;
    return { ...yearData, investedCapital, totalInterest: yearData.valueEndOfYear - investedCapital };
  });

function App() {
  const [userInput, setUserInput] = useState(INITIAL_INPUT);
  const [compareInput, setCompareInput] = useState({ ...INITIAL_INPUT, expectedReturn: 8 });
  const [isComparing, setIsComparing] = useState(false);

  // Task 2: the error messages, kept in state
  const [errors, setErrors] = useState({ a: {}, b: {} });

  // Task 5: the inputs the results are showing, and whether a calculation is running
  const [calculated, setCalculated] = useState({ a: INITIAL_INPUT, b: null });
  const [isCalculating, setIsCalculating] = useState(false);

  // Task 1: negative numbers are refused, and the field shows why.
  // An empty box is allowed while typing, and is reported as an error below
  const makeChangeHandler = (scenario, setInput) => (inputIdentifier, newValue) => {
    if (newValue !== '' && +newValue < 0) {
      setErrors((prev) => ({ ...prev, [scenario]: { ...prev[scenario], [inputIdentifier]: `${NAMES[inputIdentifier]} can't be negative.` } }));
      return;
    }
    setInput((prev) => ({ ...prev, [inputIdentifier]: newValue === '' ? '' : +newValue }));
  };

  const handleInputChange = makeChangeHandler('a', setUserInput);
  const handleCompareChange = makeChangeHandler('b', setCompareInput);

  // Task 2 and Task 5: whenever the inputs change, check them. If they're valid, show a short
  // "Calculating…" state (simulated with setTimeout), then update the results.
  // If they're invalid, keep the errors and don't calculate. Errors clear once the inputs are valid
  useEffect(() => {
    const newErrors = { a: validate(userInput), b: isComparing ? validate(compareInput) : {} };
    setErrors(newErrors);

    const hasErrors = Object.keys(newErrors.a).length > 0 || Object.keys(newErrors.b).length > 0;
    if (hasErrors) {
      setIsCalculating(false);
      return;
    }

    setIsCalculating(true);
    const timer = setTimeout(() => {
      setCalculated({ a: userInput, b: isComparing ? compareInput : null });
      setIsCalculating(false);
    }, 400);

    // Clean-up: if the user types again quickly, cancel the old timer
    return () => clearTimeout(timer);
  }, [userInput, compareInput, isComparing]);

  // Task 5: useMemo only redoes the calculation when the calculated inputs change
  const rowsA = useMemo(() => buildRows(calculated.a), [calculated.a]);
  const rowsB = useMemo(() => (calculated.b ? buildRows(calculated.b) : null), [calculated.b]);

  // Task 5: useCallback keeps the same function until its inputs change.
  // The PDF code (jspdf) is only loaded when the button is first clicked, so the page loads faster
  const handleDownload = useCallback(async () => {
    const { generatePDF } = await import('./util/generateReport');
    generatePDF(calculated.a, rowsA);
  }, [calculated.a, rowsA]);

  const hasErrors = Object.keys(errors.a).length > 0 || Object.keys(errors.b).length > 0;
  const lastA = rowsA[rowsA.length - 1];
  const lastB = rowsB ? rowsB[rowsB.length - 1] : null;

  return (
    <>
      <Header title="Money Builder" subtitle="See how your money could grow over time" />

      <main className="app">
        <div className="toolbar">
          <label className="compare-toggle">
            <input type="checkbox" checked={isComparing} onChange={(event) => setIsComparing(event.target.checked)} />
            Compare with a second scenario
          </label>
        </div>

        <div className={isComparing ? 'inputs inputs--two' : 'inputs'}>
          <UserInput title={isComparing ? 'Scenario A' : 'Your Investment'} userInput={userInput} errors={errors.a} onInputChange={handleInputChange} />
          {isComparing && <UserInput title="Scenario B" userInput={compareInput} errors={errors.b} onInputChange={handleCompareChange} />}
        </div>

        {hasErrors && (
          <p className="error-banner" role="alert">
            Please fix the highlighted fields to see your results.
          </p>
        )}

        {!hasErrors && (
          <section className="results" aria-busy={isCalculating}>
            {isCalculating && (
              <p className="loading" role="status">
                <span className="spinner" aria-hidden="true"></span> Calculating…
              </p>
            )}

            <div className={isCalculating ? 'results__content results__content--stale' : 'results__content'}>
              {lastB && (
                <div className="compare-cards">
                  <div className="compare-card">
                    <h3>Scenario A</h3>
                    <p className="compare-card__value">{formatter.format(lastA.valueEndOfYear)}</p>
                    <p>{formatter.format(lastA.totalInterest)} interest</p>
                  </div>
                  <div className="compare-card compare-card--b">
                    <h3>Scenario B</h3>
                    <p className="compare-card__value">{formatter.format(lastB.valueEndOfYear)}</p>
                    <p>{formatter.format(lastB.totalInterest)} interest</p>
                  </div>
                  <p className="compare-verdict">
                    {lastA.valueEndOfYear === lastB.valueEndOfYear
                      ? 'Both scenarios end with the same amount.'
                      : `Scenario ${lastA.valueEndOfYear > lastB.valueEndOfYear ? 'A' : 'B'} ends ${formatter.format(
                          Math.abs(lastA.valueEndOfYear - lastB.valueEndOfYear)
                        )} ahead.`}
                  </p>
                </div>
              )}

              <InvestmentChart rowsA={rowsA} rowsB={rowsB} />

              {/* Task 3: the button only appears when there are results to report */}
              {rowsA.length > 0 && !isCalculating && (
                <div className="download-row">
                  <button type="button" className="download-button" onClick={handleDownload}>
                    Download PDF Report
                  </button>
                </div>
              )}

              <OutputData rows={rowsA} caption={rowsB ? 'Scenario A, year by year' : undefined} />
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default App;
