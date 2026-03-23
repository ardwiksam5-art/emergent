import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Download } from 'lucide-react';

const TOOLS = [
  { id: 'gromacs', name: 'GROMACS', version: '2023.3', status: 'installed' },
  { id: 'lammps', name: 'LAMMPS', version: '2024.1', status: 'not_installed' },
  { id: 'pyscf', name: 'PySCF', version: '2.6.2', status: 'installed' },
  { id: 'rdkit', name: 'RDKit', version: '2025.9.6', status: 'installed' },
  { id: 'scipy', name: 'SciPy', version: '1.17.1', status: 'installed' },
  { id: 'avogadro', name: 'Avogadro', version: '1.99', status: 'not_installed' },
  { id: 'plotly', name: 'Plotly', version: '3.4.0', status: 'installed' },
];

export const SettingsPage = () => {
  const [tools, setTools] = useState(TOOLS);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleInstall = (toolId) => {
    console.log('Installing', toolId);
    alert(`Installing ${toolId}... This may take a few minutes.`);
  };

  const handleUpdate = (toolId) => {
    console.log('Updating', toolId);
    alert(`Updating ${toolId}...`);
  };

  return (
    <div className="space-y-6" data-testid="settings-page">
      {/* General Settings */}
      <div className="border border-border bg-card p-6">
        <h3 className="font-manrope font-bold text-lg mb-4">General Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-Update Tools</p>
              <p className="text-sm text-muted-foreground">Automatically update simulation tools</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoUpdate}
                onChange={(e) => setAutoUpdate(e.target.checked)}
                className="sr-only peer"
                data-testid="auto-update-toggle"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-muted-foreground">Show notifications for completed simulations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="sr-only peer"
                data-testid="notifications-toggle"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Tool Management */}
      <div className="border border-border bg-card" data-testid="tool-management">
        <div className="p-6 border-b border-border">
          <h3 className="font-manrope font-bold text-lg">Installed Tools</h3>
        </div>
        <div className="divide-y divide-border">
          {tools.map((tool) => (
            <div key={tool.id} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                {tool.status === 'installed' ? (
                  <CheckCircle size={24} className="text-green-600" />
                ) : (
                  <AlertCircle size={24} className="text-amber-600" />
                )}
                <div>
                  <p className="font-manrope font-bold">{tool.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {tool.status === 'installed' ? `Version ${tool.version}` : 'Not installed'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {tool.status === 'installed' ? (
                  <button
                    onClick={() => handleUpdate(tool.id)}
                    className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
                    data-testid={`update-${tool.id}`}
                  >
                    Check Updates
                  </button>
                ) : (
                  <button
                    onClick={() => handleInstall(tool.id)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                    data-testid={`install-${tool.id}`}
                  >
                    <Download size={16} />
                    Install
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Information */}
      <div className="border border-border bg-card p-6">
        <h3 className="font-manrope font-bold text-lg mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
          <div>
            <p className="text-muted-foreground">Platform</p>
            <p className="font-semibold">Linux ARM64</p>
          </div>
          <div>
            <p className="text-muted-foreground">Python Version</p>
            <p className="font-semibold">3.11.x</p>
          </div>
          <div>
            <p className="text-muted-foreground">Available Memory</p>
            <p className="font-semibold">8 GB</p>
          </div>
          <div>
            <p className="text-muted-foreground">CPU Cores</p>
            <p className="font-semibold">4</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;