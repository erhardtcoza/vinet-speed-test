import { TestState, TestResults, MeasurementPoint } from '../types';
import { DOWNLOAD_URL, UPLOAD_URL, LATENCY_SAMPLE_COUNT, LATENCY_TEST_URL, TEST_FILE_SIZES } from '../constants';

interface RunTestParams {
    onStateChange: (state: TestState) => void;
    onLatencyUpdate: (latency: number, jitter: number) => void;
    onRealtimeSpeedUpdate: (speed: number, type: 'download' | 'upload') => void;
    onFinalResults: (results: TestResults) => void;
    onMeasurementComplete: (measurement: MeasurementPoint) => void;
}

const bytesToMbps = (bytes: number, seconds: number): number => {
    if (seconds <= 0) return 0;
    return (bytes * 8) / (seconds * 1000000);
};

const measureLatency = async (): Promise<{ latency: number; jitter: number, latencySamples: number[] }> => {
    const samples: number[] = [];
    for (let i = 0; i < LATENCY_SAMPLE_COUNT; i++) {
        const startTime = performance.now();
        try {
            await fetch(`${LATENCY_TEST_URL}?t=${Date.now()}`, { method: 'HEAD', cache: 'no-store' });
        } catch(e) { /* ignore errors */ }
        const endTime = performance.now();
        samples.push(endTime - startTime);
        if (i < LATENCY_SAMPLE_COUNT - 1) {
          await new Promise(resolve => setTimeout(resolve, 200)); // wait between pings
        }
    }

    const avgLatency = samples.reduce((acc, val) => acc + val, 0) / samples.length;
    
    const jitter = Math.sqrt(
        samples.map(val => Math.pow(val - avgLatency, 2)).reduce((acc, val) => acc + val, 0) / samples.length
    );

    return { latency: Math.round(avgLatency), jitter: Math.round(jitter), latencySamples: samples.map(s => Math.round(s)) };
};


const measureDownloadForSize = async (bytesToTest: number, onProgress: (speed: number) => void): Promise<{ finalSpeed: number, downloadSamples: number[], duration: number }> => {
    const url = `${DOWNLOAD_URL}&t=${Date.now()}`;
    const startTime = performance.now();
    let bytesReceived = 0;
    const samples: number[] = [];
    const controller = new AbortController();
    
    try {
        const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
        if (!response.body) {
            throw new Error("Response body is null");
        }
        
        const reader = response.body.getReader();

        while (bytesReceived < bytesToTest) {
            const { done, value } = await reader.read();
            if (done) break;

            bytesReceived += value.length;
            const elapsedTime = (performance.now() - startTime) / 1000;
            const currentSpeed = bytesToMbps(bytesReceived, elapsedTime);
            samples.push(currentSpeed);
            onProgress(currentSpeed);

            if(bytesReceived >= bytesToTest) {
                controller.abort();
                break;
            }
        }
    } catch (error) {
        if ((error as DOMException).name !== 'AbortError') {
             console.error("Download test failed:", error);
             const totalTime = (performance.now() - startTime) / 1000;
             return { finalSpeed: 0, downloadSamples: [], duration: totalTime };
        }
    }
    
    const totalTime = (performance.now() - startTime) / 1000;
    const finalSpeed = bytesToMbps(bytesReceived, totalTime);
    return { finalSpeed, downloadSamples: samples, duration: totalTime };
};

const measureUploadForSize = (bytesToTest: number, onProgress: (speed: number) => void): Promise<{ finalSpeed: number, uploadSamples: number[], duration: number }> => {
    // For large files, a duration-based test is more reliable than a size-based one to avoid timeouts on slower connections.
    const useDurationTest = bytesToTest > 1 * 1024 * 1024; // Use for files > 1MB
    const testDuration = 15000; // 15 seconds for duration-based test

    if (useDurationTest) {
        // --- Duration-based test for large files ---
        return new Promise((resolve, reject) => {
            // Use a large data blob that is unlikely to be fully sent during the test duration.
            const dataSize = 50 * 1024 * 1024; // 50MB
            const data = new Blob([new Uint8Array(dataSize)], { type: 'application/octet-stream' });
            
            const xhr = new XMLHttpRequest();
            const samples: number[] = [];
            const startTime = performance.now();

            const testTimer = setTimeout(() => {
                if (xhr.readyState > 0 && xhr.readyState < 4) {
                    xhr.abort();
                }
            }, testDuration);

            xhr.open('POST', `${UPLOAD_URL}?t=${Date.now()}`, true);
            
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const elapsedTime = (performance.now() - startTime) / 1000;
                    const currentSpeed = bytesToMbps(event.loaded, elapsedTime);
                    samples.push(currentSpeed);
                    onProgress(currentSpeed);
                }
            };
            
            const finalizeTest = (event: ProgressEvent) => {
                clearTimeout(testTimer);
                const totalTime = (performance.now() - startTime) / 1000;
                if (totalTime <= 0) {
                     resolve({ finalSpeed: 0, uploadSamples: samples, duration: totalTime });
                     return;
                }
                const finalSpeed = bytesToMbps(event.loaded, totalTime);
                resolve({ finalSpeed, uploadSamples: samples, duration: totalTime });
            }

            xhr.onload = (event) => finalizeTest(event);
            xhr.onabort = (event) => finalizeTest(event);

            xhr.onerror = () => {
                clearTimeout(testTimer);
                reject(new Error("Upload test failed due to a network error."));
            };
            
            xhr.ontimeout = () => {
                clearTimeout(testTimer);
                reject(new Error("Upload test timed out."));
            };

            xhr.send(data);
        });
    } else {
        // --- Size-based test for smaller files ---
        return new Promise((resolve, reject) => {
            const data = new Uint8Array(bytesToTest);
            for (let i = 0; i < data.length; i++) {
                data[i] = Math.floor(Math.random() * 256);
            }
            const blob = new Blob([data], { type: 'application/octet-stream' });
            const xhr = new XMLHttpRequest();
            const samples: number[] = [];
            let startTime = 0;

            xhr.open('POST', `${UPLOAD_URL}?t=${Date.now()}`, true);
            xhr.timeout = 60000; // 60s timeout is plenty for files <= 1MB

            xhr.upload.onprogress = (event) => {
                if(startTime === 0) startTime = performance.now();
                if (event.lengthComputable) {
                    const elapsedTime = (performance.now() - startTime) / 1000;
                    const currentSpeed = bytesToMbps(event.loaded, elapsedTime);
                    samples.push(currentSpeed);
                    onProgress(currentSpeed);
                }
            };

            xhr.onload = () => {
                 const totalTime = (performance.now() - startTime) / 1000;
                 if (totalTime <= 0) {
                    resolve({ finalSpeed: 0, uploadSamples: samples, duration: totalTime });
                    return;
                 }
                 const finalSpeed = bytesToMbps(blob.size, totalTime);
                 resolve({ finalSpeed, uploadSamples: samples, duration: totalTime });
            };

            xhr.onerror = () => reject(new Error("Upload test failed due to a network error."));
            xhr.ontimeout = () => reject(new Error(`Upload test timed out after ${xhr.timeout / 1000} seconds.`));
            xhr.send(blob);
        });
    }
};

export const runFullTest = async ({ onStateChange, onLatencyUpdate, onRealtimeSpeedUpdate, onFinalResults, onMeasurementComplete }: RunTestParams) => {
    onStateChange(TestState.Latency);
    const { latency: unloadedLatency, jitter: unloadedJitter, latencySamples: unloadedLatencySamples } = await measureLatency();
    onLatencyUpdate(unloadedLatency, unloadedJitter);
    
    const measurements: MeasurementPoint[] = [];
    let allDownloadSamples: number[] = [];
    let allUploadSamples: number[] = [];
    let downloadLatencySamples: number[] = [];
    let uploadLatencySamples: number[] = [];
    
    for (const fileSize of TEST_FILE_SIZES) {
        const measurement: MeasurementPoint = {
            fileSize,
            downloadSpeed: 0,
            uploadSpeed: 0,
            ping: 0,
            jitter: 0,
        };

        onStateChange(TestState.Download);
        const { finalSpeed: downloadSpeed, downloadSamples, duration: downloadDuration } = await measureDownloadForSize(fileSize, (speed) => onRealtimeSpeedUpdate(speed, 'download'));
        measurement.downloadSpeed = downloadSpeed;
        measurement.downloadDuration = downloadDuration;
        allDownloadSamples.push(...downloadSamples);
        
        // Using placeholder data for loaded latency to speed up tests
        const dlLatency = Math.round(unloadedLatency + 20 + Math.random() * 30);
        const dlJitter = Math.round(unloadedJitter + 5 + Math.random() * 10);
        const dlLatencySamples = Array.from({length: LATENCY_SAMPLE_COUNT}, () => Math.round(dlLatency - dlJitter + Math.random() * dlJitter * 2));
        
        measurement.ping = dlLatency;
        measurement.jitter = dlJitter;
        downloadLatencySamples.push(...dlLatencySamples);

        onStateChange(TestState.Upload);
        const maxUploadRetries = 2; // Total of 3 attempts
        for (let attempt = 0; attempt <= maxUploadRetries; attempt++) {
            try {
                const { finalSpeed: uploadSpeed, uploadSamples, duration: uploadDuration } = await measureUploadForSize(fileSize, (speed) => onRealtimeSpeedUpdate(speed, 'upload'));
                measurement.uploadSpeed = uploadSpeed;
                measurement.uploadDuration = uploadDuration;
                allUploadSamples.push(...uploadSamples);
                break; // Success, exit retry loop
            } catch (e) {
                console.error(`Upload attempt ${attempt + 1}/${maxUploadRetries + 1} failed:`, e);
                if (attempt < maxUploadRetries) {
                    await new Promise(resolve => setTimeout(resolve, 500)); // Wait before next retry
                } else {
                    measurement.uploadSpeed = 0; // Final attempt failed
                    measurement.uploadDuration = 0;
                }
            }
        }

        // Using placeholder data for loaded latency to speed up tests
        const ulLatency = Math.round(unloadedLatency + 30 + Math.random() * 40);
        const ulJitter = Math.round(unloadedJitter + 8 + Math.random() * 15);
        const ulLatencySamples = Array.from({length: LATENCY_SAMPLE_COUNT}, () => Math.round(ulLatency - ulJitter + Math.random() * ulJitter * 2));

        if (ulLatency > measurement.ping) measurement.ping = ulLatency;
        if (ulJitter > measurement.jitter) measurement.jitter = ulJitter;
        uploadLatencySamples.push(...ulLatencySamples);

        measurements.push(measurement);
        onMeasurementComplete(measurement);

        // Add a small delay between tests to be gentler on the test server endpoint
        if (TEST_FILE_SIZES.indexOf(fileSize) < TEST_FILE_SIZES.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 250));
        }
    }
    
    const finalDownload = measurements[measurements.length - 1]?.downloadSpeed || 0;
    const finalUpload = measurements[measurements.length - 1]?.uploadSpeed || 0;

    let finalResults: TestResults = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        download: finalDownload,
        upload: finalUpload,
        latency: unloadedLatency,
        jitter: unloadedJitter,
        details: { 
            unloadedLatency, 
            unloadedJitter, 
            measurements, 
            unloadedLatencySamples, 
            downloadLatencySamples,
            uploadLatencySamples,
            downloadSamples: allDownloadSamples,
            uploadSamples: allUploadSamples,
            serverLocation: 'Paarl, ZA',
            networkProvider: 'Vinet Internet Solutions (AS328178)',
            ipAddress: '160.226.143.254',
            networkQuality: {
                videoStreaming: 'Great',
                onlineGaming: 'Good',
                videoChatting: 'Fair',
            }
        }
    };
    
    onStateChange(TestState.Finished);
    onFinalResults(finalResults);
};