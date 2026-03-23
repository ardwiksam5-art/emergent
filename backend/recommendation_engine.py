#!/usr/bin/env python3
"""Smart Recommendations Engine"""

import json
from pathlib import Path
from typing import Dict, Any, List
import statistics

class RecommendationEngine:
    """Analyzes historical simulations and provides smart recommendations"""
    
    def __init__(self, simulations_file='/app/backend/simulations_2880.json'):
        self.simulations_file = Path(simulations_file)
        self.simulations = self._load_simulations()
    
    def _load_simulations(self) -> List[Dict]:
        """Load simulations from JSON file"""
        if self.simulations_file.exists():
            with open(self.simulations_file, 'r') as f:
                return json.load(f)
        return []
    
    def get_recommendations(self, peptide: str, metal: str, tool: str) -> Dict[str, Any]:
        """Get smart recommendations based on historical data"""
        
        # Find similar simulations
        similar = self._find_similar_simulations(peptide, metal, tool)
        
        if not similar:
            return self._get_default_recommendations(tool)
        
        # Analyze successful simulations
        successful = [s for s in similar if s['status'] == 'completed']
        
        if not successful:
            return self._get_default_recommendations(tool)
        
        # Calculate statistics from successful runs
        stats = self._calculate_statistics(successful, tool)
        
        # Generate recommendations
        recommendations = {
            'similar_runs': len(similar),
            'successful_runs': len(successful),
            'confidence_level': min(95, len(successful) * 10),  # Max 95%
            'parameters': self._recommend_parameters(stats, tool),
            'expected_results': self._predict_results(stats, tool),
            'notes': self._generate_notes(peptide, metal, similar),
        }
        
        return recommendations
    
    def _find_similar_simulations(self, peptide: str, metal: str, tool: str) -> List[Dict]:
        """Find similar simulations in database"""
        similar = []
        
        for sim in self.simulations:
            if sim['tool'] == tool:
                # Exact match
                if sim.get('peptide') == peptide and sim.get('metal') == metal:
                    similar.append(sim)
                # Same peptide, different metal
                elif sim.get('peptide') == peptide:
                    similar.append(sim)
                # Same metal, different peptide
                elif sim.get('metal') == metal:
                    similar.append(sim)
        
        return similar[:50]  # Limit to 50 most relevant
    
    def _calculate_statistics(self, simulations: List[Dict], tool: str) -> Dict[str, Any]:
        """Calculate statistics from successful simulations"""
        stats = {}
        
        if tool == 'GROMACS':
            rmsd_values = [s['results'].get('rmsd_avg') for s in simulations if s['results'].get('rmsd_avg')]
            energy_values = [s['results'].get('energy_avg') for s in simulations if s['results'].get('energy_avg')]
            hbonds_values = [s['results'].get('hbonds_avg') for s in simulations if s['results'].get('hbonds_avg')]
            
            if rmsd_values:
                stats['rmsd_avg'] = statistics.mean(rmsd_values)
                stats['rmsd_std'] = statistics.stdev(rmsd_values) if len(rmsd_values) > 1 else 0
            if energy_values:
                stats['energy_avg'] = statistics.mean(energy_values)
            if hbonds_values:
                stats['hbonds_avg'] = statistics.mean(hbonds_values)
        
        elif tool == 'PySCF':
            energy_values = [s['results'].get('total_energy') for s in simulations if s['results'].get('total_energy')]
            gap_values = [s['results'].get('gap') for s in simulations if s['results'].get('gap')]
            
            if energy_values:
                stats['energy_avg'] = statistics.mean(energy_values)
            if gap_values:
                stats['gap_avg'] = statistics.mean(gap_values)
        
        elif tool == 'RDKit':
            mw_values = [s['results'].get('molecular_weight') for s in simulations if s['results'].get('molecular_weight')]
            logp_values = [s['results'].get('logp') for s in simulations if s['results'].get('logp')]
            
            if mw_values:
                stats['mw_avg'] = statistics.mean(mw_values)
            if logp_values:
                stats['logp_avg'] = statistics.mean(logp_values)
        
        return stats
    
    def _recommend_parameters(self, stats: Dict[str, Any], tool: str) -> Dict[str, Any]:
        """Recommend optimal parameters based on statistics"""
        
        if tool == 'GROMACS':
            rmsd_avg = stats.get('rmsd_avg', 0.25)
            # Recommend longer simulation if RMSD is high
            nsteps = 100000 if rmsd_avg > 0.3 else 50000
            
            return {
                'nsteps': nsteps,
                'dt': '0.002 ps',
                'temperature': '300 K',
                'pressure': '1 bar',
            }
        
        elif tool == 'PySCF':
            return {
                'basis': '6-31g*',
                'method': 'DFT (B3LYP)',
                'convergence': '1e-6',
            }
        
        elif tool == 'RDKit':
            return {
                'num_conformers': 50,
                'rmsd_threshold': '0.5 Å',
                'force_field': 'MMFF94',
            }
        
        elif tool == 'LAMMPS':
            return {
                'timesteps': 50000,
                'timestep_size': '1 fs',
                'ensemble': 'NPT',
            }
        
        return {}
    
    def _predict_results(self, stats: Dict[str, Any], tool: str) -> Dict[str, str]:
        """Predict expected results"""
        
        if tool == 'GROMACS':
            rmsd_avg = stats.get('rmsd_avg', 0.25)
            energy_avg = stats.get('energy_avg', -50000)
            hbonds_avg = stats.get('hbonds_avg', 15)
            
            return {
                'RMSD': f'~{rmsd_avg:.2f} ± {stats.get("rmsd_std", 0.05):.2f} nm',
                'Energy': f'~{energy_avg:.0f} kJ/mol',
                'H-bonds': f'~{hbonds_avg:.0f} bonds',
                'Stability': 'High' if rmsd_avg < 0.3 else 'Moderate',
            }
        
        elif tool == 'PySCF':
            gap_avg = stats.get('gap_avg', 0.8)
            return {
                'HOMO-LUMO gap': f'~{gap_avg:.2f} eV',
                'Electronic state': 'Stable',
                'Reactivity': 'Moderate',
            }
        
        return {}
    
    def _generate_notes(self, peptide: str, metal: str, similar: List[Dict]) -> str:
        """Generate helpful notes"""
        success_rate = len([s for s in similar if s['status'] == 'completed']) / len(similar) if similar else 0
        
        if success_rate > 0.9:
            return f"This {peptide}-{metal} combination has a {success_rate*100:.0f}% success rate in our database. High confidence recommendations."
        elif success_rate > 0.7:
            return f"Good success rate ({success_rate*100:.0f}%) for {peptide}-{metal}. Recommendations are reliable."
        else:
            return f"Limited data for {peptide}-{metal}. Recommendations based on similar systems."
    
    def _get_default_recommendations(self, tool: str) -> Dict[str, Any]:
        """Get default recommendations when no historical data available"""
        return {
            'similar_runs': 0,
            'successful_runs': 0,
            'confidence_level': 50,
            'parameters': self._recommend_parameters({}, tool),
            'expected_results': {},
            'notes': 'No historical data available. Using default parameters.',
        }

if __name__ == '__main__':
    engine = RecommendationEngine()
    recs = engine.get_recommendations('GEVAL', 'Cu', 'GROMACS')
    print(json.dumps(recs, indent=2))
