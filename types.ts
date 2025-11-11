
export interface EspressoExtraction {
  id: string; // Unique ID for each entry
  coffeeName: string;
  countryRegion: string;
  roastLevel: 'Légère' | 'Moyenne' | 'Robe de moine (moy poussée)' | 'Poussée (italienne)' | 'Très poussée (Dark)'; // Added roast level
  grinderClicks: number;
  extractionDate: string; // ISO date string "YYYY-MM-DD"
  doseInGrams: number;
  extractionTimeSeconds: number;
  yieldInGrams: number;
  notes: string;
  mediaUrl?: string; // Optional URL for photo or video
  tasteRating?: number; // User-selected taste rating (1-5)
  balanceRating?: number; // User-selected balance rating (1-5)
}
