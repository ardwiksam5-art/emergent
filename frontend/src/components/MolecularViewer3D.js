import React, { useEffect, useRef } from 'react';

const MolecularViewer3D = ({ pdbData, width = '100%', height = '500px', backgroundColor = '#ffffff' }) => {
  const viewerRef = useRef(null);
  const viewerInstanceRef = useRef(null);

  useEffect(() => {
    if (!viewerRef.current || !pdbData) return;

    // Dynamically import 3Dmol
    const load3Dmol = async () => {
      if (window.$3Dmol) {
        initViewer();
      } else {
        // Load 3Dmol from CDN
        const script = document.createElement('script');
        script.src = 'https://3Dmol.csb.pitt.edu/build/3Dmol-min.js';
        script.onload = () => initViewer();
        document.body.appendChild(script);
      }
    };

    const initViewer = () => {
      const viewer = window.$3Dmol.createViewer(viewerRef.current, {
        backgroundColor: backgroundColor,
      });

      // Add model from PDB data
      viewer.addModel(pdbData, 'pdb');
      
      // Set style
      viewer.setStyle({}, {
        cartoon: { color: 'spectrum' },
        stick: { radius: 0.15 },
      });
      
      viewer.zoomTo();
      viewer.render();
      viewer.zoom(1.2, 1000);

      viewerInstanceRef.current = viewer;
    };

    load3Dmol();

    return () => {
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.clear();
      }
    };
  }, [pdbData, backgroundColor]);

  return (
    <div 
      ref={viewerRef} 
      style={{ width, height, position: 'relative' }}
      data-testid="molecular-viewer-3d"
    />
  );
};

export default MolecularViewer3D;