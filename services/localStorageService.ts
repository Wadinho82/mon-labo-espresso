
import { EspressoExtraction } from '../types';

const STORAGE_KEY = 'espressoExtractions';
const ESPRESSO_MACHINE_NAME_KEY = 'espressoMachineName';
const GRINDER_TYPE_KEY = 'grinderType';

/**
 * Retrieves all espresso extractions from local storage.
 * @returns An array of EspressoExtraction objects, or an empty array if none found or an error occurs.
 */
export const getExtractions = (): EspressoExtraction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse extractions from localStorage:", error);
    return [];
  }
};

/**
 * Saves the given array of espresso extractions to local storage.
 * @param extractions The array of EspressoExtraction objects to save.
 * @returns true if successful, false otherwise.
 */
export const saveExtractions = (extractions: EspressoExtraction[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(extractions));
    return true;
  } catch (error) {
    console.error("Failed to save extractions to localStorage:", error);
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error("LocalStorage quota exceeded, data could not be saved.");
    }
    return false;
  }
};

/**
 * Retrieves the espresso machine name from local storage.
 * @returns The espresso machine name string, or an empty string if not found.
 */
export const getEspressoMachineName = (): string => {
  try {
    return localStorage.getItem(ESPRESSO_MACHINE_NAME_KEY) || '';
  } catch (error) {
    console.error("Failed to get espresso machine name from localStorage:", error);
    return '';
  }
};

/**
 * Saves the given espresso machine name to local storage.
 * @param name The espresso machine name string to save.
 */
export const saveEspressoMachineName = (name: string): void => {
  try {
    localStorage.setItem(ESPRESSO_MACHINE_NAME_KEY, name);
  } catch (error) {
    console.error("Failed to save espresso machine name to localStorage:", error);
  }
};

/**
 * Retrieves the grinder type from local storage.
 * @returns The grinder type string, or an empty string if not found.
 */
export const getGrinderType = (): string => {
  try {
    return localStorage.getItem(GRINDER_TYPE_KEY) || '';
  } catch (error) {
    console.error("Failed to get grinder type from localStorage:", error);
    return '';
  }
};

/**
 * Saves the given grinder type to local storage.
 * @param type The grinder type string to save.
 */
export const saveGrinderType = (type: string): void => {
  try {
    localStorage.setItem(GRINDER_TYPE_KEY, type);
  } catch (error) {
    console.error("Failed to save grinder type to localStorage:", error);
  }
};