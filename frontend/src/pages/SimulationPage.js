import React, { useState } from 'react';
import { Play, Save } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SIMULATION_TOOLS = [
  { 
    id: 'gromacs', 
    name: 'GROMACS', 
    desc: 'Molecular Dynamics Simulation',
    color: '#2563eb',
    params: [
      { name: 'mdp_file', label: 'MDP File', type: 'file', required: true },
      { name: 'structure', label: 'Structure (GRO/PDB)', type: 'file', required: true },
      { name: 'topology', label: 'Topology', type: 'file', required: true },
      { name: 'nsteps', label: 'Number of Steps', type: 'number', default: 50000 },
      { name: 'dt', label: 'Time Step (ps)', type: 'number', default: 0.002 },
    ]
  },
  { 
    id: 'lammps', 
    name: 'LAMMPS', 
    desc: 'Large-scale Atomic/Molecular Simulation',
    color: '#10b981',
    params: [
      { name: 'input_script', label: 'Input Script', type: 'file', required: true },
      { name: 'data_file', label: 'Data File', type: 'file', required: true },
      { name: 'timesteps', label: 'Timesteps', type: 'number', default: 10000 },
    ]
  },
  { 
    id: 'pyscf', 
    name: 'PySCF', 
    desc: 'Quantum Chemistry Calculations',
    color: '#f59e0b',
    params: [
      { name: 'molecule', label: 'Molecule (XYZ)', type: 'file', required: true },
      { name: 'basis', label: 'Basis Set', type: 'select', options: ['sto-3g', '6-31g', 'cc-pvdz'], default: '6-31g' },
      { name: 'method', label: 'Method', type: 'select', options: ['HF', 'DFT', 'MP2'], default: 'DFT' },
      { name: 'charge', label: 'Charge', type: 'number', default: 0 },
    ]
  },
  { 
    id: 'rdkit', 
    name: 'RDKit', 
    desc: 'Cheminformatics Calculations',
    color: '#8b5cf6',
    params: [
      { name: 'molecule', label: 'Molecule (MOL/SDF)', type: 'file', required: true },
      { name: 'operation', label: 'Operation', type: 'select', options: ['Conformer Generation', 'Property Calculation', 'Fingerprint'], default: 'Property Calculation' },
      { name: 'num_confs', label: 'Num Conformers', type: 'number', default: 10 },
    ]
  },
  { 
    id: 'scipy', 
    name: 'SciPy', 
    desc: 'Scientific Computing Analysis',
    color: '#ef4444',
    params: [
      { name: 'data_file', label: 'Data File (CSV)', type: 'file', required: true },
      { name: 'analysis', label: 'Analysis Type', type: 'select', options: ['Statistics', 'Optimization', 'Integration'], default: 'Statistics' },
    ]
  },
  { 
    id: 'avogadro', 
    name: 'Avogadro', 
    desc: 'Molecular Visualization/Editing',
    color: '#06b6d4',
    params: [
      { name: 'molecule', label: 'Molecule', type: 'file', required: true },
      { name: 'operation', label: 'Operation', type: 'select', options: ['Optimize Geometry', 'Add Hydrogens', 'Generate 3D'], default: 'Optimize Geometry' },
    ]
  },
];

export const SimulationPage = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [formData, setFormData] = useState({});
  const [running, setRunning] = useState(false);
  const [inputMode, setInputMode] = useState('file'); // 'file', 'sequence', 'formula'
  const [textInput, setTextInput] = useState('');

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setFormData({});
    setTextInput('');
  };

  const handleInputChange = (paramName, value) => {
    setFormData(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleGenerateFromInput = async () => {
    if (!textInput.trim()) {
      alert('Please enter a sequence or formula');
      return;
    }

    try {
      const response = await axios.post(`${API}/generate-structure`, {
        input: textInput,
        type: inputMode,
      });
      
      setFormData(prev => ({
        ...prev,
        generated_structure: response.data.structure_file,
      }));
      
      alert('Structure generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate structure');
    }
  };

  const handleSubmit = async () => {
    setRunning(true);
    try {
      const response = await axios.post(`${API}/simulations/run`, {
        tool: selectedTool.id,
        parameters: formData,
      });
      console.log('Simulation started:', response.data);
      alert('Simulation started successfully!');
    } catch (error) {
      console.error('Simulation error:', error);
      alert('Failed to start simulation');
    }
    setRunning(false);
  };

  return (
    <div className="space-y-6" data-testid="simulation-page">
      {/* Tool Selection Grid */}
      <div className="border border-border bg-card p-6">
        <h3 className="font-manrope font-bold text-lg mb-4">Select Simulation Tool</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SIMULATION_TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool)}
              className={`border-2 p-6 rounded-lg text-left transition-all hover:scale-105 ${
                selectedTool?.id === tool.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              data-testid={`tool-${tool.id}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tool.color }}
                />
                <h4 className="font-manrope font-bold text-lg">{tool.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{tool.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Panel */}
      {selectedTool && (
        <div className="border border-border bg-card p-6" data-testid="simulation-config">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-manrope font-bold text-lg">
              Configure {selectedTool.name}
            </h3>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors flex items-center gap-2"
                data-testid="save-config-button"
              >
                <Save size={16} />
                Save Config
              </button>
              <button
                onClick={handleSubmit}
                disabled={running}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
                data-testid="run-simulation-button"
              >
                <Play size={16} />
                {running ? 'Running...' : 'Run Simulation'}
              </button>
            </div>
          </div>

          {/* Input Mode Selector */}
          <div className="mb-6 border border-border rounded-lg p-4 bg-muted/30">
            <label className="block text-sm font-medium mb-3">Input Method</label>
            <div className="flex gap-3">
              <button
                onClick={() => setInputMode('file')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  inputMode === 'file'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border hover:bg-muted'
                }`}
                data-testid="input-mode-file"
              >
                📁 Upload Files
              </button>
              <button
                onClick={() => setInputMode('sequence')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  inputMode === 'sequence'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border hover:bg-muted'
                }`}
                data-testid="input-mode-sequence"
              >
                🧬 Peptide Sequence
              </button>
              <button
                onClick={() => setInputMode('formula')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  inputMode === 'formula'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border hover:bg-muted'
                }`}
                data-testid="input-mode-formula"
              >
                ⚗️ Molecular Formula
              </button>
            </div>
          </div>

          {/* Text Input for Sequence/Formula */}
          {(inputMode === 'sequence' || inputMode === 'formula') && (
            <div className="mb-6 border border-border rounded-lg p-4 bg-background">
              <label className="block text-sm font-medium mb-2">
                {inputMode === 'sequence' 
                  ? 'Enter Peptide Sequence (FASTA format or single letter codes)' 
                  : 'Enter Molecular Formula (e.g., C6H12O6, H2O, CH3COOH)'}
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={
                  inputMode === 'sequence'
                    ? 'Example:\nGEVAL\nHEDRK\nMCPTW\n\nOr:\n>MyPeptide\nMKLLFVAIPLVISLLFGPCGNQKVVSIEDLKDKVEK'
                    : 'Example:\nC6H12O6\nH2O\nCH3COOH'
                }
                className="w-full h-32 px-3 py-2 border border-border rounded-md bg-background font-mono text-sm"
                data-testid="text-input-area"
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleGenerateFromInput}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                  data-testid="generate-structure-button"
                >
                  Generate 3D Structure
                </button>
              </div>
              {formData.generated_structure && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <p className="text-sm text-green-800 dark:text-green-400">
                    ✅ Structure generated successfully! Ready to simulate.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">{selectedTool.params.map((param) => (
              <div key={param.name}>
                <label className="block text-sm font-medium mb-2">
                  {param.label}
                  {param.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {param.type === 'file' && inputMode === 'file' && (
                  <input
                    type="file"
                    onChange={(e) => handleInputChange(param.name, e.target.files[0])}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    data-testid={`input-${param.name}`}
                  />
                )}
                
                {param.type === 'number' && (
                  <input
                    type="number"
                    defaultValue={param.default}
                    onChange={(e) => handleInputChange(param.name, e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    data-testid={`input-${param.name}`}
                  />
                )}
                
                {param.type === 'select' && (
                  <select
                    defaultValue={param.default}
                    onChange={(e) => handleInputChange(param.name, e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    data-testid={`input-${param.name}`}
                  >
                    {param.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationPage;