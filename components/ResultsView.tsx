

import React from 'react';
import { TestResults, MeasurementPoint } from '../types';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { LatencyIcon } from './icons/LatencyIcon';
import { JitterIcon } from './icons/JitterIcon';
import ResultDetails from './ResultDetails';

interface ResultsViewProps {
    results: TestResults | null;
    measurements: MeasurementPoint[];
    onRetest: () => void;
    isFinished: boolean;
}

const ResultDisplay: React.FC<{ icon: React.ReactNode; label: string; value: string; unit: string; }> = ({ icon, label, value, unit }) => (
    <div className="text-center">
        <div className="flex items-center justify-center text-vinet-gray-light">
            {icon}
            <span className="ml-2 uppercase font-bold text-sm">{label}</span>
        </div>
        <div className="mt-2">
            <span className="text-5xl font-bold text-vinet-gray-dark">{value}</span>
            <span className="text-xl text-vinet-gray-light ml-2">{unit}</span>
        </div>
    </div>
);

const ResultsView: React.FC<ResultsViewProps> = ({ results, measurements, onRetest, isFinished }) => {
    if (!results && measurements.length === 0 && !isFinished) {
        return null; // Don't render anything until there's some data
    }

    return (
        <div className="w-full max-w-4xl mx-auto text-center p-4 sm:p-8 bg-white rounded-lg shadow-xl mb-8">
            {isFinished && (
                 <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-vinet-gray-dark">Test Results</h1>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4 mb-12">
                <ResultDisplay
                    icon={<ArrowDownIcon className="w-6 h-6" />}
                    label="Download"
                    value={isFinished && results ? results.download.toFixed(2) : '-.--'}
                    unit="Mbps"
                />
                <ResultDisplay
                    icon={<ArrowUpIcon className="w-6 h-6" />}
                    label="Upload"
                    value={isFinished && results ? results.upload.toFixed(2) : '-.--'}
                    unit="Mbps"
                />
                <ResultDisplay
                    icon={<LatencyIcon className="w-6 h-6" />}
                    label="Ping"
                    value={isFinished && results ? results.latency.toFixed(0) : '-'}
                    unit="ms"
                />
                <ResultDisplay
                    icon={<JitterIcon className="w-6 h-6" />}
                    label="Jitter"
                    value={isFinished && results ? results.jitter.toFixed(0) : '-'}
                    unit="ms"
                />
            </div>
            
            {/* Render initial measurements as they come in, then the full details when finished */}
            {(measurements.length > 0 || (isFinished && results)) && (
                <ResultDetails 
                    results={results} 
                    measurements={measurements} 
                    isFinished={isFinished} 
                />
            )}

            {isFinished && (
                <button
                    onClick={onRetest}
                    className="mt-8 px-8 py-3 bg-vinet-red text-white font-bold rounded-full text-lg transition-transform hover:scale-105"
                    aria-label="Run speed test again"
                >
                    Test Again
                </button>
            )}
        </div>
    );
};

export default ResultsView;