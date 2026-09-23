// Recreated from the course skeleton (the downloaded project had no src folder).
// Works out how an investment grows, year by year.
//   initialInvestment: the amount you start with
//   annualInvestment:  the amount added at the end of every year
//   expectedReturn:    the yearly return, as a percentage (6 means 6%)
//   duration:          the number of years
export function calculateInvestmentResults({ initialInvestment, annualInvestment, expectedReturn, duration }) {
  const annualData = [];
  let investmentValue = initialInvestment;

  for (let i = 0; i < duration; i++) {
    const interestEarnedInYear = investmentValue * (expectedReturn / 100);
    investmentValue += interestEarnedInYear + annualInvestment;
    annualData.push({
      year: i + 1,
      interest: interestEarnedInYear, // interest earned this year
      valueEndOfYear: investmentValue, // total value at the end of this year
      annualInvestment, // the amount added this year
    });
  }

  return annualData;
}

// Formats a number as dollars with no pennies, e.g. 1234.5 becomes "$1,235"
export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
