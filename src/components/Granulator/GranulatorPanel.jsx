import React from 'react';
import FileUploader from './FileUploader';
import Button from '../UI/Button';
import { useAudioGranulatorContext } from '../../context/AudioGranulatorContext';

/**
 * Main container component for the granulator that integrates file uploader and controls
 */
const GranulatorPanel = () => {
  // Use the audio granulator context
  const {
    audioFile,
    isLoading,
    error,
    isPlaying,
    audioBuffer,
    handleFileUpload,
    startPlayback,
    stopPlayback,
    exportProcessedAudio
  } = useAudioGranulatorContext();

  // Handle play/stop toggle
  const handlePlaybackToggle = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  // Handle export
  const handleExport = () => {
    if (audioBuffer) {
      const fileName = audioFile ? audioFile.name.split('.')[0] + '-granulated' : 'granulated-audio';
      exportProcessedAudio(fileName);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Audio Granulator</h2>
      
      {/* File uploader */}
      <FileUploader 
        onFileUpload={handleFileUpload}
        isLoading={isLoading}
        error={error}
      />
      
      {/* Playback controls */}
      <div className="flex flex-wrap gap-4 mt-6">
        <Button
          variant={isPlaying ? 'danger' : 'success'}
          disabled={!audioBuffer}
          onClick={handlePlaybackToggle}
          className="flex-1"
        >
          {isPlaying ? 'Stop' : 'Play'}
        </Button>
        
        <Button
          variant="secondary"
          disabled={!audioBuffer}
          onClick={handleExport}
          className="flex-1"
        >
          Export
        </Button>
      </div>
      
      {/* Audio information */}
      {audioFile && (
        <div className="mt-4 p-3 bg-gray-700 rounded-md">
          <p className="text-sm">
            <span className="font-medium">File:</span> {audioFile.name}
          </p>
          {audioBuffer && (
            <p className="text-sm mt-1">
              <span className="font-medium">Duration:</span> {audioBuffer.duration.toFixed(2)}s
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GranulatorPanel;