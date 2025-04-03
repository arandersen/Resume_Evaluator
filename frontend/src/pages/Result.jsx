// Result.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RateBar from '../components/rateBar';


const Result = () => {
  const [resumeData, setResumeData] = useState(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get data from localStorage
    const data = localStorage.getItem('resumeAnalysis');
    if (data) {
      const parsedData = JSON.parse(data);
      setResumeData(parsedData);

      // Try to extract the ATS score from the AI analysis text
      // This looks for a line like: "ATS Compatibility Score: 65/100"
      const scoreRegex = /ATS Compatibility Score:\s*(\d+)\s*\/\s*(\d+)/;
      const match = parsedData.ai_analysis.match(scoreRegex);
      if (match) {
        setScore(parseInt(match[1], 10));
      }
    }
    setIsLoading(false);
  }, []);

  const renderSuggestions = (analysis) => {
    // Split the analysis into sections by finding lines that end with ":"
    const lines = analysis.split('\n');
    let sections = [];
    let currentSection = { title: '', content: [] };
    
    lines.forEach(line => {
      if (line.trim().endsWith(':')) {
        if (currentSection.title) {
          sections.push({...currentSection});
        }
        currentSection = { title: line.trim(), content: [] };
      } else if (line.trim() && currentSection.title) {
        currentSection.content.push(line.trim());
      }
    });
    
    if (currentSection.title && currentSection.content.length > 0) {
      sections.push(currentSection);
    }
    
    if (sections.length === 0) {
      return <p className="whitespace-pre-line">{analysis}</p>;
    }
    
    return sections.map((section, index) => (
      <div key={index} className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="font-bold text-lg text-blue-800 mb-2">{section.title}</h3>
        <ul className="space-y-2">
          {section.content.map((item, i) => (
            <li key={i} className="flex items-start">
              <span className="mr-2 mt-1 text-blue-600">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading resume analysis...</p>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">No Resume Data Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any resume analysis data. Please upload a resume first.
          </p>
          <Link 
            to="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
          >
            Return to Upload
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Resume Analysis: {resumeData.filename || 'Your Resume'}
          </h1>
          <Link 
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Analyze New Resume
          </Link>
        </div>

        {/* Score overview */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">ATS Compatibility Score</h2>
          <div className="max-w-xl mx-auto">
            <RateBar score={score} />
            <p className="mt-4 text-gray-600 text-center">
              {score >= 80 
                ? 'Excellent! Your resume is highly compatible with ATS systems.' 
                : score >= 60 
                  ? 'Good job! Your resume is mostly compatible, but has some room for improvement.' 
                  : 'Your resume needs improvement to better match ATS requirements.'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Extracted Sections */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">Resume Sections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(resumeData.sections).map(([key, value]) => (
                  <div key={key} className="p-4 bg-gray-50 rounded-md">
                    <h3 className="font-bold text-blue-800 capitalize mb-2">{key}</h3>
                    <div className="text-sm text-gray-700 whitespace-pre-line overflow-auto max-h-48">
                      {value || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Resume Preview */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Resume Preview</h2>
              <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
                <pre className="text-sm text-gray-700 whitespace-pre-line">
                  {resumeData.preview_text}
                </pre>
              </div>
            </div>
          </div>
          
          {/* Right Column - Suggestions */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Improvement Suggestions</h2>
              <div className="overflow-auto max-h-[calc(100vh-250px)]">
                {renderSuggestions(resumeData.ai_analysis)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
