import React from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Button from '../UI/Button';
import { useAudioGranulatorContext } from '../../context/AudioGranulatorContext';

/**
 * Component for toggling between standard and zen visualization modes
 */
const ZenModeToggle = () => {
  const { zenMode, toggleZenMode, audioBuffer } = useAudioGranulatorContext();
  
  return (
    <Button
      variant={zenMode ? 'primary' : 'outline'}
      disabled={!audioBuffer}
      onClick={toggleZenMode}
      className="flex items-center justify-center gap-2"
    >
      {zenMode ? <FiEyeOff /> : <FiEye />}
      <span>{zenMode ? 'Standard Mode' : 'Zen Mode'}</span>
    </Button>
  );
};

export default ZenModeToggle;