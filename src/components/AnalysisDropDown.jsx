import React, { useState, useEffect } from 'react';
import './DropDown.css';

const AnalysisDropDown = ({ label, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/ohlcv/available_analyses/', {
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
        setOptions(data['data']); // assuming data is an array of strings
      })
      .catch(error => {
        console.error('Error fetching currencies:', error);
      });
  }, []);

  const handleChange = (e) => {
    const selected = e.target.value;
    setSelectedOption(selected);
    
    if(selected != 'RSI')
    {
      const formatted = selected.toLowerCase().replace(/ /g, '_'); 
      onSelect(formatted); // Send value up to parent
    }
    else
    {
      onSelect(selected); // Send value up to parent
    }
  };

  return (
    <div className='DropDown'>
      <label htmlFor="AnalysisDropDown"></label>
      <select id="AnalysisDropDown" value={selectedOption} onChange={handleChange}>
        <option value="" disabled>{label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default AnalysisDropDown;