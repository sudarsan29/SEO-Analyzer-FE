import React, { useState } from 'react';
import axios from 'axios';

export default function SEOAnalyzer() {
  const [url, setURL] = useState('');
  const [google_api_key, setGoogle_API_Key] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAudit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/report', { url, google_api_key });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Oops... Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-green-400 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-6 text-center">
          SEO Optimization Analyzer
        </h1>
        <p className="text-Black text-center mb-6 text-sm md:text-base">
          Using Google PageSpeed Insights API for SEO audit
        </p>
        <p className="text-black mb-2 text-sm md:text-base">
          Enter Website URL to Analyze
          <input
          type="text"
          placeholder="Enter Website URL"
          className="w-full p-3 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={url}
          onChange={(e) => setURL(e.target.value)}
        />
        </p>
        <p className="text-black text-sm md:text-base">
          Google API Key(Get one from Google Cloud Console)
          <input
          type="text"
          placeholder="Google API Key (from Google Cloud Console)"
          className="w-full p-3 mt-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={google_api_key}
          onChange={(e) => setGoogle_API_Key(e.target.value)}
        />
        </p>
        <button
          onClick={handleAudit}
          disabled={loading}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-semibold transition duration-300"
        >
          {loading ? 'Running Audit...' : 'Run SEO Audit'}
        </button>

        {error && (
          <p className="mt-4 text-red-100 bg-red-500 bg-opacity-80 p-2 rounded text-sm text-center">
            Error: {error}
          </p>
        )}

        {result && (
          <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4 text-white">
            <p className="text-lg font-bold">SEO Score: {result.seoScore}</p>
            <ul className="list-disc list-inside mt-2 text-sm">
              {Object.entries(result.audits)
                .filter(([key, val]) => val.scoreDisplayMode !== 'notApplicable')
                .slice(0, 5) // limit for simplicity
                .map(([key, val]) => (
                  <li key={key}>{val.title}: {val.displayValue || val.score * 100 + '%'}</li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}