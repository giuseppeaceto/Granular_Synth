import { useState } from 'react';

/**
 * Component for audio granulation controls (knobs, sliders)
 * @param {Object} props - Component props
 * @param {Object} props.params - Current parameter values
 * @param {Function} props.onChange - Callback for parameter changes
 */
const AudioControls = ({ params, onChange }) => {
  const handleChange = (paramName, value) => {
    onChange({ [paramName]: value });
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Grain Size Control */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">
          Grain Size
        </label>
        <input
          type="range"
          min="0.01"
          max="1"
          step="0.01"
          value={params.grainSize || 0.1}
          onChange={(e) => handleChange('grainSize', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-center mt-1 text-sm">
          {params.grainSize?.toFixed(2) || 0.1}s
        </div>
      </div>
      
      {/* Overlap Control */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">
          Overlap
        </label>
        <input
          type="range"
          min="0"
          max="0.9"
          step="0.01"
          value={params.overlap || 0.1}
          onChange={(e) => handleChange('overlap', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-center mt-1 text-sm">
          {params.overlap?.toFixed(2) || 0.1}
        </div>
      </div>
      
      {/* Pitch Control */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">
          Pitch
        </label>
        <input
          type="range"
          min="-12"
          max="12"
          step="1"
          value={params.pitch || 0}
          onChange={(e) => handleChange('pitch', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-center mt-1 text-sm">
          {params.pitch || 0} semitones
        </div>
      </div>
      
      {/* Playback Rate Control */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">
          Playback Rate
        </label>
        <input
          type="range"
          min="0.1"
          max="4"
          step="0.1"
          value={params.playbackRate || 1}
          onChange={(e) => handleChange('playbackRate', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-center mt-1 text-sm">
          {params.playbackRate?.toFixed(1) || 1.0}x
        </div>
      </div>
    </div>
  );
};

export default AudioControls;