import React, { useState } from 'react';
import { Download, FileText, FileJson, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';

export const ExportPage = () => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [exporting, setExporting] = useState(false);

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Report',
      icon: FileText,
      desc: 'Complete report with branding and visualizations',
      color: '#ef4444',
    },
    {
      id: 'csv',
      name: 'CSV Data',
      icon: FileSpreadsheet,
      desc: 'Raw data in comma-separated format',
      color: '#10b981',
    },
    {
      id: 'json',
      name: 'JSON Data',
      icon: FileJson,
      desc: 'Structured data for programmatic access',
      color: '#f59e0b',
    },
  ];

  const handleExport = async () => {
    setExporting(true);
    
    try {
      if (selectedFormat === 'pdf') {
        await exportPDF();
      } else if (selectedFormat === 'csv') {
        await exportCSV();
      } else if (selectedFormat === 'json') {
        await exportJSON();
      }
      
      alert(`Export successful! File downloaded as ${selectedFormat.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed');
    }
    
    setExporting(false);
  };

  const exportPDF = async () => {
    const doc = new jsPDF();
    
    // Add PeptiCascade branding
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235);
    doc.text('PeptiCascade', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Scientific Simulation Report', 20, 30);
    
    // Add report content
    doc.setFontSize(16);
    doc.text('Simulation Results Summary', 20, 50);
    
    doc.setFontSize(10);
    doc.text('Total Simulations: 2,880', 20, 65);
    doc.text('Completed Today: 47', 20, 72);
    doc.text('Average Compute Time: 12.4 min', 20, 79);
    
    doc.text('Generated: ' + new Date().toLocaleString(), 20, 100);
    
    // Save
    doc.save('pepticascade_report.pdf');
  };

  const exportCSV = async () => {
    const data = [
      ['ID', 'Name', 'Tool', 'Status', 'Duration'],
      ['1', 'Simulation_0001', 'GROMACS', 'completed', '12m 34s'],
      ['2', 'Simulation_0002', 'RDKit', 'completed', '8m 12s'],
      ['3', 'Simulation_0003', 'PySCF', 'completed', '23m 45s'],
    ];
    
    const csv = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simulation_results.csv';
    a.click();
  };

  const exportJSON = async () => {
    const data = {
      exportDate: new Date().toISOString(),
      totalSimulations: 2880,
      results: [
        { id: 1, name: 'Simulation_0001', tool: 'GROMACS', status: 'completed' },
        { id: 2, name: 'Simulation_0002', tool: 'RDKit', status: 'completed' },
        { id: 3, name: 'Simulation_0003', tool: 'PySCF', status: 'completed' },
      ],
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simulation_results.json';
    a.click();
  };

  return (
    <div className="space-y-6" data-testid="export-page">
      {/* Export Format Selection */}
      <div className="border border-border bg-card p-6">
        <h3 className="font-manrope font-bold text-lg mb-4">Select Export Format</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exportFormats.map((format) => {
            const Icon = format.icon;
            return (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`border-2 p-6 rounded-lg text-left transition-all hover:scale-105 ${
                  selectedFormat === format.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                data-testid={`format-${format.id}`}
              >
                <Icon size={32} style={{ color: format.color }} className="mb-3" />
                <h4 className="font-manrope font-bold text-lg mb-2">{format.name}</h4>
                <p className="text-sm text-muted-foreground">{format.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Options */}
      <div className="border border-border bg-card p-6">
        <h3 className="font-manrope font-bold text-lg mb-4">Export Options</h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Include visualizations</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Include raw data</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Include PeptiCascade branding</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Compress output file</span>
            </label>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-manrope font-bold text-lg">Ready to Export</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Export {selectedFormat.toUpperCase()} with selected options
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
            data-testid="export-button"
          >
            <Download size={20} />
            {exporting ? 'Exporting...' : 'Export Now'}
          </button>
        </div>
      </div>

      {/* Recent Exports */}
      <div className="border border-border bg-card" data-testid="recent-exports">
        <div className="p-6 border-b border-border">
          <h3 className="font-manrope font-bold text-lg">Recent Exports</h3>
        </div>
        <div className="divide-y divide-border">
          {[
            { name: 'pepticascade_report.pdf', date: '2 hours ago', size: '2.4 MB' },
            { name: 'simulation_results.csv', date: '1 day ago', size: '845 KB' },
            { name: 'data_export.json', date: '2 days ago', size: '1.2 MB' },
          ].map((file, index) => (
            <div key={index} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between">
              <div>
                <p className="font-mono text-sm font-semibold">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {file.date} • {file.size}
                </p>
              </div>
              <button className="p-2 hover:bg-muted rounded-md transition-colors">
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExportPage;