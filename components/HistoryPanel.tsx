
import React, { useState } from 'react';
import { TestResults } from '../types';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { LatencyIcon } from './icons/LatencyIcon';
import ResultDetails from './ResultDetails';

interface HistoryPanelProps {
    history: TestResults[];
    onClearHistory: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClearHistory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (history.length === 0) {
        return null;
    }

    const formatDate = (timestamp: number) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).format(new Date(timestamp));
    };

    const handleToggleExpand = (id: string) => {
        setExpandedId(prevId => prevId === id ? null : id);
    };

    return (
        <div className="w-full max-w-4xl mx-auto my-8">
            <div className="border border-gray-200 rounded-lg">
                <button
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-controls="history-content"
                >
                    <h2 className="text-xl font-bold text-vinet-gray-dark">Test History</h2>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 text-vinet-gray-light transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
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
                    <div id="history-content" className="border-t border-gray-200 animate-fade-in">
                        <ul className="space-y-2 p-2">
                            {history.map(result => (
                                <li key={result.id} className="bg-gray-50 rounded-md border border-gray-200">
                                    <button 
                                        className="w-full p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-left transition-colors duration-150 hover:bg-gray-100"
                                        onClick={() => handleToggleExpand(result.id)}
                                        aria-expanded={expandedId === result.id}
                                    >
                                        <div className="text-sm text-vinet-gray-dark mb-2 sm:mb-0 font-medium">
                                            {formatDate(result.timestamp)}
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm">
                                            <div className="flex items-center" title={`Download: ${result.download.toFixed(2)} Mbps`}>
                                                <ArrowDownIcon className="w-4 h-4 text-vinet-red" />
                                                <span className="ml-1.5 font-bold text-vinet-gray-dark">{result.download.toFixed(2)}</span>
                                                <span className="ml-1 text-vinet-gray-light">Mbps</span>
                                            </div>
                                            <div className="flex items-center" title={`Upload: ${result.upload.toFixed(2)} Mbps`}>
                                                <ArrowUpIcon className="w-4 h-4 text-vinet-red" />
                                                <span className="ml-1.5 font-bold text-vinet-gray-dark">{result.upload.toFixed(2)}</span>
                                                <span className="ml-1 text-vinet-gray-light">Mbps</span>
                                            </div>
                                            <div className="flex items-center" title={`Ping: ${result.latency.toFixed(0)} ms`}>
                                                <LatencyIcon className="w-4 h-4 text-vinet-red" />
                                                <span className="ml-1.5 font-bold text-vinet-gray-dark">{result.latency.toFixed(0)}</span>
                                                <span className="ml-1 text-vinet-gray-light">ms</span>
                                            </div>
                                        </div>
                                    </button>
                                    {expandedId === result.id && (
                                        <div className="p-4 border-t border-gray-200">
                                             <ResultDetails 
                                                results={result} 
                                                measurements={result.details?.measurements || []} 
                                                isFinished={true} 
                                            />
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div className="p-4 pt-2 text-right">
                            <button
                                onClick={onClearHistory}
                                className="text-sm text-vinet-red hover:underline"
                            >
                                Clear History
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPanel;
