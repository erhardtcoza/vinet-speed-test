import React from 'react';
import { TestState } from '../types';

interface SpeedGaugeProps {
    speed: number;
    onStartTest: () => void;
    testState: TestState;
}

// Custom scale mapping for the gauge arc
const speedToAngle = (speed: number) => {
    const ranges = [
      { max: 1, angle: 20 },
      { max: 5, angle: 50 },
      { max: 10, angle: 80 },
      { max: 20, angle: 115 },
      { max: 30, angle: 145 },
      { max: 50, angle: 190 },
      { max: 75, angle: 230 },
      { max: 100, angle: 270 },
      { max: 1000, angle: 300 } // Extend for higher speeds
    ];
  
    if (speed <= 0) return 0;
  
    let lowerBound = 0;
    let lowerAngle = 0;
  
    for (const range of ranges) {
      if (speed <= range.max) {
        const speedRatio = (speed - lowerBound) / (range.max - lowerBound);
        return lowerAngle + speedRatio * (range.angle - lowerAngle);
      }
      lowerBound = range.max;
      lowerAngle = range.angle;
    }
  
    return 300; // Max angle for speeds over 100
};
  
const SpeedGauge: React.FC<SpeedGaugeProps> = ({ speed, onStartTest, testState }) => {
    const angle = speedToAngle(speed);
    const isIdle = testState === TestState.Idle || testState === TestState.Finished;

    return (
        <div className="w-[350px] h-[350px] md:w-[600px] md:h-[600px] flex flex-col items-center justify-center relative">
            <svg viewBox="0 0 200 200" className="w-full h-full absolute scale-125">
                <defs>
                    <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#e50914' }} />
                        <stop offset="100%" style={{ stopColor: '#d3d3d3' }} />
                    </linearGradient>
                </defs>
                {/* Background Arc */}
                <path
                    d="M 50 150 A 50 50 0 1 1 150 150"
                    fill="none"
                    stroke="#eeeeee"
                    strokeWidth="20"
                    strokeLinecap="round"
                />
                {/* Foreground Arc */}
                <path
                    d="M 50 150 A 50 50 0 1 1 150 150"
                    fill="none"
                    stroke="url(#arcGradient)"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeDasharray="235.6"
                    strokeDashoffset={235.6 - (angle / 300 * 235.6)}
                    className="transition-all duration-500 ease-out"
                />
            </svg>
            
            <div className="z-10 text-center flex flex-col items-center justify-center h-full">
                 {isIdle ? (
                     <button
                        onClick={onStartTest}
                        className="w-40 h-40 bg-white border-[10px] border-vinet-red rounded-full text-vinet-red text-5xl font-bold transition-transform hover:scale-110 flex items-center justify-center"
                        aria-label="Start speed test"
                    >
                        GO
                    </button>
                ) : (
                    <>
                        <div className="text-8xl md:text-9xl font-bold text-vinet-gray-dark tracking-tighter">
                            {speed.toFixed(2)}
                        </div>
                        <div className="text-2xl text-vinet-gray-light">Mbps</div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SpeedGauge;