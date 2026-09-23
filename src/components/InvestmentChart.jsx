import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatter } from '../util/investment';

// Bonus: a chart of the investment's growth, made with the recharts library.
// When comparing, scenario B's value is drawn as a second line
const InvestmentChart = ({ rowsA, rowsB }) => {
  const years = Math.max(rowsA.length, rowsB ? rowsB.length : 0);
  const data = Array.from({ length: years }, (_, index) => ({
    year: index + 1,
    valueA: rowsA[index]?.valueEndOfYear,
    capitalA: rowsA[index]?.investedCapital,
    valueB: rowsB?.[index]?.valueEndOfYear,
  }));

  return (
    <figure className="chart" aria-label="Investment growth chart">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid stroke="rgba(225, 238, 235, 0.15)" />
          <XAxis dataKey="year" stroke="#a7c4bd" label={{ value: 'Year', position: 'insideBottom', offset: -5, fill: '#a7c4bd' }} />
          <YAxis stroke="#a7c4bd" width={80} tickFormatter={(value) => formatter.format(value)} />
          <Tooltip formatter={(value) => formatter.format(value)} labelFormatter={(year) => `Year ${year}`} />
          <Legend verticalAlign="top" />
          <Line type="monotone" dataKey="valueA" name={rowsB ? 'Scenario A value' : 'Investment value'} stroke="#5dd39e" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="capitalA" name="Invested capital" stroke="#f5d547" strokeWidth={2} strokeDasharray="6 5" dot={false} />
          {rowsB && <Line type="monotone" dataKey="valueB" name="Scenario B value" stroke="#7cc4ff" strokeWidth={3} dot={false} />}
        </LineChart>
      </ResponsiveContainer>
    </figure>
  );
};

export default InvestmentChart;
