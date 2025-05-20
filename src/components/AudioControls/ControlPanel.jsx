import React from 'react';
import Slider from './Slider';
import Knob from '../UI/Knob';
import { useAudioGranulatorContext } from '../../context/AudioGranulatorContext';

/**
 * Container component for all audio parameter controls
 */
const ControlPanel = () => {
  const {
    // Parameter values
    grainSize,
    density,
    pitchShift,
    playbackRate,
    playbackPosition,
    positionVariation,
    attackTime,
    releaseTime,
    
    // Parameter update methods
    updateGrainSize,
    updateDensity,
    updatePitchShift,
    updatePlaybackRate,
    updatePlaybackPosition,
    updatePositionVariation,
    updateAttackTime,
    updateReleaseTime,
  } = useAudioGranulatorContext();

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-medium mb-4">Granulation Controls</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Sliders */}
        <div className="space-y-6">
          <Slider
            label="Grain Size"
            value={grainSize}
            min={0.01}
            max={1}
            step={0.01}
            onChange={updateGrainSize}
            unit="s"
          />
          
          <Slider
            label="Grain Density"
            value={density}
            min={1}
            max={100}
            step={1}
            onChange={updateDensity}
            unit=" grains/s"
            decimals={0}
          />
          
          <Slider
            label="Pitch Shift"
            value={pitchShift}
            min={-12}
            max={12}
            step={1}
            onChange={updatePitchShift}
            unit=" semitones"
            decimals={0}
          />
          
          <Slider
            label="Playback Rate"
            value={playbackRate}
            min={0.25}
            max={4}
            step={0.05}
            onChange={updatePlaybackRate}
            unit="x"
            decimals={2}
          />
        </div>
        
        {/* Right column - More sliders and knobs */}
        <div className="space-y-6">
          <Slider
            label="Playback Position"
            value={playbackPosition}
            min={0}
            max={1}
            step={0.01}
            onChange={updatePlaybackPosition}
            decimals={2}
          />
          
          <Slider
            label="Position Variation"
            value={positionVariation}
            min={0}
            max={1}
            step={0.01}
            onChange={updatePositionVariation}
            decimals={2}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg flex flex-col items-center">
              <Knob
                label="Attack"
                value={attackTime}
                min={0.001}
                max={0.5}
                step={0.001}
                onChange={updateAttackTime}
                size="small"
              />
              <span className="mt-1 text-xs text-gray-400">{attackTime.toFixed(3)}s</span>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg flex flex-col items-center">
              <Knob
                label="Release"
                value={releaseTime}
                min={0.001}
                max={0.5}
                step={0.001}
                onChange={updateReleaseTime}
                size="small"
              />
              <span className="mt-1 text-xs text-gray-400">{releaseTime.toFixed(3)}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;