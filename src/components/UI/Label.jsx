import React from 'react';

/**
 * Component for parameter labels
 * @param {Object} props - Component props
 * @param {string} props.text - Label text
 * @param {string} props.htmlFor - ID of the associated form element
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.className - Additional CSS classes
 */
const Label = ({ 
  text, 
  htmlFor, 
  required = false, 
  className = '',
  children
}) => {
  return (
    <label 
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-300 mb-1 ${className}`}
    >
      {text}
      {required && <span className="text-red-500 ml-1">*</span>}
      {children}
    </label>
  );
};

export default Label;