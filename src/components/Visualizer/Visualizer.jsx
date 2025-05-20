import React from 'react';
import { useAudioGranulatorContext } from '../../context/AudioGranulatorContext';
import WaveformVisualizer from './WaveformVisualizer';
import ParticleVisualizer from './ParticleVisualizer';
import ZenModeToggle from './ZenModeToggle';

/**
 * Component for audio visualization with mode switching
 */
const Visualizer = () => {
  const { zenMode } = useAudioGranulatorContext();
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">
          {zenMode ? 'Particle Visualization' : 'Waveform'}
        </h3>
        <ZenModeToggle />
      </div>
      
      <div className="bg-gray-900 rounded-lg p-2 w-full h-64 relative">
        {zenMode ? <ParticleVisualizer /> : <WaveformVisualizer />}
      </div>
    </div>
  );
};

export default Visualizer;