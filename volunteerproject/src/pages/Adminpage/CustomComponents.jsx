import React, { useState, useRef, useEffect } from 'react';

export const Button = ({ children, className = '', variant = 'default', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors duration-200';
  const variants = {
    default: 'bg-primary-500 text-white hover:bg-primary-600',
    outline: 'border border-gray-300 hover:bg-gray-50',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export const Avatar = ({ src, alt, fallback }) => (
  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-600 font-bold">
        {fallback}
      </div>
    )}
  </div>
);

export const Popover = ({ trigger, content, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && <div className="absolute right-0 mt-2 z-10">{content}</div>}
    </div>
  );
};

export const PopoverTrigger = ({ children }) => children;
export const PopoverContent = ({ children, className = '' }) => (
  <div className={`bg-white rounded-md shadow-lg py-1 ${className}`}>{children}</div>
);