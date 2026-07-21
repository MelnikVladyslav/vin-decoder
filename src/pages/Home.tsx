import React, { useState, useEffect } from 'react';

interface DecodeResult {
  Variable: string;
  Value: string;
  // Add more if needed
}

interface HistoryItem {
  vin: string;
  results: DecodeResult[];
  message?: string;
}

const Home: React.FC = () => {
  const [vin, setVin] = useState('');
  const [results, setResults] = useState<DecodeResult[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiMessage, setApiMessage] = useState('');

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('vinHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('vinHistory', JSON.stringify(history));
  }, [history]);

  const validateVIN = (vinCode: string): string => {
    if (!vinCode.trim()) return 'VIN code cannot be empty';
    if (vinCode.length > 17) return 'VIN code must be 17 characters or less';
    const validChars = /^[A-HJ-NPR-Z0-9]+$/i;
    if (!validChars.test(vinCode)) return 'VIN code contains invalid characters (only letters A-H,J-N,P-R,Z and digits)';
    return '';
  };

  const decodeVIN = async (vinCode: string) => {
    const validationError = validateVIN(vinCode);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setApiMessage('');

    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vinCode}?format=json`);
      const data = await response.json();

      if (data.Message) {
        setApiMessage(data.Message);
      }

      if (data.Results && Array.isArray(data.Results)) {
        const filteredResults = data.Results.filter((item: any) => item.Value && item.Value !== '' && item.Value !== 'null' && item.Value !== 'N/A');
        setResults(filteredResults);

        // Add to history (keep only last 3)
        const newHistoryItem: HistoryItem = {
          vin: vinCode.toUpperCase(),
          results: filteredResults,
          message: data.Message
        };

        const updatedHistory = [newHistoryItem, ...history.filter(h => h.vin !== vinCode.toUpperCase())].slice(0, 3);
        setHistory(updatedHistory);
      } else {
        setError('No results found');
      }
    } catch (err) {
      setError('Failed to decode VIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vin.trim()) {
      decodeVIN(vin);
    }
  };

  const loadFromHistory = (historyItem: HistoryItem) => {
    setVin(historyItem.vin);
    setResults(historyItem.results);
    if (historyItem.message) setApiMessage(historyItem.message);
    setError('');
  };

  return (
    <div className="home">
      <h2>VIN Decoder</h2>
      
      <form onSubmit={handleSubmit} className="vin-form">
        <div className="input-group">
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="Enter VIN code (e.g. 1FTFW1CT5DFC10312)"
            maxLength={17}
            className="vin-input"
          />
          <button type="submit" disabled={loading} className="decode-btn">
            {loading ? 'Decoding...' : 'Decode VIN'}
          </button>
        </div>
        
        {error && <p className="error">{error}</p>}
        {apiMessage && <p className="api-message">{apiMessage}</p>}
      </form>

      {/* History */}
      {history.length > 0 && (
        <div className="history">
          <h3>Last Decoded VINs</h3>
          <ul>
            {history.map((item, index) => (
              <li key={index}>
                <button onClick={() => loadFromHistory(item)} className="history-btn">
                  {item.vin}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="results">
          <h3>Decoding Results</h3>
          <table>
            <thead>
              <tr>
                <th>Variable</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.Variable}</td>
                  <td>{result.Value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
