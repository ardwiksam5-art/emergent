import React from 'react';
import { Book, ExternalLink, HelpCircle } from 'lucide-react';

const TOOLS_HELP = [
  {
    id: 'gromacs',
    name: 'GROMACS',
    desc: 'Molecular Dynamics Simulation',
    docs: 'https://manual.gromacs.org/',
    quickStart: [
      'Upload structure file (PDB/GRO)',
      'Upload topology file',
      'Configure MDP parameters',
      'Run simulation',
      'Visualize results',
    ],
  },
  {
    id: 'lammps',
    name: 'LAMMPS',
    desc: 'Large-scale Atomic/Molecular Simulation',
    docs: 'https://docs.lammps.org/',
    quickStart: [
      'Prepare input script',
      'Upload data file',
      'Set timesteps',
      'Run simulation',
      'Analyze trajectory',
    ],
  },
  {
    id: 'pyscf',
    name: 'PySCF',
    desc: 'Quantum Chemistry',
    docs: 'https://pyscf.org/user.html',
    quickStart: [
      'Upload molecule (XYZ)',
      'Select basis set',
      'Choose calculation method (HF/DFT/MP2)',
      'Run calculation',
      'View results',
    ],
  },
  {
    id: 'rdkit',
    name: 'RDKit',
    desc: 'Cheminformatics',
    docs: 'https://www.rdkit.org/docs/',
    quickStart: [
      'Upload molecule (MOL/SDF)',
      'Select operation',
      'Configure parameters',
      'Run analysis',
      'Export results',
    ],
  },
  {
    id: 'scipy',
    name: 'SciPy',
    desc: 'Scientific Computing',
    docs: 'https://docs.scipy.org/',
    quickStart: [
      'Upload data (CSV)',
      'Select analysis type',
      'Run computation',
      'Visualize results',
    ],
  },
  {
    id: 'avogadro',
    name: 'Avogadro',
    desc: 'Molecular Visualization',
    docs: 'https://two.avogadro.cc/',
    quickStart: [
      'Upload molecule',
      'Select operation',
      'Optimize geometry',
      'Export structure',
    ],
  },
];

export const HelpPage = () => {
  return (
    <div className="space-y-6" data-testid="help-page">
      {/* Getting Started */}
      <div className="border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Book size={24} className="text-primary" />
          <h3 className="font-manrope font-bold text-lg">Getting Started</h3>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground mb-4">
            PeptiCascade is a comprehensive scientific simulation platform that brings together
            powerful command-line tools in an easy-to-use graphical interface.
          </p>
          <h4 className="font-manrope font-bold mt-6 mb-3">Quick Start Guide</h4>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Go to <strong>Data Upload</strong> to upload your input files</li>
            <li>Navigate to <strong>Simulation Studio</strong> to configure and run simulations</li>
            <li>Monitor progress in <strong>Job Queue</strong></li>
            <li>View results in <strong>Results Viewer</strong></li>
            <li>Create visualizations in <strong>Visualization Lab</strong></li>
            <li>Export reports from <strong>Export Center</strong></li>
          </ol>
        </div>
      </div>

      {/* Tool Documentation */}
      <div className="border border-border bg-card p-6" data-testid="tool-documentation">
        <h3 className="font-manrope font-bold text-lg mb-4">Tool Documentation</h3>
        <div className="space-y-4">
          {TOOLS_HELP.map((tool) => (
            <div key={tool.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-manrope font-bold">{tool.name}</h4>
                  <p className="text-sm text-muted-foreground">{tool.desc}</p>
                </div>
                <a
                  href={tool.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline text-sm"
                >
                  Official Docs
                  <ExternalLink size={14} />
                </a>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Quick Start:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  {tool.quickStart.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle size={24} className="text-primary" />
          <h3 className="font-manrope font-bold text-lg">Frequently Asked Questions</h3>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">How do I run multiple simulations at once?</h4>
            <p className="text-sm text-muted-foreground">
              PeptiCascade automatically queues multiple simulations. Simply submit multiple jobs
              from the Simulation Studio, and they will be processed in order.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Can I use this without an internet connection?</h4>
            <p className="text-sm text-muted-foreground">
              Yes! PeptiCascade is designed to work 100% offline. All computations run locally
              on your machine, ensuring complete privacy.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">What file formats are supported?</h4>
            <p className="text-sm text-muted-foreground">
              PeptiCascade supports: PDB, XYZ, MOL, SDF, FASTA, GenBank, CSV, JSON, GRO, TPR,
              XTC, TRR, and more.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">How do I export results with branding?</h4>
            <p className="text-sm text-muted-foreground">
              Go to Export Center, select PDF format, and ensure "Include PeptiCascade branding"
              is checked. The exported report will include your company logo and colors.
            </p>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="border border-border bg-card p-6">
        <h3 className="font-manrope font-bold text-lg mb-4">Need More Help?</h3>
        <p className="text-muted-foreground mb-4">
          For additional support, please refer to the official documentation of each simulation tool,
          or contact your system administrator.
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Contact Support
          </button>
          <button className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
            Report an Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;