import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, Download } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTool, setFilterTool] = useState('all');

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    filterResults();
  }, [searchTerm, filterTool, results]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${API}/simulations/results`);
      setResults(response.data);
    } catch (error) {
      console.log('Using mock data');
      // Mock 2880 simulations
      const mockData = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Simulation_${String(i + 1).padStart(4, '0')}`,
        tool: ['GROMACS', 'RDKit', 'PySCF', 'SciPy', 'LAMMPS', 'Avogadro'][Math.floor(Math.random() * 6)],
        status: ['completed', 'failed'][Math.floor(Math.random() * 2)],
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        duration: `${Math.floor(Math.random() * 60)}m ${Math.floor(Math.random() * 60)}s`,
      }));
      setResults(mockData);
    }
  };

  const filterResults = () => {
    let filtered = results;
    
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tool.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterTool !== 'all') {
      filtered = filtered.filter(r => r.tool === filterTool);
    }
    
    setFilteredResults(filtered);
  };

  return (
    <div className="space-y-6" data-testid="results-page">
      {/* Header */}
      <div className="border border-border bg-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search simulations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
              data-testid="search-input"
            />
          </div>
          
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-muted-foreground" />
            <select
              value={filterTool}
              onChange={(e) => setFilterTool(e.target.value)}
              className="px-4 py-2 border border-border rounded-md bg-background"
              data-testid="tool-filter"
            >
              <option value="all">All Tools</option>
              <option value="GROMACS">GROMACS</option>
              <option value="RDKit">RDKit</option>
              <option value="PySCF">PySCF</option>
              <option value="SciPy">SciPy</option>
              <option value="LAMMPS">LAMMPS</option>
              <option value="Avogadro">Avogadro</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredResults.length} of {results.length} simulations
        </div>
      </div>

      {/* Results Table */}
      <div className="border border-border bg-card overflow-hidden" data-testid="results-table">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Tool</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{result.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-semibold">{result.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                      {result.tool}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        result.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {result.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{result.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{result.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-md transition-colors" data-testid={`view-result-${result.id}`}>
                        <Eye size={16} />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-md transition-colors" data-testid={`download-result-${result.id}`}>
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;