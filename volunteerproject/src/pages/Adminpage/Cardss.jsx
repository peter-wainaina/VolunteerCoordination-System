import React from 'react';

export function Card({ className = '', children }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md mb-4 ${className}`}>
      {children}
    </div>
  );
}