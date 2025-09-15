import { TestResults } from '../types';

const HISTORY_KEY = 'vinetSpeedTestHistory';

// Limit the number of results stored to prevent localStorage from getting too large.
const MAX_HISTORY_ITEMS = 15;

/**
 * Retrieves the test history from localStorage.
 * @returns An array of TestResults, or an empty array if none exists or data is corrupt.
 */
export const getHistory = (): TestResults[] => {
    try {
        const historyJson = localStorage.getItem(HISTORY_KEY);
        if (!historyJson) {
            return [];
        }
        const history = JSON.parse(historyJson) as TestResults[];
        // Basic validation to ensure it's an array
        return Array.isArray(history) ? history : [];
    } catch (error) {
        console.error("Failed to parse speed test history from localStorage:", error);
        return [];
    }
};

/**
 * Saves the entire test history to localStorage.
 * @param history The array of TestResults to save.
 */
const saveHistory = (history: TestResults[]): void => {
    try {
        const historyJson = JSON.stringify(history);
        localStorage.setItem(HISTORY_KEY, historyJson);
    } catch (error) {
        console.error("Failed to save speed test history to localStorage:", error);
    }
};

/**
 * Adds a new test result to the history and saves it to localStorage.
 * @param result The new TestResults object to add.
 */
export const addResultToHistory = (result: TestResults): void => {
    const history = getHistory();
    const newHistory = [result, ...history];
    
    // Keep the history size manageable
    if (newHistory.length > MAX_HISTORY_ITEMS) {
        newHistory.length = MAX_HISTORY_ITEMS;
    }
    
    saveHistory(newHistory);
};

/**
 * Clears the entire test history from localStorage.
 */
export const clearHistory = (): void => {
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error("Failed to clear speed test history from localStorage:", error);
    }
};
