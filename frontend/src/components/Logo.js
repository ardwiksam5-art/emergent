import React from 'react';
import { Hexagon } from 'lucide-react';

export const Logo = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`} data-testid="pepticascade-logo">
      <Hexagon size={28} className="text-primary" />
      <span className="font-manrope font-extrabold tracking-tight text-xl">
        PeptiCascade
      </span>
    </div>
  );
};