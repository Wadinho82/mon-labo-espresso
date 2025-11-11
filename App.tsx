import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { EspressoExtraction } from './types';
import { getExtractions, saveExtractions, getEspressoMachineName, saveEspressoMachineName, getGrinderType, saveGrinderType } from './services/localStorageService';
import ExtractionForm from './components/ExtractionForm';
import ExtractionList from './components/ExtractionList';
import EspressoChart from './components/EspressoChart'; // Import the new chart component
import Button from './components/Button'; // Import Button for filter reset

const App: React.FC = () => {
  const [extractions, setExtractions] = useState<EspressoExtraction[]>([]);
  const [editingExtraction, setEditingExtraction] = useState<EspressoExtraction | undefined>(undefined);

  // Filter states
  const [filterCoffeeName, setFilterCoffeeName] = useState<string>('');
  const [filterRoastLevel, setFilterRoastLevel] = useState<string>('Toutes');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');

  // Equipment states
  const [espressoMachineName, setEspressoMachineName] = useState<string>('');
  const [grinderType, setGrinderType] = useState<string>('');
  const [showEquipmentSavedMessage, setShowEquipmentSavedMessage] = useState<boolean>(false);
  
  // Local storage error state
  const [showLocalStorageError, setShowLocalStorageError] = useState<boolean>(false);


  // Load extractions and equipment on initial mount
  useEffect(() => {
    setExtractions(getExtractions());
    setEspressoMachineName(getEspressoMachineName());
    setGrinderType(getGrinderType());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save extractions to local storage whenever the extractions state changes
  useEffect(() => {
    const success = saveExtractions(extractions);
    if (!success) {
      setShowLocalStorageError(true);
      setTimeout(() => setShowLocalStorageError(false), 7000); // Hide message after 7 seconds
    } else {
      setShowLocalStorageError(false);
    }
  }, [extractions]);

  // Save equipment to local storage whenever their state changes
  useEffect(() => {
    saveEspressoMachineName(espressoMachineName);
  }, [espressoMachineName]);

  useEffect(() => {
    saveGrinderType(grinderType);
  }, [grinderType]);

  const handleSaveEquipment = useCallback(() => {
    saveEspressoMachineName(espressoMachineName);
    saveGrinderType(grinderType);
    setShowEquipmentSavedMessage(true);
    setTimeout(() => {
      setShowEquipmentSavedMessage(false);
    }, 3000); // Hide message after 3 seconds
  }, [espressoMachineName, grinderType]);

  const handleAddOrUpdateExtraction = useCallback(async (newOrUpdatedExtraction: EspressoExtraction) => {
    if (editingExtraction) {
      // Update existing extraction
      setExtractions((prevExtractions) =>
        prevExtractions.map((ext) =>
          ext.id === newOrUpdatedExtraction.id ? newOrUpdatedExtraction : ext
        )
      );
      setEditingExtraction(undefined); // Exit edit mode
    } else {
      // Add new extraction
      setExtractions((prevExtractions) => [...prevExtractions, newOrUpdatedExtraction]);
    }
  }, [editingExtraction]);

  const handleDeleteExtraction = useCallback((id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette extraction ?')) {
      setExtractions((prevExtractions) => prevExtractions.filter((ext) => ext.id !== id));
      if (editingExtraction?.id === id) {
        setEditingExtraction(undefined); // If deleted item was being edited, cancel edit mode
      }
    }
  }, [editingExtraction]);

  const handleEditExtraction = useCallback((extraction: EspressoExtraction) => {
    setEditingExtraction(extraction);
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingExtraction(undefined);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilterCoffeeName('');
    setFilterRoastLevel('Toutes');
    setFilterDateFrom('');
    setFilterDateTo('');
  }, []);

  // Function to handle data export to CSV
  const handleExportToCSV = useCallback(() => {
    if (extractions.length === 0) {
      alert("Aucune extraction à exporter.");
      return;
    }

    const headers = [
      "ID",
      "Nom du Cafe",
      "Pays ou Region",
      "Torrefaction",
      "Clics Moulin",
      "Date d'Extraction",
      "Dose Cafe (g)",
      "Temps Extraction (s)",
      "Dose Obtenue (g)",
      "Notes",
      "URL Media",
      "Note Goût",
      "Note Équilibre"
    ];

    const escapeCsvValue = (value: string | number | boolean | undefined | null): string => {
      if (value === undefined || value === null) {
        return "";
      }
      let stringValue = String(value);
      // Enclose in double quotes if value contains comma, double quote, or newline
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`; // Escape internal double quotes by doubling them
      }
      return stringValue;
    };

    const csvRows = extractions.map(ext => {
      return [
        escapeCsvValue(ext.id),
        escapeCsvValue(ext.coffeeName),
        escapeCsvValue(ext.countryRegion),
        escapeCsvValue(ext.roastLevel),
        escapeCsvValue(ext.grinderClicks),
        escapeCsvValue(ext.extractionDate),
        escapeCsvValue(ext.extractionTimeSeconds),
        escapeCsvValue(ext.yieldInGrams),
        escapeCsvValue(ext.notes),
        escapeCsvValue(ext.mediaUrl),
        escapeCsvValue(ext.tasteRating),
        escapeCsvValue(ext.balanceRating)
      ].join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `espresso_extractions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, [extractions]);

  const getRatio = (extraction: EspressoExtraction) => extraction.yieldInGrams / extraction.doseInGrams;

  const isIdealExtraction = (extraction: EspressoExtraction): boolean => {
    const ratio = getRatio(extraction);
    const idealTime = extraction.extractionTimeSeconds >= 25 && extraction.extractionTimeSeconds <= 30;
    const idealRatio = ratio >= 1.80 && ratio <= 2.20;
    return idealTime && idealRatio;
  };

  // Filter extractions based on state
  const filteredExtractions = useMemo(() => {
    return extractions.filter(extraction => {
      // Filter by Coffee Name
      if (filterCoffeeName && !extraction.coffeeName.toLowerCase().includes(filterCoffeeName.toLowerCase())) {
        return false;
      }
      // Filter by Roast Level
      if (filterRoastLevel !== 'Toutes' && extraction.roastLevel !== filterRoastLevel) {
        return false;
      }
      // Filter by Date From
      if (filterDateFrom && extraction.extractionDate < filterDateFrom) {
        return false;
      }
      // Filter by Date To
      if (filterDateTo && extraction.extractionDate > filterDateTo) {
        return false;
      }
      return true;
    });
  }, [extractions, filterCoffeeName, filterRoastLevel, filterDateFrom, filterDateTo]);

  // Sort filtered extractions by date descending for latest/best calculations and display
  const sortedExtractions = [...filteredExtractions].sort((a, b) => new Date(b.extractionDate).getTime() - new Date(a.extractionDate).getTime());

  // Fix: Corrected typo from sortedExtraactions to sortedExtractions
  const latestExtraction = sortedExtractions.length > 0 ? sortedExtractions[0] : null;

  const bestExtraction = sortedExtractions.filter(isIdealExtraction).sort((a, b) => {
    // Prioritize ratio closest to 2.0, then more recent
    const ratioA = getRatio(a);
    const ratioB = getRatio(b);
    const diffA = Math.abs(ratioA - 2.0);
    const diffB = Math.abs(ratioB - 2.0);

    if (diffA !== diffB) {
      return diffA - diffB; // Closest ratio to 2.0
    }
    return new Date(b.extractionDate).getTime() - new Date(a.extractionDate).getTime(); // More recent
  })[0] || null;

  const coffeeHistory = useMemo(() => {
    const historyMap = new Map<string, {
      coffeeName: string;
      extractionCount: number;
      lastExtractionDate: string;
      extractionsForCoffee: EspressoExtraction[];
    }>();

    extractions.forEach(ext => {
      const currentEntry = historyMap.get(ext.coffeeName);
      if (!currentEntry) {
        historyMap.set(ext.coffeeName, {
          coffeeName: ext.coffeeName,
          extractionCount: 1,
          lastExtractionDate: ext.extractionDate,
          extractionsForCoffee: [ext],
        });
      } else {
        currentEntry.extractionCount++;
        if (new Date(ext.extractionDate) > new Date(currentEntry.lastExtractionDate)) {
          currentEntry.lastExtractionDate = ext.extractionDate;
        }
        currentEntry.extractionsForCoffee.push(ext);
      }
    });

    const historyList = Array.from(historyMap.values()).map(entry => {
      // Sort all extractions for this coffee by date (descending)
      const sortedExtractionsForThisCoffee = [...entry.extractionsForCoffee].sort(
        (a, b) => new Date(b.extractionDate).getTime() - new Date(a.extractionDate).getTime()
      );

      // Find the best ideal extraction for this coffee
      const bestIdealForCoffee = sortedExtractionsForThisCoffee
        .filter(isIdealExtraction)
        .sort((a, b) => {
          // Prioritize ratio closest to 2.0, then more recent
          const ratioA = getRatio(a);
          const ratioB = getRatio(b);
          const diffA = Math.abs(ratioA - 2.0);
          const diffB = Math.abs(ratioB - 2.0);

          if (diffA !== diffB) {
            return diffA - diffB; // Closest ratio to 2.0
          }
          return new Date(b.extractionDate).getTime() - new Date(a.extractionDate).getTime(); // More recent
        })[0] || null;

      const sourceExtraction = bestIdealForCoffee || sortedExtractionsForThisCoffee[0]; // Fallback to latest if no ideal

      return {
        coffeeName: entry.coffeeName,
        extractionCount: entry.extractionCount,
        lastExtractionDate: new Date(entry.lastExtractionDate).toLocaleDateString('fr-FR'),
        suggestedGrinderClicks: sourceExtraction?.grinderClicks || null,
        suggestedRoastLevel: sourceExtraction?.roastLevel || null,
        suggestedRatio: sourceExtraction ? `1:${getRatio(sourceExtraction).toFixed(2)}` : null,
        suggestedExtractionTime: sourceExtraction ? `${Math.floor(sourceExtraction.extractionTimeSeconds / 60).toString().padStart(2, '0')}:${(sourceExtraction.extractionTimeSeconds % 60).toString().padStart(2, '0')}` : null,
        isIdealSuggested: !!bestIdealForCoffee, // Flag if the suggestion comes from an ideal extraction
      };
    });

    return historyList.sort((a, b) => a.coffeeName.localeCompare(b.coffeeName));
  }, [extractions]);


  const renderExtractionComparisonCard = (title: string, extraction: EspressoExtraction | null) => {
    if (!extraction) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-300">
          <h3 className="text-xl font-bold text-gray-700 mb-2">{title}</h3>
          <p className="text-gray-500">Aucune donnée disponible.</p>
        </div>
      );
    }

    const ratio = getRatio(extraction);
    const extractionTimeFormatted = `${Math.floor(extraction.extractionTimeSeconds / 60).toString().padStart(2, '0')}:${(extraction.extractionTimeSeconds % 60).toString().padStart(2, '0')}`;
    const cardBorderColor = isIdealExtraction(extraction) ? 'border-green-500' : 'border-amber-500';

    return (
      <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${cardBorderColor}`} aria-label={`${title} details`}>
        <h3 className="text-xl font-bold text-amber-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-semibold">Café:</span> {extraction.coffeeName} ({extraction.roastLevel})
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
            <span className="font-semibold">Ratio:</span> 1:{ratio.toFixed(2)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-amber-800 sm:text-5xl md:text-6xl leading-tight">
          Mon Cahier d'Espresso
        </h1>
        <p className="mt-3 text-lg text-gray-600 sm:text-xl">
          Optimisez vos extractions, une note à la fois.
        </p>
      </header>

      <main className="max-w-4xl mx-auto space-y-10">
        {showLocalStorageError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erreur de stockage local :</strong>
            <span className="block sm:inline"> Impossible d'enregistrer toutes les données. Votre navigateur a peut-être atteint sa limite de stockage ou le fichier média est trop volumineux pour être stocké localement.</span>
          </div>
        )}

        <ExtractionForm
          onSubmit={handleAddOrUpdateExtraction}
          onCancelEdit={handleCancelEdit}
          editingExtraction={editingExtraction}
        />
        
        <section className="mt-10">
          <h2 className="text-3xl font-bold text-amber-800 mb-6">Filtres</h2>
          <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="filterCoffeeName" className="block text-sm font-medium text-gray-700">Nom du café</label>
                <input
                  type="text"
                  id="filterCoffeeName"
                  value={filterCoffeeName}
                  onChange={(e) => setFilterCoffeeName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Rechercher par nom de café..."
                />
              </div>

              <div>
                <label htmlFor="filterRoastLevel" className="block text-sm font-medium text-gray-700">Torréfaction</label>
                <select
                  id="filterRoastLevel"
                  value={filterRoastLevel}
                  onChange={(e) => setFilterRoastLevel(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="Toutes">Toutes</option>
                  <option value="Légère">Légère</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Robe de moine (moy poussée)">Robe de moine (moy poussée)</option>
                  <option value="Poussée (italienne)">Poussée (italienne)</option>
                  <option value="Très poussée (Dark)">Très poussée (Dark)</option>
                </select>
              </div>

              <div>
                <label htmlFor="filterDateFrom" className="block text-sm font-medium text-gray-700">Date de début</label>
                <input
                  type="date"
                  id="filterDateFrom"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor="filterDateTo" className="block text-sm font-medium text-gray-700">Date de fin</label>
                <input
                  type="date"
                  id="filterDateTo"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleResetFilters} variant="secondary">
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        </section>

        {/* New section for Equipment */}
        <section className="mt-10">
          <h2 className="text-3xl font-bold text-amber-800 mb-6">Équipements</h2>
          <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
            <div>
              <label htmlFor="espressoMachineName" className="block text-sm font-medium text-gray-700">Nom de la Machine Espresso</label>
              <input
                type="text"
                id="espressoMachineName"
                value={espressoMachineName}
                onChange={(e) => setEspressoMachineName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Ex: La Marzocco Linea Mini"
              />
            </div>
            <div>
              <label htmlFor="grinderType" className="block text-sm font-medium text-gray-700">Type de Moulin</label>
              <input
                type="text"
                id="grinderType"
                value={grinderType}
                onChange={(e) => setGrinderType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Ex: Niche Zero, Eureka Mignon Specialita"
              />
            </div>
            <div className="flex items-center justify-end space-x-2 mt-4">
              {showEquipmentSavedMessage && (
                <p className="text-sm text-green-600 animate-pulse" role="status" aria-live="polite">
                  Équipements enregistrés !
                </p>
              )}
              <Button onClick={handleSaveEquipment} variant="primary">
                Valider les équipements
              </Button>
            </div>
          </div>
        </section>
        {/* End Equipment section */}

        {/* New section for Tools */}
        <section className="mt-10">
          <h2 className="text-3xl font-bold text-amber-800 mb-6">Outils</h2>
          <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleExportToCSV} variant="secondary">
                Exporter les données (CSV)
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-3xl font-bold text-amber-800 mb-6">Mes Extractions Précédentes</h2>
          <ExtractionList
            extractions={sortedExtractions}
            onEdit={handleEditExtraction}
            onDelete={handleDeleteExtraction}
          />
        </section>

        <section className="mt-10">
          <h2 className="text-3xl font-bold text-amber-800 mb-6">Comparaison & Optimisation</h2>
          {extractions.length === 0 ? (
            <p className="text-center text-gray-600">Ajoutez des extractions pour voir la comparaison ici.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderExtractionComparisonCard("Dernière Extraction", latestExtraction)}
              {bestExtraction ? (
                renderExtractionComparisonCard("Meilleure Extraction (Idéale)", bestExtraction)
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-400">
                  <h3 className="text-xl font-bold text-blue-700 mb-2">Meilleure Extraction</h3>
                  <p className="text-blue-600">
                    Continuez à expérimenter ! Aucune extraction "idéale" (temps 25-30s, ratio 1:1.8-1:2.2) n'a encore été enregistrée.
                  </p>
                  <p className="mt-2 text-sm text-blue-500">
                    Visez un temps d'extraction entre 25 et 30 secondes et un ratio de 1:1.8 à 1:2.2 (par exemple, 18g de café pour 36g de boisson).
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* New section for Espresso Charts */}
        <section className="mt-10">
          <h2 className="text-3xl font-bold text-amber-800 mb-6">Tendances des Extractions</h2>
          <EspressoChart extractions={filteredExtractions} />
        </section>

        {/* New section for Coffee History */}
        <section className="mt-10">
          <h2 className="text-3xl font-bold text-amber-800 mb-6">Historique des Cafés</h2>
          {coffeeHistory.length === 0 ? (
            <p className="text-center text-gray-600">Ajoutez des extractions pour construire l'historique de vos cafés.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coffeeHistory.map((coffee) => (
                <div key={coffee.coffeeName} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-amber-800 mb-2">{coffee.coffeeName}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Extractions:</span> {coffee.extractionCount}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Dernière extraction:</span> {coffee.lastExtractionDate}
                  </p>
                  <hr className="my-3 border-gray-200" />
                  <h4 className="font-semibold text-amber-700 mb-2">Réglage recommandé :</h4>
                  {coffee.suggestedGrinderClicks !== null ? (
                    <div className={`p-3 rounded-md text-sm ${coffee.isIdealSuggested ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
                      {coffee.isIdealSuggested && <p className="font-bold mb-1">Ceci est issu d'une extraction idéale !</p>}
                      <p><span className="font-semibold">Torréfaction:</span> {coffee.suggestedRoastLevel}</p>
                      <p><span className="font-semibold">Clics moulin:</span> {coffee.suggestedGrinderClicks}</p>
                      <p><span className="font-semibold">Ratio cible:</span> {coffee.suggestedRatio}</p>
                      <p><span className="font-semibold">Temps cible:</span> {coffee.suggestedExtractionTime}</p>
                      {!coffee.isIdealSuggested && <p className="mt-2 text-xs italic text-blue-700">Ces réglages sont basés sur la dernière extraction pour ce café. Visez l'idéal !</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Aucune suggestion de réglage disponible pour ce café.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
        {/* End Coffee History section */}
      </main>

      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Espresso Logger. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default App;