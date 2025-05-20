import React from 'react';
import { FiShuffle } from 'react-icons/fi';
import Button from '../UI/Button';
import { useAudioGranulatorContext } from '../../context/AudioGranulatorContext';

/**
 * Component for generating random granulation presets
 */
const RandomPresetButton = () => {
  const { audioBuffer, generateRandomPreset } = useAudioGranulatorContext();
  
  // Handle random preset generation
  const handleRandomPreset = () => {
    if (audioBuffer) {
      generateRandomPreset();
    }
  };
  
  return (
    <Button
      variant="secondary"
      disabled={!audioBuffer}
      onClick={handleRandomPreset}
      className="flex items-center justify-center gap-2 w-full"
    >
      <FiShuffle />
      <span>Random Preset</span>
    </Button>
  );
};

export default RandomPresetButton;