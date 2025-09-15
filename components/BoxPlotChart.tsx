
import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface BoxPlotChartProps {
    samples: number[];
}

const BoxPlotChart: React.FC<BoxPlotChartProps> = ({ samples }) => {
    const data = samples.map((sample, index) => ({ x: index, y: sample }));
    
    return (
        <div className="w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: -20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis type="number" dataKey="x" name="sample" hide />
                    <YAxis type="number" dataKey="y" name="latency" unit="ms" domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#f9f9f9', border: '1px solid #ccc' }} />
                    <Scatter name="Latency Sample" data={data} fill="#e50914" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BoxPlotChart;
