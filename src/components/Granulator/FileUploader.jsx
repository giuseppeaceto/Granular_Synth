import React, { useState, useRef } from 'react';
import { FiUpload } from 'react-icons/fi';

/**
 * Component for handling audio file uploads with drag-and-drop functionality
 * @param {Object} props - Component props
 * @param {Function} props.onFileUpload - Callback when file is uploaded
 * @param {boolean} props.isLoading - Whether a file is currently loading
 * @param {string} props.error - Error message if upload failed
 */
const FileUploader = ({ onFileUpload, isLoading, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  // Process the selected file
  const processFile = (file) => {
    // Check if file is audio
    if (!file.type.startsWith('audio/')) {
      alert('Please upload an audio file');
      return;
    }
    
    setFileName(file.name);
    onFileUpload(file);
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">
        Upload Audio File
      </label>
      
      {/* Drag and drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
        
        <p className="mt-2 text-sm text-gray-300">
          {fileName ? (
            <>Selected file: <span className="font-medium">{fileName}</span></>
          ) : (
            <>
              <span className="font-medium">Click to upload</span> or drag and drop
              <br />
              WAV, MP3, OGG, or FLAC (max 10MB)
            </>
          )}
        </p>
        
        {isLoading && (
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full w-1/2 animate-pulse"></div>
            </div>
            <p className="mt-2 text-sm text-gray-400">Loading audio file...</p>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FileUploader;