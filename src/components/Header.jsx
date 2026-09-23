import React from 'react';
import logo from '../assets/investment-calculator-logo.png';

// Tasks 3–4: the header, with the logo and the title.
// Bonuses 1–2: the title and subtitle can be changed with props
const Header = ({ title = 'Investment Calculator', subtitle = 'See how your money could grow over time' }) => {
  return (
    <header id="header">
      {/* img is self-closing in JSX */}
      <img src={logo} alt="Investment Calculator Logo" />
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
};

export default Header;
