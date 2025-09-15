import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="tooltip-container relative inline-block">
      {children}
      <span className="tooltip-text absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-800 text-white text-center text-xs rounded py-1.5 px-3 opacity-0 transition-opacity duration-300 pointer-events-none invisible z-10">
        {text}
      </span>
    </div>
  );
};

export default Tooltip;