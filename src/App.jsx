import React, { useState } from 'react';
import CurrencyDropDown from './components/CurrencyDropDown.jsx';
import AnalysisDropDown from './components/AnalysisDropDown.jsx';
import NumberChart from './components/NumberChart.jsx';
import TimeRange from './components/TimeRange.jsx'
import './App.css'

const App = () => {
  const [crypto, setCrypto] = useState('');
  const [fiat, setFiat] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [range, setRange] = useState({
    startDate: '2025-07-01',
    endDate: '2025-08-01',
  });

  const handleCrypto = (value) => {
    setCrypto(value);
  };

  const handleFiat = (value) => {
    setFiat(value);
  };

  const handleAnalysis = (value) => {
    setAnalysis(value);
  };

  const ticker = crypto && fiat ? `${crypto}/${fiat}` : 'placeholder';
  
  return (
    <div>

      <div className="input-row">
        <NumberChart
          ticker={ticker}
          startDate={range.startDate}
          endDate={range.endDate}
        />
      </div>

      <div className="input-row">
        <div>
          <h2>Crypto/Fiat</h2>
          <div className="input-row">
          <CurrencyDropDown
            label="Crypto..."
            currency_type="crypto"
            onSelect={handleCrypto}
          />
          <CurrencyDropDown
            label="Fiat..."
            currency_type="fiat"
            onSelect={handleFiat}
          />
          </div>
        </div>
        <div>
          <h2>Time Range</h2>
          <TimeRange
            startDate={range.startDate}
            endDate={range.endDate}
            onChange={setRange}
          />
        </div>
        
        <div>
          <h2>Analysis Method</h2>
          <AnalysisDropDown
            label="Method..."
            currency_type="fiat"
            onSelect={handleAnalysis}
          />
        </div>
        <div>
          <h2>Options</h2>
          <AnalysisDropDown
            label="Method..."
            currency_type="fiat"
            onSelect={handleAnalysis}
          />
        </div>

      </div>
    </div>
  );
};

export default App;
