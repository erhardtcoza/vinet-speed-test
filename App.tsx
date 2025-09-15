import React, { useState, useCallback, useEffect } from 'react';
import { TestState, TestResults, ChartDataPoint, MeasurementPoint } from './types';
import { runFullTest } from './services/speedTestService';
import Header from './components/Header';
import SpeedGauge from './components/SpeedGauge';
import LiveResults from './components/LiveResults';
import TestProgressFooter from './components/TestProgressFooter';
import ResultsView from './components/ResultsView';
import HistoryPanel from './components/HistoryPanel';
import { getHistory, addResultToHistory, clearHistory } from './services/localStorageService';


const App: React.FC = () => {
    const [testState, setTestState] = useState<TestState>(TestState.Idle);
    const [results, setResults] = useState<TestResults | null>(null);
    const [measurements, setMeasurements] = useState<MeasurementPoint[]>([]);
    const [realtimeSpeed, setRealtimeSpeed] = useState(0);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [history, setHistory] = useState<TestResults[]>([]);
    const [currentLatency, setCurrentLatency] = useState<number | null>(null);
    const [currentJitter, setCurrentJitter] = useState<number | null>(null);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const startTest = useCallback(() => {
        setTestState(TestState.Starting);
        setResults(null);
        setMeasurements([]);
        setRealtimeSpeed(0);
        setChartData([]);
        setCurrentLatency(null);
        setCurrentJitter(null);

        runFullTest({
            onStateChange: (newState) => setTestState(newState),
            onLatencyUpdate: (latency, jitter) => {
                setCurrentLatency(latency);
                setCurrentJitter(jitter);
            },
            onRealtimeSpeedUpdate: (speed, type) => {
                setRealtimeSpeed(speed);
                setChartData(prevData => [...prevData, { time: prevData.length, speed, type }]);
            },
            onMeasurementComplete: (measurement) => {
                setMeasurements(prev => [...prev, measurement]);
            },
            onFinalResults: (finalResults) => {
                setResults(finalResults);
                setCurrentLatency(finalResults.latency);
                setCurrentJitter(finalResults.jitter);
                setRealtimeSpeed(0);
                addResultToHistory(finalResults);
                setHistory(prev => [finalResults, ...prev].slice(0, 15));
            }
        });
    }, []);
    
    const handleClearHistory = useCallback(() => {
        clearHistory();
        setHistory([]);
    }, []);

    const handleStartTest = useCallback(() => {
        if (testState !== TestState.Idle && testState !== TestState.Finished) return;
        startTest();
    }, [testState, startTest]);

    const handleRetest = useCallback(() => {
        startTest();
    }, [startTest]);

    const isTesting = testState !== TestState.Idle && testState !== TestState.Finished;
    const currentSpeed = isTesting ? realtimeSpeed : (results ? results.download : 0);

    return (
        <div className="min-h-screen text-vinet-gray-dark flex flex-col items-center antialiased">
            <Header />
            <main className="w-full max-w-6xl mx-auto px-4 flex-grow flex flex-col items-center justify-center">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
                    <div className="flex justify-center items-center">
                       <SpeedGauge 
                            speed={currentSpeed} 
                            onStartTest={handleStartTest}
                            testState={testState}
                        />
                    </div>
                    <div>
                        <LiveResults 
                            latency={currentLatency}
                            jitter={currentJitter}
                            realtimeSpeed={realtimeSpeed}
                            testState={testState}
                            chartData={chartData}
                        />
                    </div>
                </div>
                
                {testState !== TestState.Idle && (
                    <div className="w-full">
                        <ResultsView 
                            results={results}
                            measurements={measurements}
                            onRetest={handleRetest}
                            isFinished={testState === TestState.Finished}
                        />
                    </div>
                )}

                {(testState === TestState.Idle || testState === TestState.Finished) && (
                    <HistoryPanel 
                        history={history}
                        onClearHistory={handleClearHistory}
                    />
                )}
            </main>
            {isTesting && <TestProgressFooter testState={testState} />}
            <footer className="w-full text-center p-4 text-sm text-vinet-gray-light">
                &copy; Vinet Internet Solutions
            </footer>
        </div>
    );
};

export default App;