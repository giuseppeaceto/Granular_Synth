import React from 'react';

/**
 * Container component for grouping related controls
 * @param {Object} props - Component props
 * @param {string} props.title - Panel title
 * @param {React.ReactNode} props.children - Panel content
 * @param {string} props.className - Additional CSS classes
 */
const Panel = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 shadow-lg ${className}`}>
      {title && (
        <h3 className="text-lg font-medium mb-3 pb-2 border-b border-gray-700">
          {title}
        </h3>
      )}
      <div>
        {children}
      </div>
    </div>
  );
};

export default Panel;