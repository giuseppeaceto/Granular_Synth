import React, { useState } from 'react';
import { FiDownload, FiSettings } from 'react-icons/fi';
import Button from '../UI/Button';
import { useAudioGranulatorContext } from '../../context/AudioGranulatorContext';

/**
 * Component for audio export options
 */
const ExportPanel = () => {
  const {
    audioBuffer,
    exportProcessedAudio,
    exportFormat,
    exportBitRate,
    updateExportFormat,
    updateExportBitRate
  } = useAudioGranulatorContext();
  
  const [showOptions, setShowOptions] = useState(false);
  const [filename, setFilename] = useState('granulated-audio');
  
  // Handle export
  const handleExport = () => {
    if (audioBuffer) {
      exportProcessedAudio(filename, exportFormat, exportBitRate);
    }
  };
  
  // Toggle options panel
  const toggleOptions = () => {
    setShowOptions(prev => !prev);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Export Audio</h3>
        <Button
          variant="secondary"
          onClick={toggleOptions}
          className="p-2"
        >
          <FiSettings />
        </Button>
      </div>
      
      {showOptions && (
        <div className="mb-4 space-y-3 bg-gray-700 p-3 rounded-md">
          {/* Filename input */}
          <div>
            <label htmlFor="filename" className="block text-sm font-medium text-gray-300 mb-1">
              Filename
            </label>
            <input
              type="text"
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Format selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Format
            </label>
            <div className="flex gap-2">
              <Button
                variant={exportFormat === 'wav' ? 'primary' : 'outline'}
                onClick={() => updateExportFormat('wav')}
                className="flex-1 py-1"
              >
                WAV
              </Button>
              <Button
                variant={exportFormat === 'mp3' ? 'primary' : 'outline'}
                onClick={() => updateExportFormat('mp3')}
                className="flex-1 py-1"
              >
                MP3
              </Button>
            </div>
          </div>
          
          {/* Bit rate selection (for MP3) */}
          {exportFormat === 'mp3' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Bit Rate
              </label>
              <div className="flex gap-2">
                {[128, 192, 256, 320].map(rate => (
                  <Button
                    key={rate}
                    variant={exportBitRate === rate ? 'primary' : 'outline'}
                    onClick={() => updateExportBitRate(rate)}
                    className="flex-1 py-1"
                  >
                    {rate}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Export button */}
      <Button
        variant="primary"
        disabled={!audioBuffer}
        onClick={handleExport}
        className="w-full flex items-center justify-center gap-2"
      >
        <FiDownload />
        <span>Export as {exportFormat.toUpperCase()}</span>
      </Button>
    </div>
  );
};

export default ExportPanel;