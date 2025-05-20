import React from 'react';
import { FiPlay, FiStopCircle, FiDownload, FiShuffle } from 'react-icons/fi';
import Button from '../UI/Button';
import { useAudioGranulatorContext } from '../../context/AudioGranulatorContext';
import RandomPresetButton from './RandomPresetButton';

/**
 * Component with play/stop buttons and transport controls
 */
const PlaybackControls = () => {
  const {
    isPlaying,
    audioBuffer,
    startPlayback,
    stopPlayback
  } = useAudioGranulatorContext();

  const hasAudio = !!audioBuffer;

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex flex-wrap gap-3 justify-center">
        {/* Play button */}
        <Button
          variant="success"
          disabled={!hasAudio || isPlaying}
          onClick={startPlayback}
          className="flex items-center gap-2"
        >
          <FiPlay />
          <span>Play</span>
        </Button>
        
        {/* Stop button */}
        <Button
          variant="danger"
          disabled={!hasAudio || !isPlaying}
          onClick={stopPlayback}
          className="flex items-center gap-2"
        >
          <FiStopCircle />
          <span>Stop</span>
        </Button>
        
        {/* Random Preset button */}
        <RandomPresetButton />
      </div>
      
      {/* Playback status */}
      <div className="mt-3 text-center">
        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
        <span className="text-sm text-gray-300">
          {isPlaying ? 'Playing' : hasAudio ? 'Ready' : 'No audio loaded'}
        </span>
      </div>
    </div>
  );
};

export default PlaybackControls;