import React, { useState, useRef, useEffect } from 'react';

/**
 * Rotary knob component for audio parameter control
 * @param {Object} props - Component props
 * @param {number} props.value - Current value
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 * @param {number} props.step - Step increment
 * @param {Function} props.onChange - Change handler
 * @param {string} props.label - Knob label
 */
const Knob = ({
  value,
  min = 0,
  max = 1,
  step = 0.01,
  onChange,
  label,
  className = '',
  size = 'medium',
}) => {
  const knobRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(value);
  
  // Calculate rotation angle based on value
  const getRotationAngle = (val) => {
    const range = max - min;
    const percentage = (val - min) / range;
    // Map from 0-1 to -150 to 150 degrees (300 degree rotation)
    return -150 + percentage * 300;
  };
  
  const rotationAngle = getRotationAngle(value);
  
  // Handle mouse/touch events for dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartValue(value);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    // Calculate value change based on vertical movement
    // Moving up increases value, moving down decreases
    const sensitivity = 0.5; // Adjust for sensitivity
    const deltaY = startY - e.clientY;
    const deltaValue = (deltaY * sensitivity * (max - min)) / 100;
    
    // Calculate new value and clamp to min/max
    let newValue = startValue + deltaValue;
    newValue = Math.max(min, Math.min(max, newValue));
    
    // Round to nearest step
    newValue = Math.round(newValue / step) * step;
    
    // Update if changed
    if (newValue !== value) {
      onChange(newValue);
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  // Size classes
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div 
        ref={knobRef}
        className={`${sizeClasses[size] || sizeClasses.medium} relative cursor-pointer`}
        onMouseDown={handleMouseDown}
      >
        {/* Knob background */}
        <div className="absolute inset-0 rounded-full bg-gray-700 border-2 border-gray-600"></div>
        
        {/* Knob indicator */}
        <div 
          className="absolute top-1/2 left-1/2 w-1 h-1/3 bg-blue-400 rounded-full origin-bottom"
          style={{ 
            transform: `translate(-50%, -100%) rotate(${rotationAngle}deg)`,
          }}
        ></div>
        
        {/* Value indicator */}
        <div className="absolute inset-0 flex items-center justify-center text-sm font-mono">
          {value.toFixed(2)}
        </div>
      </div>
      
      {label && (
        <div className="mt-2 text-xs text-center">{label}</div>
      )}
    </div>
  );
};

export default Knob;