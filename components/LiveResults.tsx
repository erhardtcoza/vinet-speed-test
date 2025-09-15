import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { TestState, ChartDataPoint } from '../types';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { LatencyIcon } from './icons/LatencyIcon';
import { JitterIcon } from './icons/JitterIcon';

interface LiveResultsProps {
    latency: number | null;
    jitter: number | null;
    realtimeSpeed: number;
    testState: TestState;
    chartData: ChartDataPoint[];
}

interface ResultCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    unit: string;
    children?: React.ReactNode;
    isActive: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-white border border-gray-200 rounded shadow-lg text-sm">
                <p className="font-bold text-vinet-gray-dark">{`Speed: ${payload[0].value.toFixed(2)} Mbps`}</p>
                <p className="text-xs text-vinet-gray-light">{`Time: ${label}`}</p>
            </div>
        );
    }
    return null;
};

const ResultCard: React.FC<ResultCardProps> = ({ icon, title, value, unit, children, isActive }) => (
    <div className={`p-4 bg-white rounded-lg transition-shadow duration-300 ${isActive ? 'shadow-md' : 'shadow'}`}>
        <div className="flex items-center text-sm text-vinet-gray-light mb-1">
            {icon}
            <span className="ml-2 uppercase font-bold">{title}</span>
        </div>
        <div className="flex justify-between items-end">
            <div>
                <span className="text-4xl font-bold text-vinet-gray-dark">{value}</span>
                <span className="text-lg text-vinet-gray-light ml-1.5">{unit}</span>
            </div>
            <div className="w-24 h-12">
                {children}
            </div>
        </div>
    </div>
);

const LiveResults: React.FC<LiveResultsProps> = ({ latency, jitter, realtimeSpeed, testState, chartData }) => {
    const isTestingDownload = testState === TestState.Download;
    const isTestingUpload = testState === TestState.Upload;
    
    const downloadData = chartData.filter(d => d.type === 'download');
    const uploadData = chartData.filter(d => d.type === 'upload');

    const renderChart = (data: ChartDataPoint[], type: 'download' | 'upload') => {
        const color = '#e50914'; // vinet-red
        const gradientId = type === 'download' ? 'colorDownload' : 'colorUpload';

        return (
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Tooltip 
                        content={<CustomTooltip />} 
                        cursor={{ stroke: '#e50914', strokeWidth: 1, strokeDasharray: '3 3' }} 
                    />
                    <Area type="monotone" dataKey="speed" stroke={color} fillOpacity={1} fill={`url(#${gradientId})`} />
                </AreaChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="w-full space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4">
                    <div className="flex items-center text-sm text-vinet-gray-light mb-1">
                        <LatencyIcon className="w-5 h-5" />
                        <span className="ml-2 uppercase font-bold">Ping</span>
                    </div>
                    <span className="text-4xl font-bold text-vinet-gray-dark">
                        {latency?.toFixed(0) ?? '-'}
                    </span>
                    <span className="text-lg text-vinet-gray-light ml-1.5">ms</span>
                </div>
                 <div className="p-4">
                    <div className="flex items-center text-sm text-vinet-gray-light mb-1">
                        <JitterIcon className="w-5 h-5" />
                        <span className="ml-2 uppercase font-bold">Jitter</span>
                    </div>
                    <span className="text-4xl font-bold text-vinet-gray-dark">
                         {jitter?.toFixed(0) ?? '-'}
                    </span>
                    <span className="text-lg text-vinet-gray-light ml-1.5">ms</span>
                </div>
            </div>
            
            <ResultCard
                icon={<ArrowDownIcon className="w-5 h-5" />}
                title="Download"
                value={isTestingDownload ? realtimeSpeed.toFixed(2) : (testState === TestState.Finished ? (latency !== null ? chartData.filter(d => d.type === 'download').slice(-1)[0]?.speed.toFixed(2) ?? '0.00' : '0.00') : '0.00')}
                unit="Mbps"
                isActive={isTestingDownload}
            >
                {renderChart(downloadData, 'download')}
            </ResultCard>

            <ResultCard
                icon={<ArrowUpIcon className="w-5 h-5" />}
                title="Upload"
                value={isTestingUpload ? realtimeSpeed.toFixed(2) : (testState === TestState.Finished ? (latency !== null ? chartData.filter(d => d.type === 'upload').slice(-1)[0]?.speed.toFixed(2) ?? '0.00' : '0.00') : '0.00')}
                unit="Mbps"
                isActive={isTestingUpload}
            >
                 {(testState === TestState.Upload || testState === TestState.Finished) && renderChart(uploadData, 'upload')}
            </ResultCard>
        </div>
    );
};

export default LiveResults;