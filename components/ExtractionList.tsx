
import React from 'react';
import { EspressoExtraction } from '../types';
import Button from './Button';

interface ExtractionListProps {
  extractions: EspressoExtraction[];
  onEdit: (extraction: EspressoExtraction) => void;
  onDelete: (id: string) => void;
}

const StarDisplay: React.FC<{ rating: number | undefined; label: string }> = ({ rating, label }) => {
  if (rating === undefined || rating === null) {
    return null; // Don't render if no rating
  }
  return (
    <p className="text-sm text-gray-700">
      <span className="font-semibold">{label}:</span>{' '}
      <span className="text-amber-500" aria-label={`${rating} sur 5 étoiles pour ${label}`}>
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </span>
    </p>
  );
};

const ExtractionList: React.FC<ExtractionListProps> = ({ extractions, onEdit, onDelete }) => {
  if (extractions.length === 0) {
    return <p className="text-center text-gray-600 mt-8">Aucune extraction enregistrée. Ajoutez-en une pour commencer !</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {extractions
        .sort((a, b) => new Date(b.extractionDate).getTime() - new Date(a.extractionDate).getTime()) // Sort by date descending
        .map((extraction) => {
        const ratio = (extraction.yieldInGrams / extraction.doseInGrams).toFixed(2);
        const extractionTimeFormatted = `${Math.floor(extraction.extractionTimeSeconds / 60).toString().padStart(2, '0')}:${(extraction.extractionTimeSeconds % 60).toString().padStart(2, '0')}`;

        return (
          <div key={extraction.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-amber-800 mb-2">{extraction.coffeeName}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Pays/Région:</span> {extraction.countryRegion}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Torréfaction:</span> {extraction.roastLevel}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Date:</span> {new Date(extraction.extractionDate).toLocaleDateString('fr-FR')}
              </p>
              <hr className="my-3 border-gray-200" />
              <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-700">
                <p><span className="font-semibold">Clics Moulin:</span> {extraction.grinderClicks}</p>
                <p><span className="font-semibold">Dose Café:</span> {extraction.doseInGrams} g</p>
                <p><span className="font-semibold">Temps Ext.:</span> {extractionTimeFormatted}</p>
                <p><span className="font-semibold">Dose Obtenue:</span> {extraction.yieldInGrams} g</p>
                <p className="col-span-2 text-base font-bold text-amber-700 mt-2">
                  <span className="font-semibold">Ratio:</span> 1:{ratio}
                </p>
              </div>
              
              {/* User Ratings Section */}
              {(extraction.tasteRating !== undefined || extraction.balanceRating !== undefined) && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-md text-sm text-yellow-800 border border-yellow-200">
                  <span className="font-semibold block mb-1 text-yellow-700">Votre Évaluation:</span>
                  <StarDisplay rating={extraction.tasteRating} label="Goût" />
                  <StarDisplay rating={extraction.balanceRating} label="Équilibre" />
                </div>
              )}

              {extraction.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm text-gray-700 border border-gray-200">
                  <span className="font-semibold block mb-1">Notes:</span> {extraction.notes}
                </div>
              )}
              {extraction.mediaUrl && (
                <div className="mt-3">
                  {extraction.mediaUrl.startsWith('data:image/') ? (
                    <img
                      src={extraction.mediaUrl}
                      alt={`Média pour ${extraction.coffeeName}`}
                      className="max-w-full h-auto rounded-md shadow-sm object-cover"
                      style={{ maxHeight: '200px' }}
                    />
                  ) : extraction.mediaUrl.startsWith('data:video/') ? (
                    <video
                      src={extraction.mediaUrl}
                      controls
                      className="max-w-full h-auto rounded-md shadow-sm object-cover"
                      style={{ maxHeight: '200px' }}
                    >
                      Votre navigateur ne supporte pas la balise vidéo.
                    </video>
                  ) : (
                    <p className="text-sm text-gray-500">Média non supporté ou format inconnu.</p>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={() => onEdit(extraction)}>
                Modifier
              </Button>
              <Button variant="danger" onClick={() => onDelete(extraction.id)}>
                Supprimer
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExtractionList;