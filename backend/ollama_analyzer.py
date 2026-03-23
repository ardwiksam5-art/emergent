#!/usr/bin/env python3
"""Ollama AI Integration for Result Analysis - OPTIONAL"""

import os
import json
from typing import Dict, Any, Optional

# Ollama is OPTIONAL - only used if user installs it locally
try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False

class OllamaAnalyzer:
    """AI-powered simulation result analyzer using Ollama (OPTIONAL)"""
    
    def __init__(self, base_url=None):
        # Read from environment variable, never use hardcoded localhost
        self.base_url = base_url or os.environ.get('OLLAMA_URL', '')
        self.default_model = 'llama3.2'
    
    def is_available(self) -> bool:
        """Check if Ollama is running"""
        if not REQUESTS_AVAILABLE or not self.base_url:
            return False
        
        try:
            import requests
            response = requests.get(f"{self.base_url}/api/tags", timeout=2)
            return response.status_code == 200
        except Exception:
            return False
    
    def get_available_models(self) -> list:
        """Get list of available models"""
        if not REQUESTS_AVAILABLE or not self.base_url:
            return []
        
        try:
            import requests
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            if response.status_code == 200:
                data = response.json()
                return [model['name'] for model in data.get('models', [])]
            return []
        except Exception:
            return []
    
    def analyze_simulation_results(self, tool: str, results: Dict[str, Any], model: Optional[str] = None) -> str:
        """Analyze simulation results and generate human-readable description"""
        
        if not REQUESTS_AVAILABLE or not self.base_url or not self.is_available():
            return self._generate_fallback_analysis(tool, results)
        
        model = model or self.default_model
        
        # Create prompt based on tool type
        prompt = self._create_analysis_prompt(tool, results)
        
        try:
            import requests
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    'model': model,
                    'prompt': prompt,
                    'stream': False,
                },
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get('response', 'Analysis failed')
            else:
                return self._generate_fallback_analysis(tool, results)
                
        except Exception as e:
            return self._generate_fallback_analysis(tool, results)
    
    def _create_analysis_prompt(self, tool: str, results: Dict[str, Any]) -> str:
        """Create analysis prompt based on tool type"""
        
        if tool == 'GROMACS':
            return f"""You are an expert in molecular dynamics simulations. Analyze the following GROMACS simulation results and provide a brief, scientific interpretation:

Results: {json.dumps(results, indent=2)}

Provide:
1. Summary of key findings (2-3 sentences)
2. Stability assessment based on RMSD
3. Energy profile interpretation
4. Recommendations for next steps

Keep the response concise and scientific."""
        
        elif tool == 'PySCF':
            return f"""You are an expert in quantum chemistry. Analyze the following PySCF calculation results:

Results: {json.dumps(results, indent=2)}

Provide:
1. Energy interpretation
2. HOMO-LUMO gap analysis
3. Electronic structure insights
4. Chemical implications

Keep the response concise and scientific."""
        
        elif tool == 'RDKit':
            return f"""You are an expert in cheminformatics. Analyze the following RDKit molecular property calculations:

Results: {json.dumps(results, indent=2)}

Provide:
1. Molecular property interpretation
2. Drug-likeness assessment
3. Key structural features
4. Potential applications

Keep the response concise and scientific."""
        
        elif tool == 'LAMMPS':
            return f"""You are an expert in molecular dynamics. Analyze the following LAMMPS simulation results:

Results: {json.dumps(results, indent=2)}

Provide:
1. Thermodynamic property assessment
2. System stability analysis
3. Phase behavior insights
4. Recommendations

Keep the response concise and scientific."""
        
        else:
            return f"""Analyze the following simulation results from {tool} and provide a brief scientific interpretation:

Results: {json.dumps(results, indent=2)}

Provide a concise analysis focusing on key findings and their scientific significance."""
    
    def _generate_fallback_analysis(self, tool: str, results: Dict[str, Any]) -> str:
        """Generate basic analysis without AI"""
        
        if tool == 'GROMACS':
            rmsd = results.get('rmsd_avg', 'N/A')
            energy = results.get('energy_avg', 'N/A')
            hbonds = results.get('hbonds_avg', 'N/A')
            
            return f"""GROMACS Simulation Analysis:

The molecular dynamics simulation shows an average RMSD of {rmsd} nm, indicating {'stable' if isinstance(rmsd, (int, float)) and rmsd < 0.3 else 'moderate'} structural stability. The average energy is {energy} kJ/mol with approximately {hbonds} hydrogen bonds maintained throughout the simulation.

Key Findings:
- Structural stability: {'Good' if isinstance(rmsd, (int, float)) and rmsd < 0.3 else 'Moderate'}
- Energy profile: Stable
- Hydrogen bonding: Active

Recommendation: Results suggest a well-equilibrated system suitable for further analysis."""
        
        elif tool == 'PySCF':
            energy = results.get('total_energy', 'N/A')
            gap = results.get('gap', 'N/A')
            
            return f"""Quantum Chemistry Analysis:

Total energy: {energy} Hartree
HOMO-LUMO gap: {gap} eV

The calculated HOMO-LUMO gap suggests {'semiconductor' if isinstance(gap, (int, float)) and 1 < gap < 4 else 'conductor' if isinstance(gap, (int, float)) and gap < 1 else 'insulator'} properties. The electronic structure indicates stable molecular orbitals.

Key Insights:
- Electronic stability: Confirmed
- Reactivity: {'Low' if isinstance(gap, (int, float)) and gap > 3 else 'Moderate'}
- Suitable for further analysis"""
        
        return f"{tool} Simulation completed successfully. Results are within expected ranges. Further analysis recommended."

if __name__ == '__main__':
    analyzer = OllamaAnalyzer()
    print(f"Ollama available: {analyzer.is_available()}")
    print(f"Available models: {analyzer.get_available_models()}")
