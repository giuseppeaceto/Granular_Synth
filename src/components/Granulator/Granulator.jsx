import { useState, useEffect } from 'react';
import useAudioGranulator from '../../hooks/useAudioGranulator';

/**
 * Main Granulator component that handles audio file upload and granular synthesis
 */
const Granulator = () => {
  const [audioFile, setAudioFile] = useState(null);
  
  const {
    isLoaded,
    isPlaying,
    grainSize,
    overlap,
    pitch,
    playbackRate,
    loadAudio,
    togglePlay,
    updateParams
  } = useAudioGranulator();
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      loadAudio(file);
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Audio Granulator</h2>
        
        {/* File upload section */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">
            Upload Audio File
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>
        
        {/* Placeholder for controls */}
        <div className="mb-4">
          <p className="text-gray-400">
            Granulation controls will be implemented here
          </p>
        </div>
        
        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          disabled={!isLoaded}
          className={`px-4 py-2 rounded-md ${
            isLoaded ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
};

export default Granulator;