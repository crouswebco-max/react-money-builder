import { jsPDF } from 'jspdf';
import { formatter } from './investment';

// Task 3: builds a PDF of the results and downloads it
export function generatePDF(userInput, rows) {
  const doc = new jsPDF();
  const last = rows[rows.length - 1];

  // Title and date
  doc.setFontSize(20);
  doc.setTextColor(31, 110, 87);
  doc.text('Investment Report', 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Created ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 27);

  // The inputs
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Initial investment: ${formatter.format(userInput.initialInvestment)}`, 14, 40);
  doc.text(`Annual investment: ${formatter.format(userInput.annualInvestment)}`, 14, 47);
  doc.text(`Expected return: ${userInput.expectedReturn}%`, 14, 54);
  doc.text(`Duration: ${userInput.duration} years`, 14, 61);

  // The table
  const columns = [14, 34, 84, 124, 164];
  const headings = ['Year', 'Value', 'Interest', 'Total interest', 'Invested'];
  let y = 76;
  doc.setFillColor(52, 73, 94);
  doc.rect(12, y - 6, 186, 9, 'F');
  doc.setTextColor(255);
  doc.setFontSize(10);
  headings.forEach((heading, i) => doc.text(heading, columns[i], y));
  doc.setTextColor(0);

  rows.forEach((row, index) => {
    y += 8;
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    if (index % 2 === 1) {
      doc.setFillColor(242, 242, 242);
      doc.rect(12, y - 5.5, 186, 8, 'F');
    }
    const cells = [
      String(row.year),
      formatter.format(row.valueEndOfYear),
      formatter.format(row.interest),
      formatter.format(row.totalInterest),
      formatter.format(row.investedCapital),
    ];
    cells.forEach((cell, i) => doc.text(cell, columns[i], y));
  });

  // Summary
  y += 14;
  if (y > 275) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(12);
  doc.text(
    `After ${userInput.duration} years: ${formatter.format(last.valueEndOfYear)}, including ${formatter.format(last.totalInterest)} interest.`,
    14,
    y
  );

  doc.save('investment-report.pdf');
}
