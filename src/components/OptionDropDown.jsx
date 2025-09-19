import React, { useState, useEffect } from 'react';
import './DropDown.css';

const OptionDropDown = ({ label, onSelect, options }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [processedOptions, setProcessedOptions] = useState([]);
  
  useEffect(() => {

    if(options.urlToDisp_handler == null)
    {
      setProcessedOptions(options.data);
    }
    else
    {
		const p = options.data.map((input) => {
            const args = options.urlToDisp_handler(input);
            return `${args.amount} ${args.interval.replace('_ma','s')}`;
        });
        setProcessedOptions(p);
    }

  }, [options]);

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
        {processedOptions.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}

      </select>
    </div>
  );
};

export default OptionDropDown;