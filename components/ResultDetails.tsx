
import React from 'react';
import { TestResults, MeasurementPoint } from '../types';
import MeasurementCard from './MeasurementCard';
import BoxPlotChart from './BoxPlotChart';
import { InfoIcon } from './icons/InfoIcon';
import ServerInfoSection from './ServerInfoSection';
import NetworkQualitySection from './NetworkQualitySection';

interface ResultDetailsProps {
    results: TestResults | null;
    measurements: MeasurementPoint[];
    isFinished: boolean;
}

// Helper to format bytes into KB, MB, etc.
const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
};

// A small component for visualizing speed as a progress bar
const ProgressBar: React.FC<{ speed: number }> = ({ speed }) => {
    // Cap the visual progress at 100Mbps for a reasonable visual scale
    const maxVisualSpeed = 100; 
    const percentage = Math.min((speed / maxVisualSpeed) * 100, 100);

    return (
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div
                className="bg-vinet-red h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

const ResultDetails: React.FC<ResultDetailsProps> = ({ results, measurements, isFinished }) => {
    // Helper function to calculate average for summary
    const getAverage = (samples: number[] | undefined) => {
        if (!samples || samples.length === 0) return '0.0';
        return (samples.reduce((a, b) => a + b, 0) / samples.length).toFixed(1);
    };
    
    return (
        <>
            {isFinished && results?.details && <NetworkQualitySection details={results.details} />}

            {measurements.length > 0 && (
                <div className="my-12 text-left">
                    <h2 className="text-2xl font-bold mb-4 text-vinet-gray-dark text-center flex items-center justify-center">
                        Detailed Measurements
                        <InfoIcon className="w-5 h-5 ml-2 text-vinet-gray-light" />
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {measurements.map((m) => (
                            <div key={m.fileSize} className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm animate-fade-in">
                                <h3 className="font-bold text-md text-vinet-gray-dark mb-3 text-center border-b border-gray-300 pb-2">{formatFileSize(m.fileSize)} Test</h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-vinet-gray-light">Download</span>
                                            <span className="font-bold text-vinet-gray-dark">{m.downloadSpeed.toFixed(2)} <span className="text-xs text-vinet-gray-light">Mbps</span></span>
                                        </div>
                                        <ProgressBar speed={m.downloadSpeed} />
                                        <div className="text-xs text-vinet-gray-light text-right">in {(m.downloadDuration ?? 0).toFixed(2)}s</div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-vinet-gray-light">Upload</span>
                                            <span className="font-bold text-vinet-gray-dark">{m.uploadSpeed.toFixed(2)} <span className="text-xs text-vinet-gray-light">Mbps</span></span>
                                        </div>
                                         <ProgressBar speed={m.uploadSpeed} />
                                         <div className="text-xs text-vinet-gray-light text-right">in {(m.uploadDuration ?? 0).toFixed(2)}s</div>
                                    </div>
                                    <div className="flex justify-between items-baseline pt-2">
                                        <span className="text-vinet-gray-light">Ping</span>
                                        <span className="font-bold text-vinet-gray-dark">{m.ping.toFixed(0)} <span className="text-xs text-vinet-gray-light">ms</span></span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-vinet-gray-light">Jitter</span>
                                        <span className="font-bold text-vinet-gray-dark">{m.jitter.toFixed(0)} <span className="text-xs text-vinet-gray-light">ms</span></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isFinished && results?.details && <ServerInfoSection details={results.details} />}
            
            {isFinished && results?.details && (
                 <div className="my-12 text-left">
                    <h2 className="text-2xl font-bold mb-4 text-vinet-gray-dark text-center flex items-center justify-center">
                        Latency Measurements
                        <InfoIcon className="w-5 h-5 ml-2 text-vinet-gray-light" />
                    </h2>
                    <div className="space-y-4">
                        <MeasurementCard 
                            title="Unloaded latency" 
                            summary={`Avg: ${getAverage(results.details.unloadedLatencySamples)} ms`}
                        >
                            <BoxPlotChart samples={results.details.unloadedLatencySamples} />
                        </MeasurementCard>
                         <MeasurementCard 
                            title="Latency during download" 
                            summary={`Avg: ${getAverage(results.details.downloadLatencySamples)} ms`}
                        >
                            <BoxPlotChart samples={results.details.downloadLatencySamples} />
                        </MeasurementCard>
                         <MeasurementCard 
                            title="Latency during upload" 
                            summary={`Avg: ${getAverage(results.details.uploadLatencySamples)} ms`}
                        >
                             <BoxPlotChart samples={results.details.uploadLatencySamples} />
                        </MeasurementCard>
                    </div>
                 </div>
            )}
        </>
    );
};

export default ResultDetails;
