import React from 'react';

const FIELDS = [
  { id: 'initialInvestment', label: 'Initial Investment ($)' },
  { id: 'annualInvestment', label: 'Annual Investment ($)' },
  { id: 'expectedReturn', label: 'Expected Return (%)' },
  { id: 'duration', label: 'Duration (years)' },
];

// The four inputs for one scenario. The values and errors come from App
const UserInput = ({ title, userInput, errors = {}, onInputChange }) => {
  const prefix = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <section className="user-input" aria-label={title}>
      <h2>{title}</h2>
      <form onSubmit={(event) => event.preventDefault()} noValidate>
        {FIELDS.map((field) => {
          const id = `${prefix}-${field.id}`;
          const error = errors[field.id];
          return (
            <div className="input-group" key={field.id}>
              <label htmlFor={id}>{field.label}</label>
              <div className="input-wrap">
                <input
                  type="number"
                  id={id}
                  min={field.id === 'duration' ? 1 : 0}
                  value={userInput[field.id]}
                  onChange={(event) => onInputChange(field.id, event.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${id}-error` : undefined}
                />
                {/* Task 4: error messages in red */}
                {error && (
                  <span id={`${id}-error`} className="error-text">
                    {error}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </form>
    </section>
  );
};

export default UserInput;
