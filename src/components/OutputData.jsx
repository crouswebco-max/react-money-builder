import React from 'react';
import { formatter } from '../util/investment';

// Shows the results table. The rows are worked out in App (with useMemo) and passed in
const OutputData = ({ rows, caption }) => {
  const last = rows[rows.length - 1];

  return (
    <div className="table-scroll">
      <table id="result">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            <th>Year</th>
            <th>Investment Value</th>
            <th>Interest (Year)</th>
            <th>Total Interest</th>
            <th>Invested Capital</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.year}>
              <td>{row.year}</td>
              <td>{formatter.format(row.valueEndOfYear)}</td>
              <td>{formatter.format(row.interest)}</td>
              <td>{formatter.format(row.totalInterest)}</td>
              <td>{formatter.format(row.investedCapital)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <td>{formatter.format(last.valueEndOfYear)}</td>
            <td></td>
            <td>{formatter.format(last.totalInterest)}</td>
            <td>{formatter.format(last.investedCapital)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default OutputData;
