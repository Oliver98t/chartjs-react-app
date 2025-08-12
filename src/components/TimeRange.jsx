import React from 'react';
import './TimeRange.css';

const TimeRangeSelector = ({ startDate, endDate, onChange }) => {
  const handleStartChange = (e) => {
    onChange({ startDate: e.target.value, endDate });
  };

  const handleEndChange = (e) => {
    onChange({ startDate, endDate: e.target.value });
  };

  return (
    <div className="time-range-selector">
      <label>
        <input type="date" value={startDate} onChange={handleStartChange} />
      </label>
      <label>
        <input type="date" value={endDate} onChange={handleEndChange} />
      </label>
    </div>
  );
};

export default TimeRangeSelector;