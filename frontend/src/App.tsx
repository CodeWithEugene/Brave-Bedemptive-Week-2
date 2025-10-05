import { useState } from 'react';
import './App.css';

function App() {
  const [latency, setLatency] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [requestCount, setRequestCount] = useState<number>(100);
  const [result, setResult] = useState<{ data: string; processedAt: string } | null>(null);

  const BASE_URL = 'http://localhost:3000'; // Your backend URL

  const sendRequests = async () => {
    setLoading(true);
    setLatency(null);
    setResult(null);
    const startTime = Date.now();

    const promises = Array.from({ length: requestCount }).map(async (_, index) => {
      try {
        const response = await fetch(`${BASE_URL}/api/process-data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: `request-${index}` }),
        });
        return response.json();
      } catch (error) {
        console.error(`Request ${index} failed:`, error);
        return null;
      }
    });

    const responses = await Promise.all(promises);
    const endTime = Date.now();
    const avgLatency = (endTime - startTime) / requestCount;

    setLatency(avgLatency);
    // Display the result from one of the successful requests, if any
    const firstSuccessfulResult = responses.find(r => r !== null);
    if (firstSuccessfulResult) {
      setResult(firstSuccessfulResult);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Latency Detective Frontend</h1>
        <p>Simulate {requestCount} concurrent requests to the backend.</p>

        <div className="controls">
            <label>
                Number of Requests:
                <input
                    type="number"
                    value={requestCount}
                    onChange={(e) => setRequestCount(Math.max(1, parseInt(e.target.value)))}
                    min="1"
                    style={{ marginLeft: '10px' }}
                />
            </label>
        </div>
        <button onClick={sendRequests} disabled={loading} style={{ margin: '20px' }}>
          {loading ? 'Sending requests...' : 'Send Concurrent Requests'}
        </button>

        {loading && <p>Loading...</p>}

        {latency !== null && (
          <div className="results">
            <h2>Results:</h2>
            <p>Average Request Latency: **{latency.toFixed(2)} ms**</p>
            {result && (
              <div>
                <h3>Example Response (first successful request):</h3>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;