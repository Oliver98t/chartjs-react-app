import React, { useState, useEffect } from 'react';
import CurrencyDropDown from './CurrencyDropDown.jsx';
import AnalysisDropDown from './AnalysisDropDown.jsx';
import NumberChart from './NumberChart.jsx';
import TimeRange from './TimeRange.jsx';
import OptionDropDown from './OptionDropDown.jsx';
import './CombinedChart.css';



const options = {
  default:          { data: [null],
                      urlToDisp_handler: null, 
                      dispToUrl_handler: null},

  moving_average:   { data: ['day_ma=20','day_ma=10','day_ma=5'], 
                      urlToDisp_handler: urlToDispMaHandler, 
                      dispToUrl_handler: dispToUrlMaHandler},

  market_sentiment: { data: ['Twitter', 'Reddit', 'Facebook'], 
                      urlToDisp_handler: null, 
                      dispToUrl_handler: null},
  
  RSI:              { data: ['none'], 
                      urlToDisp_handler: null, 
                      dispToUrl_handler: null},
}

function urlToDispMaHandler(url)
{
  const args = url.split('=')
  return {interval: args[0], amount: args[1]};
}

function dispToUrlMaHandler(disp)
{
  const [value, unit] = disp.split(" ");
  return `${unit.slice(0, -1)}_ma=${value}`;
}

function getDaysAgo(x) {
  const date = new Date();
  date.setMonth(date.getMonth() - x);
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const CombinedChart = () => {
  const [crypto, setCrypto] = useState('');
  const [fiat, setFiat] = useState('');
  const [analysis, setAnalysis] = useState('default');
  const [option, setOption] = useState('');
  const [range, setRange] = useState({
    startDate: getDaysAgo(1),
    endDate: getDaysAgo(0),
  });
  const [requests, setRequests] = useState([
    { endPoint: 'pair_data', option: null },

  ]);
  
  useEffect(() => {
    if (option && analysis) {
      const exists = requests.some(
        req => req.endPoint === analysis && req.option === option
      );

      if (!exists) {
        setRequests(prev => [
          ...prev,
          { endPoint: analysis, option: option },
        ]);
      }
    }
  }, [option, analysis]);

  const handleCrypto = (value) => {
    setCrypto(value);
  };

  const handleFiat = (value) => {
    setFiat(value);
  };

  const handleAnalysis = (value) => {
    setAnalysis(value);
  };

  const handleOption = (value) => {
    // convert back to parameter to be inserted into URL slug
    
    value = options[analysis].dispToUrl_handler(value);
    console.log(value);
    setOption(value);
    // TO DO - correct option passed into the http GET
  };

  const ticker = crypto && fiat ? `${crypto}/${fiat}` : 'placeholder';
  

  return (
    <div>

      <div className="input-row">
        <NumberChart
          requests={requests}
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
            onSelect={handleAnalysis}
          />
        </div>
        <div>
          <h2>Options</h2>
          <OptionDropDown
            label="Method..."
            options={options[analysis]}
            onSelect={handleOption}
          />
        </div>

      </div>
    </div>
  );
};

export default CombinedChart;
