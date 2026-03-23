import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Database, Zap, TrendingUp } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="border border-border bg-card p-6 hover:bg-muted/50 transition-colors" data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2">
          {title}
        </p>
        <p className="text-3xl font-manrope font-extrabold" style={{ color }}>
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
        <Icon size={24} style={{ color }} />
      </div>
    </div>
  </div>
);

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalSimulations: 2880,
    activeJobs: 3,
    completedToday: 47,
    avgComputeTime: '12.4 min'
  });
  
  const [recentSimulations, setRecentSimulations] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${API}/simulations/recent`);
      if (response.data) {
        setRecentSimulations(response.data);
      }
    } catch (error) {
      console.log('Using mock data for recent simulations');
      // Mock data for demo
      setRecentSimulations([
        { id: 1, name: 'GROMACS_MD_001', status: 'completed', tool: 'GROMACS', timestamp: '2 hours ago' },
        { id: 2, name: 'PySCF_QM_042', status: 'running', tool: 'PySCF', timestamp: '1 hour ago' },
        { id: 3, name: 'RDKit_Conformer_15', status: 'completed', tool: 'RDKit', timestamp: '30 min ago' },
      ]);
    }
  };

  // Mock data for charts
  const simulationTrend = [
    { day: 'Mon', simulations: 234 },
    { day: 'Tue', simulations: 312 },
    { day: 'Wed', simulations: 289 },
    { day: 'Thu', simulations: 421 },
    { day: 'Fri', simulations: 387 },
    { day: 'Sat', simulations: 456 },
    { day: 'Sun', simulations: 391 },
  ];

  const toolDistribution = [
    { name: 'GROMACS', value: 1245, color: '#2563eb' },
    { name: 'RDKit', value: 678, color: '#10b981' },
    { name: 'PySCF', value: 432, color: '#f59e0b' },
    { name: 'SciPy', value: 298, color: '#8b5cf6' },
    { name: 'LAMMPS', value: 145, color: '#ef4444' },
    { name: 'Avogadro', value: 52, color: '#06b6d4' },
    { name: 'Plotly', value: 30, color: '#f97316' },
  ];

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Simulations"
          value={stats.totalSimulations.toLocaleString()}
          icon={Database}
          color="#2563eb"
          subtitle="All time"
        />
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={Activity}
          color="#10b981"
          subtitle="Running now"
        />
        <StatCard
          title="Completed Today"
          value={stats.completedToday}
          icon={Zap}
          color="#f59e0b"
          subtitle="+12% from yesterday"
        />
        <StatCard
          title="Avg Compute Time"
          value={stats.avgComputeTime}
          icon={TrendingUp}
          color="#8b5cf6"
          subtitle="Last 100 runs"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Simulation Trend */}
        <div className="lg:col-span-2 border border-border bg-card p-6" data-testid="simulation-trend-chart">
          <h3 className="font-manrope font-bold text-lg mb-4">Simulation Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={simulationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="simulations" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tool Distribution */}
        <div className="border border-border bg-card p-6" data-testid="tool-distribution-chart">
          <h3 className="font-manrope font-bold text-lg mb-4">Tool Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={toolDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {toolDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Simulations */}
      <div className="border border-border bg-card" data-testid="recent-simulations">
        <div className="p-6 border-b border-border">
          <h3 className="font-manrope font-bold text-lg">Recent Simulations</h3>
        </div>
        <div className="divide-y divide-border">
          {recentSimulations.map((sim) => (
            <div key={sim.id} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between">
              <div>
                <p className="font-mono text-sm font-semibold">{sim.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {sim.tool} • {sim.timestamp}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  sim.status === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                }`}
              >
                {sim.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;