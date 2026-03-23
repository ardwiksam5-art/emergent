#!/usr/bin/env python3
"""Structure Generation from Sequences and Formulas"""

from Bio.PDB import PDBIO, StructureBuilder
from Bio.Seq import Seq
from Bio.SeqUtils import seq3
import tempfile
from pathlib import Path
from typing import Optional

class StructureGenerator:
    """Generate 3D structures from sequences and formulas"""
    
    @staticmethod
    def sequence_to_pdb(sequence: str, output_file: Optional[str] = None) -> str:
        """Convert peptide sequence to PDB file"""
        
        # Clean sequence
        sequence = sequence.strip().upper()
        if sequence.startswith('>'):
            lines = sequence.split('\n')
            sequence = ''.join(lines[1:]).replace(' ', '')
        
        # Create structure using Bio.PDB
        builder = StructureBuilder.StructureBuilder()
        builder.init_structure("peptide")
        builder.init_seg("A")
        builder.init_model(0)
        builder.init_chain("A")
        
        # Simple backbone coordinates (placeholder - real implementation would use proper geometry)
        x, y, z = 0.0, 0.0, 0.0
        
        for i, aa in enumerate(sequence):
            res_name = seq3(aa).upper()
            builder.init_residue(res_name, " ", i+1, " ")
            
            # Add backbone atoms (simplified)
            builder.init_atom("N", (x, y, z), 0, 1, " ", "N", element="N")
            builder.init_atom("CA", (x+1.5, y, z), 0, 1, " ", "CA", element="C")
            builder.init_atom("C", (x+3.0, y, z), 0, 1, " ", "C", element="C")
            builder.init_atom("O", (x+3.5, y, z+1.2), 0, 1, " ", "O", element="O")
            
            x += 3.8  # Move to next residue
        
        structure = builder.get_structure()
        
        # Save to PDB file
        if output_file is None:
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdb')
            output_file = temp_file.name
        
        io = PDBIO()
        io.set_structure(structure)
        io.save(output_file)
        
        return output_file
    
    @staticmethod
    def formula_to_xyz(formula: str, output_file: Optional[str] = None) -> str:
        """Convert molecular formula to XYZ file (simplified)"""
        
        # Parse formula
        import re
        elements = re.findall(r'([A-Z][a-z]?)(\d*)', formula)
        
        # Create simple XYZ file
        if output_file is None:
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.xyz', mode='w')
            output_file = temp_file.name
        
        atoms = []
        x, y, z = 0.0, 0.0, 0.0
        
        for element, count in elements:
            count = int(count) if count else 1
            for i in range(count):
                atoms.append(f"{element} {x} {y} {z}")
                x += 1.5
        
        with open(output_file, 'w') as f:
            f.write(f"{len(atoms)}\n")
            f.write(f"Generated from formula: {formula}\n")
            for atom in atoms:
                f.write(atom + '\n')
        
        return output_file

if __name__ == '__main__':
    # Test
    gen = StructureGenerator()
    pdb_file = gen.sequence_to_pdb("GEVAL")
    print(f"Generated PDB: {pdb_file}")
    
    xyz_file = gen.formula_to_xyz("H2O")
    print(f"Generated XYZ: {xyz_file}")
