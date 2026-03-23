import React, { useEffect, useState } from 'react';
import { Clock, Pause, Play, X } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const QueuePage = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API}/jobs/queue`);
      setJobs(response.data);
    } catch (error) {
      console.log('Using mock data');
      setJobs([
        {
          id: 1,
          name: 'GROMACS_MD_Peptide_001',
          tool: 'GROMACS',
          status: 'running',
          progress: 67,
          startTime: '10:23 AM',
          estimatedTime: '4 min',
        },
        {
          id: 2,
          name: 'PySCF_DFT_Calculation',
          tool: 'PySCF',
          status: 'running',
          progress: 34,
          startTime: '10:45 AM',
          estimatedTime: '12 min',
        },
        {
          id: 3,
          name: 'RDKit_Conformer_Gen',
          tool: 'RDKit',
          status: 'queued',
          progress: 0,
          startTime: '-',
          estimatedTime: '2 min',
        },
        {
          id: 4,
          name: 'LAMMPS_Polymer_Sim',
          tool: 'LAMMPS',
          status: 'paused',
          progress: 89,
          startTime: '9:12 AM',
          estimatedTime: '1 min',
        },
      ]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return '#10b981';
      case 'queued':
        return '#f59e0b';
      case 'paused':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const handlePause = (jobId) => {
    console.log('Pause job:', jobId);
  };

  const handleResume = (jobId) => {
    console.log('Resume job:', jobId);
  };

  const handleCancel = (jobId) => {
    console.log('Cancel job:', jobId);
  };

  return (
    <div className="space-y-6" data-testid="queue-page">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2">Running</p>
          <p className="text-3xl font-manrope font-extrabold text-green-600">
            {jobs.filter(j => j.status === 'running').length}
          </p>
        </div>
        <div className="border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2">Queued</p>
          <p className="text-3xl font-manrope font-extrabold text-amber-600">
            {jobs.filter(j => j.status === 'queued').length}
          </p>
        </div>
        <div className="border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2">Paused</p>
          <p className="text-3xl font-manrope font-extrabold text-purple-600">
            {jobs.filter(j => j.status === 'paused').length}
          </p>
        </div>
        <div className="border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2">Total</p>
          <p className="text-3xl font-manrope font-extrabold text-primary">
            {jobs.length}
          </p>
        </div>
      </div>

      {/* Jobs List */}
      <div className="border border-border bg-card" data-testid="jobs-list">
        <div className="p-6 border-b border-border">
          <h3 className="font-manrope font-bold text-lg">Job Queue</h3>
        </div>
        
        <div className="divide-y divide-border">
          {jobs.map((job) => (
            <div key={job.id} className="p-6 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock size={18} style={{ color: getStatusColor(job.status) }} />
                    <h4 className="font-mono font-semibold">{job.name}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
                      {job.tool}
                    </span>
                    <span>Started: {job.startTime}</span>
                    <span>ETA: {job.estimatedTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {job.status === 'running' && (
                    <button
                      onClick={() => handlePause(job.id)}
                      className="p-2 hover:bg-muted rounded-md transition-colors"
                      data-testid={`pause-job-${job.id}`}
                    >
                      <Pause size={16} />
                    </button>
                  )}
                  {job.status === 'paused' && (
                    <button
                      onClick={() => handleResume(job.id)}
                      className="p-2 hover:bg-muted rounded-md transition-colors"
                      data-testid={`resume-job-${job.id}`}
                    >
                      <Play size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleCancel(job.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-md transition-colors"
                    data-testid={`cancel-job-${job.id}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {job.status === 'queued' ? 'Waiting to start...' : `Progress: ${job.progress}%`}
                  </span>
                  <span className="font-mono font-bold" style={{ color: getStatusColor(job.status) }}>
                    {job.status.toUpperCase()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{
                      width: `${job.progress}%`,
                      backgroundColor: getStatusColor(job.status),
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueuePage;