
import React, { useState, useEffect } from 'react';
import { EspressoExtraction } from '../types';
import Button from './Button';

interface ExtractionFormProps {
  onSubmit: (extraction: EspressoExtraction) => void;
  onCancelEdit: () => void;
  editingExtraction?: EspressoExtraction;
}

const ExtractionForm: React.FC<ExtractionFormProps> = ({ onSubmit, onCancelEdit, editingExtraction }) => {
  const [coffeeName, setCoffeeName] = useState('');
  const [countryRegion, setCountryRegion] = useState('');
  const [roastLevel, setRoastLevel] = useState<EspressoExtraction['roastLevel']>('Légère'); // New state for roast level
  const [grinderClicks, setGrinderClicks] = useState<number | ''>('');
  const [extractionDate, setExtractionDate] = useState('');
  const [doseInGrams, setDoseInGrams] = useState<number | ''>('');
  const [extractionTimeSeconds, setExtractionTimeSeconds] = useState<number | ''>('');
  const [yieldInGrams, setYieldInGrams] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null); // New state for media file
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null); // New state for media preview
  const [tasteRating, setTasteRating] = useState<number | undefined>(undefined); // New state for taste rating
  const [balanceRating, setBalanceRating] = useState<number | undefined>(undefined); // New state for balance rating

  // New states for ratio calculation and display
  const [targetYield, setTargetYield] = useState<number | null>(null);
  const [actualRatio, setActualRatio] = useState<string | null>(null);
  const [isIdealExtraction, setIsIdealExtraction] = useState(false);

  useEffect(() => {
    if (editingExtraction) {
      setCoffeeName(editingExtraction.coffeeName);
      setCountryRegion(editingExtraction.countryRegion);
      setRoastLevel(editingExtraction.roastLevel); // Set roast level for editing
      setGrinderClicks(editingExtraction.grinderClicks);
      setExtractionDate(editingExtraction.extractionDate);
      setDoseInGrams(editingExtraction.doseInGrams);
      setExtractionTimeSeconds(editingExtraction.extractionTimeSeconds);
      setYieldInGrams(editingExtraction.yieldInGrams);
      setNotes(editingExtraction.notes);
      setMediaPreviewUrl(editingExtraction.mediaUrl || null); // Set preview from existing mediaUrl
      setMediaFile(null); // Clear file input when editing an existing item
      setTasteRating(editingExtraction.tasteRating); // Set taste rating for editing
      setBalanceRating(editingExtraction.balanceRating); // Set balance rating for editing
    } else {
      resetForm();
    }
  }, [editingExtraction]);

  useEffect(() => {
    if (typeof doseInGrams === 'number' && doseInGrams > 0) {
      setTargetYield(parseFloat((doseInGrams * 2).toFixed(2))); // Calculate ideal yield precisely
      if (typeof yieldInGrams === 'number' && yieldInGrams > 0) {
        const ratioVal = yieldInGrams / doseInGrams;
        setActualRatio(`1:${ratioVal.toFixed(2)}`);

        // Check for ideal conditions for visual feedback
        const idealTime = typeof extractionTimeSeconds === 'number' && extractionTimeSeconds >= 25 && extractionTimeSeconds <= 30;
        const idealRatio = ratioVal >= 1.80 && ratioVal <= 2.20;
        setIsIdealExtraction(idealTime && idealRatio);
      } else {
        setActualRatio(null);
        setIsIdealExtraction(false);
      }
    } else {
      setTargetYield(null);
      setActualRatio(null);
      setIsIdealExtraction(false);
    }
  }, [doseInGrams, yieldInGrams, extractionTimeSeconds]); // Recalculate when these relevant values change

  const resetForm = () => {
    setCoffeeName('');
    setCountryRegion('');
    setRoastLevel('Légère'); // Reset roast level
    setGrinderClicks('');
    setExtractionDate(new Date().toISOString().split('T')[0]); // Default to today's date
    setDoseInGrams('');
    setExtractionTimeSeconds('');
    setYieldInGrams('');
    setNotes('');
    setMediaFile(null); // Reset media file
    setMediaPreviewUrl(null); // Reset media preview
    setTargetYield(null);
    setActualRatio(null);
    setIsIdealExtraction(false);
    setTasteRating(undefined); // Reset taste rating
    setBalanceRating(undefined); // Reset balance rating
  };

  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic client-side validation for file size
      const maxImageSizeMB = 2; // Max image size 2MB
      const maxVideoSizeMB = 3; // Max video size 3MB, safer for localStorage
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (isImage && file.size > maxImageSizeMB * 1024 * 1024) {
        alert(`La taille de l'image ne doit pas dépasser ${maxImageSizeMB} Mo.`);
        e.target.value = ''; // Clear the input
        setMediaFile(null);
        setMediaPreviewUrl(null);
        return;
      }
      if (isVideo && file.size > maxVideoSizeMB * 1024 * 1024) {
        alert(`La taille de la vidéo ne doit pas dépasser ${maxVideoSizeMB} Mo. Les vidéos volumineuses peuvent ne pas être sauvegardées.`);
        e.target.value = ''; // Clear the input
        setMediaFile(null);
        setMediaPreviewUrl(null);
        return;
      }

      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setMediaFile(null);
      setMediaPreviewUrl(editingExtraction?.mediaUrl || null); // Revert to existing if no new file selected
    }
  };

  const StarRating: React.FC<{
    label: string;
    rating: number | undefined;
    onRatingChange: (rating: number) => void;
  }> = ({ label, rating, onRatingChange }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center mt-1 space-x-1">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <span
            key={starValue}
            className={`cursor-pointer text-2xl ${
              (rating || 0) >= starValue ? 'text-amber-500' : 'text-gray-300'
            }`}
            onClick={() => onRatingChange(starValue)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onRatingChange(starValue);
              }
            }}
            role="radio"
            aria-checked={(rating || 0) === starValue}
            tabIndex={0}
            aria-label={`${starValue} étoile${starValue > 1 ? 's' : ''} pour ${label}`}
          >
            ★
          </span>
        ))}
        {rating !== undefined && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => onRatingChange(undefined as any)} // Cast to any to allow undefined
            className="ml-2 px-2 py-1 text-xs"
            title={`Effacer la note pour ${label}`}
          >
            Effacer
          </Button>
        )}
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (coffeeName && countryRegion && roastLevel && grinderClicks !== '' && extractionDate && doseInGrams !== '' && extractionTimeSeconds !== '' && yieldInGrams !== '') {
      let mediaUrlToSave = editingExtraction?.mediaUrl || undefined;

      if (mediaFile) {
        // Asynchronously read the file if a new one is selected
        mediaUrlToSave = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(mediaFile);
        });
      } else if (mediaPreviewUrl === null) {
        // If mediaPreviewUrl is explicitly set to null (e.g., user removed existing media)
        mediaUrlToSave = undefined;
      }

      const newExtraction: EspressoExtraction = {
        id: editingExtraction?.id || Date.now().toString(), // Use existing ID or generate new
        coffeeName,
        countryRegion,
        roastLevel, // Include roast level in the new extraction
        grinderClicks: Number(grinderClicks),
        extractionDate,
        doseInGrams: Number(doseInGrams),
        extractionTimeSeconds: Number(extractionTimeSeconds),
        yieldInGrams: Number(yieldInGrams),
        notes,
        mediaUrl: mediaUrlToSave, // Include media URL
        tasteRating, // Include taste rating
        balanceRating, // Include balance rating
      };
      onSubmit(newExtraction);
      resetForm();
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  };

  const ratioDisplayClasses = isIdealExtraction 
    ? "bg-green-100 border-green-400 text-green-800" 
    : "bg-gray-50 border-gray-200 text-gray-700";

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">{editingExtraction ? 'Modifier une Extraction' : 'Ajouter une Nouvelle Extraction'}</h2>
      
      <div>
        <label htmlFor="coffeeName" className="block text-sm font-medium text-gray-700">Nom du café</label>
        <input
          type="text"
          id="coffeeName"
          value={coffeeName}
          onChange={(e) => setCoffeeName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      <div>
        <label htmlFor="countryRegion" className="block text-sm font-medium text-gray-700">Pays ou région</label>
        <input
          type="text"
          id="countryRegion"
          value={countryRegion}
          onChange={(e) => setCountryRegion(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      {/* New Roast Level Dropdown */}
      <div>
        <label htmlFor="roastLevel" className="block text-sm font-medium text-gray-700">Torréfaction</label>
        <select
          id="roastLevel"
          value={roastLevel}
          onChange={(e) => setRoastLevel(e.target.value as EspressoExtraction['roastLevel'])}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
        >
          <option value="Légère">Légère</option>
          <option value="Moyenne">Moyenne</option>
          <option value="Robe de moine (moy poussée)">Robe de moine (moy poussée)</option>
          <option value="Poussée (italienne)">Poussée (italienne)</option>
          <option value="Très poussée (Dark)">Très poussée (Dark)</option>
        </select>
      </div>
      {/* End New Roast Level Dropdown */}

      <div>
        <label htmlFor="grinderClicks" className="block text-sm font-medium text-gray-700">Clics moulin (1zpresso J-Ultra)</label>
        <input
          type="number"
          id="grinderClicks"
          value={grinderClicks}
          onChange={(e) => setGrinderClicks(Number(e.target.value))}
          required
          min="0"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      <div>
        <label htmlFor="extractionDate" className="block text-sm font-medium text-gray-700">Date de l'extraction</label>
        <input
          type="date"
          id="extractionDate"
          value={extractionDate}
          onChange={(e) => setExtractionDate(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      <div>
        <label htmlFor="doseInGrams" className="block text-sm font-medium text-gray-700">Dose café (g)</label>
        <input
          type="number"
          id="doseInGrams"
          value={doseInGrams}
          onChange={(e) => setDoseInGrams(Number(e.target.value))}
          required
          min="0.1"
          step="0.1"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      <div>
        <label htmlFor="extractionTimeSeconds" className="block text-sm font-medium text-gray-700">Temps d'extraction (secondes)</label>
        <input
          type="number"
          id="extractionTimeSeconds"
          value={extractionTimeSeconds}
          onChange={(e) => setExtractionTimeSeconds(Number(e.target.value))}
          required
          min="1"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      <div>
        <label htmlFor="yieldInGrams" className="block text-sm font-medium text-gray-700">Dose obtenue (g)</label>
        <input
          type="number"
          id="yieldInGrams"
          value={yieldInGrams}
          onChange={(e) => setYieldInGrams(Number(e.target.value))}
          required
          min="0.1"
          step="0.1"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      {/* New Ratio Section */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h3 className="text-lg font-bold text-amber-800 mb-3">Ratio & Guide</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dose obtenue idéale (g) (Dose x 2)</label>
          <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 text-gray-700">
            {targetYield !== null ? `${targetYield} g` : '-'}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Ratio actuel</label>
          <div className={`mt-1 block w-full border rounded-md shadow-sm p-2 font-semibold ${ratioDisplayClasses}`}>
            {actualRatio !== null ? actualRatio : '-'}
          </div>
        </div>
        {actualRatio !== null && (
          <p className="mt-2 text-xs text-gray-500 italic">
            {isIdealExtraction
              ? "Excellente extraction ! (Ratio 1.8-2.2, Temps 25-30s)"
              : "Ajustez pour un ratio idéal (1:1.8 à 1:2.2) et un temps entre 25 et 30 secondes."
            }
          </p>
        )}
      </div>
      {/* End New Ratio Section */}

      {/* New Taste and Balance Rating Section */}
      <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
        <h3 className="text-lg font-bold text-amber-800 mb-3">Évaluation Sensorielle</h3>
        <StarRating
          label="Goût"
          rating={tasteRating}
          onRatingChange={setTasteRating}
        />
        <StarRating
          label="Équilibre"
          rating={balanceRating}
          onRatingChange={setBalanceRating}
        />
      </div>
      {/* End New Taste and Balance Rating Section */}

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
        ></textarea>
      </div>

      {/* New Media Upload Section */}
      <div>
        <label htmlFor="mediaUpload" className="block text-sm font-medium text-gray-700">Photo ou Vidéo</label>
        <input
          type="file"
          id="mediaUpload"
          accept="image/*,video/*"
          onChange={handleMediaFileChange}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-amber-50 file:text-amber-700
            hover:file:bg-amber-100"
        />
        {(mediaPreviewUrl || editingExtraction?.mediaUrl) && (
          <div className="mt-4 border border-gray-200 rounded-md p-2 relative">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Aperçu du média :</h4>
            {mediaPreviewUrl && mediaPreviewUrl.startsWith('data:image/') && (
              <img src={mediaPreviewUrl} alt="Aperçu de l'image" className="max-w-full h-48 object-contain rounded-md mx-auto" />
            )}
            {mediaPreviewUrl && mediaPreviewUrl.startsWith('data:video/') && (
              <video src={mediaPreviewUrl} controls className="max-w-full h-48 object-contain rounded-md mx-auto">
                Votre navigateur ne supporte pas la balise vidéo.
              </video>
            )}
            {!mediaPreviewUrl && editingExtraction?.mediaUrl && editingExtraction.mediaUrl.startsWith('data:image/') && (
              <img src={editingExtraction.mediaUrl} alt="Image existante" className="max-w-full h-48 object-contain rounded-md mx-auto" />
            )}
            {!mediaPreviewUrl && editingExtraction?.mediaUrl && editingExtraction.mediaUrl.startsWith('data:video/') && (
              <video src={editingExtraction.mediaUrl} controls className="max-w-full h-48 object-contain rounded-md mx-auto">
                Votre navigateur ne supporte pas la balise vidéo.
              </video>
            )}
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                setMediaFile(null);
                setMediaPreviewUrl(null);
                // Clear the file input visually
                const fileInput = document.getElementById('mediaUpload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
              }}
              className="absolute top-2 right-2 p-1 text-xs"
              title="Supprimer le média"
            >
              X
            </Button>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Maximum {mediaFile?.type.startsWith('image/') ? '2 Mo pour les images' : '3 Mo pour les vidéos'} recommandé.
            </p>
          </div>
        )}
      </div>
      {/* End New Media Upload Section */}


      <div className="flex justify-end space-x-2">
        {editingExtraction && (
          <Button type="button" variant="secondary" onClick={onCancelEdit}>
            Annuler
          </Button>
        )}
        <Button type="submit">
          {editingExtraction ? 'Enregistrer les modifications' : 'Ajouter l\'extraction'}
        </Button>
      </div>
    </form>
  );
};

export default ExtractionForm;
