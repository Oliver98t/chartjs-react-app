import React, { useState, useEffect } from 'react';
import './DropDown.css';

const CurrencyDropDown = ({ label, currency_type, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/ohlcv/available_currencies/', {
      headers: {
        Accept: 'application/json'
      }
      
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setOptions(data['data'][currency_type]); // assuming data is an array of strings
      })
      .catch(error => {
        console.error('Error fetching currencies:', error);
      });
  }, []);

  const handleChange = (e) => {
    const selected = e.target.value;
    setSelectedOption(selected);
    onSelect(selected); // Send value up to parent
  };

  return (
    <div className='DropDown'>
      <label htmlFor="CurrencyDropDown"></label>
      <select id="CurrencyDropDown" value={selectedOption} onChange={handleChange}>
        <option value="" disabled>{label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default CurrencyDropDown;