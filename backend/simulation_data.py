import json
import random
from datetime import datetime, timedelta

def generate_2880_simulations():
    tools = ['GROMACS', 'RDKit', 'PySCF', 'SciPy', 'LAMMPS', 'Avogadro', 'Plotly']
    statuses = ['completed', 'failed', 'running']
    peptides = ['GEVAL', 'HEDRK', 'MCPTW', 'AVILG', 'QKWER', 'TYNPL', 'FGHIS', 'CDMVW']
    metals = ['Cu', 'Zn', 'Fe', 'Mg', 'Ca', 'Mn', 'Co', 'Ni']
    
    simulations = []
    
    for i in range(2880):
        tool = random.choice(tools)
        status_weights = [0.85, 0.10, 0.05]
        status = random.choices(statuses, weights=status_weights)[0]
        
        peptide = random.choice(peptides)
        metal = random.choice(metals)
        
        if tool == 'GROMACS':
            results = {
                'rmsd_avg': round(random.uniform(0.1, 0.5), 3),
                'energy_avg': round(random.uniform(-55000, -45000), 2),
                'hbonds_avg': random.randint(8, 25),
            }
        elif tool == 'RDKit':
            results = {
                'molecular_weight': round(random.uniform(200, 800), 2),
                'logp': round(random.uniform(-2, 5), 2),
            }
        elif tool == 'PySCF':
            results = {
                'total_energy': round(random.uniform(-200, -50), 4),
                'gap': round(random.uniform(0.4, 1.2), 4),
            }
        else:
            results = {}
        
        simulation = {
            'id': i + 1,
            'name': f"{tool}_{peptide}_{metal}_{str(i + 1).zfill(4)}",
            'tool': tool,
            'status': status,
            'peptide': peptide,
            'metal': metal,
            'date': (datetime.now() - timedelta(days=random.randint(0, 365))).strftime('%Y-%m-%d'),
            'duration': f"{random.randint(1, 120)}m {random.randint(0, 59)}s",
            'results': results if status == 'completed' else {},
        }
        
        simulations.append(simulation)
    
    return simulations

if __name__ == '__main__':
    sims = generate_2880_simulations()
    with open('/app/backend/simulations_2880.json', 'w') as f:
        json.dump(sims, f, indent=2)
    print(f'Generated {len(sims)} simulations')
