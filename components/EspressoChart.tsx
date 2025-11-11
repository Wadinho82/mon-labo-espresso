
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { EspressoExtraction } from '../types';

interface EspressoChartProps {
  extractions: EspressoExtraction[];
}

const EspressoChart: React.FC<EspressoChartProps> = ({ extractions }) => {
  // Sort extractions by date ascending for proper time series charting
  const sortedExtractions = [...extractions].sort(
    (a, b) => new Date(a.extractionDate).getTime() - new Date(b.extractionDate).getTime()
  );

  const chartData = sortedExtractions.map((ext) => ({
    date: new Date(ext.extractionDate).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
    }), // Format date for X-axis
    dose: ext.doseInGrams,
    yield: ext.yieldInGrams,
    time: ext.extractionTimeSeconds,
    ratio: parseFloat((ext.yieldInGrams / ext.doseInGrams).toFixed(2)), // Calculate and add ratio
  }));

  if (extractions.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-8">
        Ajoutez des extractions pour voir les tendances.
      </p>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-amber-800 mb-4">Dose de Café au fil du Temps</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" tick={{ fill: '#6b7280' }} />
          <YAxis label={{ value: 'Dose (g)', angle: -90, position: 'insideLeft', fill: '#6b7280' }} tick={{ fill: '#6b7280' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
            labelStyle={{ fontWeight: 'bold', color: '#374151' }}
            itemStyle={{ color: '#4b5563' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Line type="monotone" dataKey="dose" stroke="#8884d8" activeDot={{ r: 8 }} name="Dose (g)" />
        </LineChart>
      </ResponsiveContainer>

      <h3 className="text-xl font-bold text-amber-800 mt-8 mb-4">Dose Obtenue au fil du Temps</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" tick={{ fill: '#6b7280' }} />
          <YAxis label={{ value: 'Dose Obtenue (g)', angle: -90, position: 'insideLeft', fill: '#6b7280' }} tick={{ fill: '#6b7280' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
            labelStyle={{ fontWeight: 'bold', color: '#374151' }}
            itemStyle={{ color: '#4b5563' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Line type="monotone" dataKey="yield" stroke="#f59e0b" activeDot={{ r: 8 }} name="Dose Obtenue (g)" />
        </LineChart>
      </ResponsiveContainer>

      <h3 className="text-xl font-bold text-amber-800 mt-8 mb-4">Temps d'Extraction au fil du Temps</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" tick={{ fill: '#6b7280' }} />
          <YAxis label={{ value: 'Temps (s)', angle: -90, position: 'insideLeft', fill: '#6b7280' }} tick={{ fill: '#6b7280' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
            labelStyle={{ fontWeight: 'bold', color: '#374151' }}
            itemStyle={{ color: '#4b5563' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Line type="monotone" dataKey="time" stroke="#82ca9d" activeDot={{ r: 8 }} name="Temps (s)" />
        </LineChart>
      </ResponsiveContainer>

      {/* New Chart for Ratio over Time */}
      <h3 className="text-xl font-bold text-amber-800 mt-8 mb-4">Ratio d'Extraction au fil du Temps</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" tick={{ fill: '#6b7280' }} />
          <YAxis label={{ value: 'Ratio (1:X)', angle: -90, position: 'insideLeft', fill: '#6b7280' }} tick={{ fill: '#6b7280' }} domain={['auto', 'auto']} />
          <Tooltip
            formatter={(value: number) => `1:${value.toFixed(2)}`}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
            labelStyle={{ fontWeight: 'bold', color: '#374151' }}
            itemStyle={{ color: '#4b5563' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Line type="monotone" dataKey="ratio" stroke="#4a5568" activeDot={{ r: 8 }} name="Ratio (Dose Obtenue / Dose Café)" />
        </LineChart>
      </ResponsiveContainer>
      {/* End New Chart */}
    </div>
  );
};

export default EspressoChart;
