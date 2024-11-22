import React, { useState, useRef, useEffect } from 'react';

export const Popover = ({ trigger, content, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener only when the popover is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      // Clean up event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute right-0 mt-2 z-10">
          {content}
        </div>
      )}
    </div>
  );
};

export const PopoverTrigger = ({ children }) => children;
export const PopoverContent = ({ children, className = '' }) => (
  <div className={`bg-white rounded-md shadow-lg py-1 ${className}`}>{children}</div>
);
