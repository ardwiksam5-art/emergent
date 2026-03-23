import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

export const VisualizationPage = () => {
  const [selectedChart, setSelectedChart] = useState('rmsd');

  const charts = {
    rmsd: {
      title: 'RMSD Over Time',
      data: Array.from({ length: 100 }, (_, i) => ({
        time: i * 0.5,
        rmsd: Math.random() * 0.5 + 0.2,
      })),
      type: 'line',
    },
    rmsf: {
      title: 'RMSF Per Residue',
      data: Array.from({ length: 200 }, (_, i) => ({
        residue: i + 1,
        rmsf: Math.random() * 0.4 + 0.1,
      })),
      type: 'area',
    },
    energy: {
      title: 'Energy Components',
      data: Array.from({ length: 100 }, (_, i) => ({
        time: i,
        potential: -50000 + Math.random() * 1000,
        kinetic: 30000 + Math.random() * 500,
      })),
      type: 'multiline',
    },
    hbonds: {
      title: 'Hydrogen Bonds',
      data: Array.from({ length: 100 }, (_, i) => ({
        frame: i,
        hbonds: Math.floor(Math.random() * 20) + 10,
      })),
      type: 'scatter',
    },
  };

  const selectedData = charts[selectedChart];

  return (
    <div className="space-y-6" data-testid="visualization-page">
      {/* Chart Selection */}
      <div className="border border-border bg-card p-6">
        <h3 className="font-manrope font-bold text-lg mb-4">Select Visualization</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(charts).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedChart(key)}
              className={`border-2 p-4 rounded-lg text-left transition-all ${
                selectedChart === key
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              data-testid={`chart-${key}`}
            >
              <BarChart3 size={20} className="mb-2" />
              <p className="font-medium text-sm">{charts[key].title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Display */}
      <div className="border border-border bg-card p-6" data-testid="chart-display">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-manrope font-bold text-xl">{selectedData.title}</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors">
              Download PNG
            </button>
            <button className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors">
              Download Data
            </button>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={500}>
          {selectedData.type === 'line' && (
            <LineChart data={selectedData.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" label={{ value: 'Time (ns)', position: 'insideBottom', offset: -5 }} stroke="#64748b" />
              <YAxis label={{ value: 'RMSD (nm)', angle: -90, position: 'insideLeft' }} stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rmsd" stroke="#2563eb" strokeWidth={2} dot={false} name="RMSD (nm)" />
            </LineChart>
          )}
          
          {selectedData.type === 'area' && (
            <AreaChart data={selectedData.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="residue" label={{ value: 'Residue Number', position: 'insideBottom', offset: -5 }} stroke="#64748b" />
              <YAxis label={{ value: 'RMSF (nm)', angle: -90, position: 'insideLeft' }} stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="rmsf" stroke="#10b981" fill="#10b98130" name="RMSF" />
            </AreaChart>
          )}
          
          {selectedData.type === 'multiline' && (
            <LineChart data={selectedData.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" label={{ value: 'Time (ps)', position: 'insideBottom', offset: -5 }} stroke="#64748b" />
              <YAxis label={{ value: 'Energy (kJ/mol)', angle: -90, position: 'insideLeft' }} stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="potential" stroke="#f59e0b" strokeWidth={2} dot={false} name="Potential Energy" />
              <Line type="monotone" dataKey="kinetic" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Kinetic Energy" />
            </LineChart>
          )}
          
          {selectedData.type === 'scatter' && (
            <ScatterChart data={selectedData.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="frame" label={{ value: 'Frame', position: 'insideBottom', offset: -5 }} stroke="#64748b" />
              <YAxis label={{ value: 'Number of H-Bonds', angle: -90, position: 'insideLeft' }} stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Scatter dataKey="hbonds" fill="#06b6d4" name="H-Bonds" />
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* 3D Molecular Viewer Placeholder */}
      <div className="border border-border bg-card p-6">
        <h3 className="font-manrope font-bold text-lg mb-4">3D Molecular Viewer</h3>
        <div className="bg-muted/30 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-border">
          <div className="text-center">
            <BarChart3 size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">3D molecular visualization will appear here</p>
            <p className="text-sm text-muted-foreground mt-2">Upload a PDB/XYZ file to visualize</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationPage;