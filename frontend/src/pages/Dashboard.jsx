import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/parse_resume/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Backend Response:', response.data);
      localStorage.setItem('resumeAnalysis', JSON.stringify(response.data));
      window.location.href = '/result';
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Failed to analyze resume. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      
  
      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center px-[5%]">
        <div className="w-full max-w-3xl item-center space-y-10">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-center">
            Is Your Resume Good Enough?<br />Get Your Free Resume Score Instantly
          </h1>
          <p className="text-gray-300 text-lg">
            Our AI-powered resume score checker helps you write the perfect resume by comparing your resume
            to the job listing you're interested in. Get expert feedback on how to improve your resume and
            show the recruiter why you're the perfect match.
          </p>
  
          {/* Upload Card */}
          <div className="bg-gray-800 p-8 rounded-2xl shadow-xl text-left space-y-6">
            <div>
              <label className="block font-semibold">Upload</label>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="mt-2 w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              />
              <p className="text-sm text-gray-400 mt-2">Drag & Drop or Choose file to upload<br />as .pdf or .docx file</p>
            </div>
  
            {file && (
              <p className="text-sm text-gray-300">
                Selected: <span className="font-medium">{file.name}</span>
              </p>
            )}
  
            <button
              onClick={handleAnalyze}
              disabled={!file}
              className={`w-full mt-2 py-3 px-4 rounded-md text-white text-lg font-medium transition-colors ${
                file
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-500 cursor-not-allowed'
              }`}
            >
              Analyze Resume
            </button>
  
            <div className="text-center text-sm text-gray-400 mt-4">or paste resume text below</div>
  
            <textarea
              rows={5}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
              placeholder="Paste your resume text here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;