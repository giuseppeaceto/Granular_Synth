import React from 'react';

/**
 * Reusable slider component for parameter control
 * @param {Object} props - Component props
 * @param {number} props.value - Current value
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 * @param {number} props.step - Step increment
 * @param {Function} props.onChange - Change handler
 * @param {string} props.label - Slider label
 * @param {string} props.unit - Unit of measurement (optional)
 * @param {number} props.decimals - Number of decimal places to display
 */
const Slider = ({
  value,
  min = 0,
  max = 1,
  step = 0.01,
  onChange,
  label,
  unit = '',
  decimals = 2,
  className = '',
}) => {
  // Format the displayed value
  const formattedValue = typeof value === 'number' 
    ? value.toFixed(decimals) 
    : '0';

  // Handle slider change
  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  // Calculate the percentage for the gradient background
  const percentage = ((value - min) / (max - min)) * 100;
  const gradientStyle = {
    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #4b5563 ${percentage}%, #4b5563 100%)`
  };

  return (
    <div className={`${className}`}>
      {/* Label and value display */}
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
        <span className="text-sm font-mono bg-gray-700 px-2 py-1 rounded">
          {formattedValue}{unit}
        </span>
      </div>
      
      {/* Slider input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={gradientStyle}
      />
    </div>
  );
};

export default Slider;