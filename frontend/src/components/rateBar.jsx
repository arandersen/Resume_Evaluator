import React from 'react';

const RateBar = ({ score }) => {
  // Ensure the score is between 0 and 100
  const validScore = Math.min(Math.max(score, 0), 100);

  return (
    <div className="w-full mt-4">
      {/* Label for ATS Score */}
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
        <span>ATS Compatibility Score:</span>
        <span>{validScore}/100</span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden border border-gray-400">
        {/* Gradient Progress Bar */}
        <div
          className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 transition-all duration-500"
          style={{ width: `${validScore}%` }}
        />
      </div>
    </div>
  );
};

export default RateBar;
