import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Download, RefreshCw } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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
  const [checking, setChecking] = useState(false);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    fetchToolsStatus();
    if (autoUpdate) {
      checkForUpdates();
    }
  }, [autoUpdate]);

  const fetchToolsStatus = async () => {
    try {
      const response = await axios.get(`${API}/tools/status`);
      const status = response.data;
      
      const updatedTools = TOOLS.map(tool => ({
        ...tool,
        status: status[tool.id]?.installed ? 'installed' : 'not_installed',
      }));
      
      setTools(updatedTools);
    } catch (error) {
      console.error('Error fetching tools status:', error);
    }
  };

  const checkForUpdates = async () => {
    setChecking(true);
    try {
      const response = await axios.get(`${API}/tools/check-updates`);
      setUpdates(response.data.updates || []);
      
      if (response.data.updates && response.data.updates.length > 0 && notifications) {
        alert(`${response.data.updates.length} update(s) available!`);
      }
    } catch (error) {
      console.error('Error checking updates:', error);
    }
    setChecking(false);
  };

  const handleInstall = async (toolId) => {
    try {
      const response = await axios.post(`${API}/tools/install/${toolId}`);
      alert(response.data.message);
      fetchToolsStatus();
    } catch (error) {
      alert('Installation failed');
    }
  };

  const handleUpdate = (toolId) => {
    alert(`Updating ${toolId}... This feature will check PyPI for latest versions.`);
  };

  return (
    <div className="space-y-6" data-testid="settings-page">
      {/* General Settings */}
      <div className="border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-manrope font-bold text-lg">General Settings</h3>
          <button
            onClick={checkForUpdates}
            disabled={checking}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
            data-testid="check-updates-button"
          >
            <RefreshCw size={16} className={checking ? 'animate-spin' : ''} />
            {checking ? 'Checking...' : 'Check for Updates'}
          </button>
        </div>
        
        {updates.length > 0 && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-2">
              {updates.length} update(s) available:
            </p>
            <ul className="text-xs text-amber-700 dark:text-amber-500 space-y-1">
              {updates.map((update, idx) => (
                <li key={idx}>• {update.message}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="space-y-4">{/* Rest of settings */}
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