
import React from 'react';
import { SpeedTestDetails } from '../types';
import { InfoIcon } from './icons/InfoIcon';

interface NetworkQualitySectionProps {
    details: SpeedTestDetails;
}

const QualityScore: React.FC<{ label: string, score?: string }> = ({ label, score }) => (
    <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200 last:border-b-0 sm:grid sm:grid-cols-2 sm:gap-4">
        <span className="text-vinet-gray-dark">{label}</span>
        <span className="font-bold text-vinet-gray-dark text-right">{score}</span>
    </div>
);

const NetworkQualitySection: React.FC<NetworkQualitySectionProps> = ({ details }) => {
    if (!details.networkQuality) return null;

    return (
        <div className="my-12 text-left">
            <h2 className="text-2xl font-bold mb-4 text-vinet-gray-dark text-center flex items-center justify-center">
                Network Quality Score
                <InfoIcon className="w-5 h-5 ml-2 text-vinet-gray-light" />
            </h2>
            <div className="border border-gray-200 rounded-lg shadow-inner bg-white divide-y divide-gray-200">
                <QualityScore label="Video Streaming" score={details.networkQuality.videoStreaming} />
                <QualityScore label="Online Gaming" score={details.networkQuality.onlineGaming} />
                <QualityScore label="Video Chatting" score={details.networkQuality.videoChatting} />
            </div>
        </div>
    );
};

export default NetworkQualitySection;
