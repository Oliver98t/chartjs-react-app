import React, { useState, useEffect } from 'react';
import './DropDown.css';

const OptionDropDown = ({ label, onSelect, options }) => {
  const [selectedOption, setSelectedOption] = useState('');
  //const [options, setOptions] = useState([]);

  useEffect(() => {
    
  }, []);

  const handleChange = (e) => {
    const selected = e.target.value;
    setSelectedOption(selected);
    onSelect(selected); // Send value up to parent
  };

  return (
    <div className='DropDown'>
      <label htmlFor="OptionDropDown"></label>
      <select id="OptionDropDown" value={selectedOption} onChange={handleChange}>
        <option value="" disabled>{label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default OptionDropDown;