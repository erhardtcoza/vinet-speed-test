
// Test file sizes in bytes
export const TEST_FILE_SIZES = [
    10 * 1024,      // 10KB
    100 * 1024,     // 100KB
    1 * 1024 * 1024,  // 1MB
    10 * 1024 * 1024, // 10MB
    25 * 1024 * 1024, // 25MB
];

// A large image file for download testing. Cache is busted with a timestamp.
export const DOWNLOAD_URL = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=2560&q=80';

// A public endpoint that accepts POST requests for upload testing.
export const UPLOAD_URL = 'https://vinet-upload.free.beeceptor.com';

// Number of latency samples to take for a more accurate reading.
export const LATENCY_SAMPLE_COUNT = 5;

// Small file for latency testing.
export const LATENCY_TEST_URL = 'https://vinet-speed-test.vercel.app/favicon.ico';