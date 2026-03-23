import React, { useState } from 'react';
import { Upload as UploadIcon, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SUPPORTED_FORMATS = [
  { ext: 'PDB', desc: 'Protein Data Bank' },
  { ext: 'XYZ', desc: 'XYZ Coordinates' },
  { ext: 'MOL', desc: 'MDL Molfile' },
  { ext: 'SDF', desc: 'Structure Data File' },
  { ext: 'FASTA', desc: 'FASTA Sequence' },
  { ext: 'GenBank', desc: 'GenBank Format' },
  { ext: 'CSV', desc: 'Comma Separated' },
  { ext: 'JSON', desc: 'JSON Data' },
  { ext: 'GRO', desc: 'GROMACS Structure' },
  { ext: 'TPR', desc: 'GROMACS Run Input' },
  { ext: 'XTC', desc: 'GROMACS Trajectory' },
  { ext: 'TRR', desc: 'GROMACS Trajectory Full' },
];

export const UploadPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      status: 'pending',
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const uploadFiles = async () => {
    setUploadStatus('uploading');
    
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i].file);
        
        await axios.post(`${API}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        setFiles(prev => {
          const updated = [...prev];
          updated[i].status = 'uploaded';
          return updated;
        });
      }
      
      setUploadStatus('success');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
    }
  };

  return (
    <div className="space-y-6" data-testid="upload-page">
      {/* Upload Zone */}
      <div className="border border-border bg-card p-6">
        <h3 className="font-manrope font-bold text-lg mb-4">Upload Files</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          data-testid="file-dropzone"
        >
          <UploadIcon size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">Drag and drop files here</p>
          <p className="text-sm text-muted-foreground mb-4">or</p>
          <label className="inline-block">
            <input
              type="file"
              multiple
              onChange={handleChange}
              className="hidden"
              data-testid="file-input"
            />
            <span className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 cursor-pointer inline-block transition-colors">
              Browse Files
            </span>
          </label>
        </div>
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="border border-border bg-card" data-testid="uploaded-files-list">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-manrope font-bold text-lg">Uploaded Files ({files.length})</h3>
            <button
              onClick={uploadFiles}
              disabled={uploadStatus === 'uploading'}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
              data-testid="upload-button"
            >
              {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload All'}
            </button>
          </div>
          
          <div className="divide-y divide-border">
            {files.map((file, index) => (
              <div key={index} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-muted-foreground" />
                  <div>
                    <p className="font-mono text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                </div>
                <div>
                  {file.status === 'uploaded' && (
                    <CheckCircle size={20} className="text-green-600" />
                  )}
                  {file.status === 'pending' && (
                    <span className="text-xs text-muted-foreground">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Message */}
      {uploadStatus === 'success' && (
        <div className="border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 p-4 rounded-md flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600" />
          <p className="text-sm font-medium text-green-800 dark:text-green-400">All files uploaded successfully!</p>
        </div>
      )}
      
      {uploadStatus === 'error' && (
        <div className="border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-4 rounded-md flex items-center gap-3">
          <AlertCircle size={20} className="text-red-600" />
          <p className="text-sm font-medium text-red-800 dark:text-red-400">Upload failed. Please try again.</p>
        </div>
      )}

      {/* Supported Formats */}
      <div className="border border-border bg-card p-6">
        <h3 className="font-manrope font-bold text-lg mb-4">Supported Formats</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SUPPORTED_FORMATS.map((format) => (
            <div key={format.ext} className="border border-border p-3 rounded-md">
              <p className="font-mono font-bold text-sm text-primary">.{format.ext}</p>
              <p className="text-xs text-muted-foreground mt-1">{format.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;