import React from 'react';
import { TestState } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface TestProgressFooterProps {
    testState: TestState;
}

type IconStatus = 'pending' | 'active' | 'complete';

const StatusIcon: React.FC<{
    status: IconStatus;
    children: React.ReactNode;
}> = ({ status, children }) => {
    let statusClasses = 'bg-gray-200 text-vinet-gray-light'; // Default: pending
    
    if (status === 'complete') {
        statusClasses = 'bg-vinet-red-dark text-white'; // Use darker red for complete
    } else if (status === 'active') {
        // Active state has pulse and scale animation
        statusClasses = 'bg-vinet-red text-white animate-pulse scale-110 shadow-md';
    }

    return (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${statusClasses}`}>
            {status === 'complete' ? <CheckIcon className="w-5 h-5" /> : children}
        </div>
    );
};


const TestProgressFooter: React.FC<TestProgressFooterProps> = ({ testState }) => {
    const isTesting = testState !== TestState.Idle && testState !== TestState.Finished;

    const getIconStatus = (activeState: TestState, completeStates: TestState[]): IconStatus => {
        if (testState === activeState) {
            return 'active';
        }
        if (completeStates.includes(testState)) {
            return 'complete';
        }
        return 'pending';
    };

    const latencyStatus = getIconStatus(TestState.Latency, [TestState.Download, TestState.Upload, TestState.Finished]);
    const downloadStatus = getIconStatus(TestState.Download, [TestState.Upload, TestState.Finished]);
    const uploadStatus = getIconStatus(TestState.Upload, [TestState.Finished]);

    return (
        <footer className="w-full max-w-6xl mx-auto p-4 text-vinet-gray-dark">
            <div className="flex justify-between items-center mb-1">
                {/* Left Side: Server Info */}
                <div className="text-left">
                    <div className="font-bold">The Computer Hut</div>
                    <div className="text-sm text-vinet-gray-light">160.226.143.254</div>
                </div>

                {/* Center: Status Icons */}
                <div className="flex items-center space-x-2">
                    <StatusIcon status={isTesting ? 'complete' : 'pending'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20.25a.25.25 0 01.25-.25h.008a.25.25 0 01.25.25v.008a.25.25 0 01-.25.25h-.008a.25.25 0 01-.25-.25v-.008z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.875 12.162a10.5 10.5 0 0114.25 0M12 15.75a.25.25 0 01.25-.25h.008a.25.25 0 01.25.25v.008a.25.25 0 01-.25.25h-.008a.25.25 0 01-.25-.25v-.008z" /></svg>
                    </StatusIcon>
                    <StatusIcon 
                        status={latencyStatus}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.136 11.886c3.87-3.87 10.154-3.87 14.024 0" /></svg>
                    </StatusIcon>
                     <StatusIcon 
                        status={downloadStatus}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 17l-4 4m0 0l-4-4m4 4V3" /></svg>
                    </StatusIcon>
                     <StatusIcon 
                        status={uploadStatus}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7l4-4m0 0l4 4m-4-4v18" /></svg>
                    </StatusIcon>
                </div>
                
                {/* Right Side: Location Info */}
                <div className="text-right">
                    <div className="font-bold">Vinet Internet Solutions</div>
                </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-1">
                <div className={`bg-vinet-red h-1 rounded-full transition-all duration-500 ease-linear ${isTesting ? 'w-full' : 'w-0'}`} ></div>
            </div>
        </footer>
    );
};

export default TestProgressFooter;