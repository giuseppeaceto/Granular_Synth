import React, { createContext, useContext } from 'react';
import useAudioGranulator from '../hooks/useAudioGranulator';

// Create context
const AudioGranulatorContext = createContext(null);

/**
 * Provider component for audio granulator context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AudioGranulatorProvider = ({ children }) => {
  const granulatorHook = useAudioGranulator();
  
  return (
    <AudioGranulatorContext.Provider value={granulatorHook}>
      {children}
    </AudioGranulatorContext.Provider>
  );
};

/**
 * Custom hook to use the audio granulator context
 * @returns {Object} The audio granulator hook
 */
export const useAudioGranulatorContext = () => {
  const context = useContext(AudioGranulatorContext);
  
  if (context === null) {
    throw new Error('useAudioGranulatorContext must be used within an AudioGranulatorProvider');
  }
  
  return context;
};