import React, { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const SmartRecommendations = ({ peptide, metal, tool }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (peptide && metal && tool) {
      fetchRecommendations();
    }
  }, [peptide, metal, tool]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/recommendations/smart`, {
        peptide,
        metal,
        tool,
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
    setLoading(false);
  };

  if (!peptide || !metal || !tool) return null;
  if (loading) {
    return (
      <div className="border border-border bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md" data-testid="smart-recommendations-loading">
        <p className="text-sm text-blue-800 dark:text-blue-400">Loading smart recommendations...</p>
      </div>
    );
  }

  if (!recommendations) return null;

  return (
    <div className="border border-border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg" data-testid="smart-recommendations">
      <div className="flex items-start gap-3 mb-4">
        <Lightbulb size={24} className="text-blue-600 dark:text-blue-400 mt-1" />
        <div className="flex-1">
          <h4 className="font-manrope font-bold text-lg text-blue-900 dark:text-blue-100 mb-2">
            Smart Recommendations
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
            Based on {recommendations.similar_runs} similar simulations in our database
          </p>
        </div>
      </div>

      {recommendations.confidence_level && (
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-green-600" />
          <span className="text-sm font-medium text-green-800 dark:text-green-400">
            Confidence: {recommendations.confidence_level}%
          </span>
        </div>
      )}

      <div className="space-y-3">
        {recommendations.parameters && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
            <p className="text-xs font-mono text-muted-foreground mb-2">RECOMMENDED PARAMETERS</p>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(recommendations.parameters).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs text-muted-foreground">{key}</p>
                  <p className="font-mono font-semibold text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendations.expected_results && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
            <p className="text-xs font-mono text-muted-foreground mb-2">EXPECTED RESULTS</p>
            <div className="space-y-1 text-sm">
              {Object.entries(recommendations.expected_results).map(([key, value]) => (
                <p key={key} className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{key}:</span> {value}
                </p>
              ))}
            </div>
          </div>
        )}

        {recommendations.notes && (
          <div className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{recommendations.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartRecommendations;