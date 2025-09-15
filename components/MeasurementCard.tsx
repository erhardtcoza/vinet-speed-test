
import React, { useState } from 'react';

interface MeasurementCardProps {
    title: string;
    summary: string;
    children: React.ReactNode;
}

const MeasurementCard: React.FC<MeasurementCardProps> = ({ title, summary, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg">
            <button
                className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div>
                    <h3 className="font-bold text-vinet-gray-dark">{title}</h3>
                    <p className="text-sm text-vinet-gray-light">{summary}</p>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-vinet-gray-light transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-200">
                    {children}
                </div>
            )}
        </div>
    );
};

export default MeasurementCard;
