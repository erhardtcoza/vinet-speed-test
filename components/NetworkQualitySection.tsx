import React from 'react';
import { SpeedTestDetails } from '../types';
import { InfoIcon } from './icons/InfoIcon';
import Tooltip from './Tooltip';

interface NetworkQualitySectionProps {
    details: SpeedTestDetails;
}

const QualityScore: React.FC<{ label: string, score?: string, tooltipText: string }> = ({ label, score, tooltipText }) => (
    <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200 last:border-b-0 sm:grid sm:grid-cols-2 sm:gap-4">
        <Tooltip text={tooltipText}>
            <span className="text-vinet-gray-dark cursor-help border-b border-dotted border-gray-400">{label}</span>
        </Tooltip>
        <span className="font-bold text-vinet-gray-dark text-right">{score}</span>
    </div>
);

const NetworkQualitySection: React.FC<NetworkQualitySectionProps> = ({ details }) => {
    if (!details.networkQuality) return null;

    const tooltipTexts = {
        section: "Evaluates your connection's performance for common online activities based on latency, jitter, and bandwidth.",
        streaming: "Measures the ability to stream high-definition video without buffering. Based on download speed and consistency.",
        gaming: "Indicates suitability for competitive online gaming. Primarily based on low latency (ping) and minimal jitter.",
        chatting: "Reflects the quality of real-time communication apps like Zoom or FaceTime. Based on a balance of upload speed, download speed, and low jitter."
    };

    return (
        <div className="my-12 text-left">
            <Tooltip text={tooltipTexts.section}>
                <h2 className="text-2xl font-bold mb-4 text-vinet-gray-dark text-center flex items-center justify-center cursor-help">
                    Network Quality Score
                    <InfoIcon className="w-5 h-5 ml-2 text-vinet-gray-light" />
                </h2>
            </Tooltip>
            <div className="border border-gray-200 rounded-lg shadow-inner bg-white divide-y divide-gray-200">
                <QualityScore 
                    label="Video Streaming" 
                    score={details.networkQuality.videoStreaming} 
                    tooltipText={tooltipTexts.streaming}
                />
                <QualityScore 
                    label="Online Gaming" 
                    score={details.networkQuality.onlineGaming} 
                    tooltipText={tooltipTexts.gaming}
                />
                <QualityScore 
                    label="Video Chatting" 
                    score={details.networkQuality.videoChatting} 
                    tooltipText={tooltipTexts.chatting}
                />
            </div>
        </div>
    );
};

export default NetworkQualitySection;