
export enum TestState {
    Idle = 'idle',
    Starting = 'starting',
    Latency = 'latency',
    Download = 'download',
    Upload = 'upload',
    Finished = 'finished',
    Error = 'error',
}

export interface MeasurementPoint {
    fileSize: number; // in bytes
    downloadSpeed: number; // Mbps
    uploadSpeed: number; // Mbps
    ping: number; // ms
    jitter: number; // ms
    downloadDuration?: number; // seconds
    uploadDuration?: number; // seconds
}

export interface NetworkQualityScores {
    videoStreaming: string;
    onlineGaming: string;
    videoChatting: string;
}

export interface SpeedTestDetails {
    unloadedLatency: number;
    unloadedJitter: number;
    measurements: MeasurementPoint[];
    unloadedLatencySamples: number[];
    downloadLatencySamples: number[];
    uploadLatencySamples: number[];
    downloadSamples: number[];
    uploadSamples: number[];
    serverLocation?: string;
    networkProvider?: string;
    ipAddress?: string;
    networkQuality?: NetworkQualityScores;
}

export interface TestResults {
    id: string;
    timestamp: number;
    download: number;
    upload: number;
    latency: number;
    jitter: number;
    details: SpeedTestDetails | null;
}

export interface ChartDataPoint {
    time: number;
    speed: number;
    type: 'download' | 'upload';
}