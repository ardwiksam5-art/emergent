#!/usr/bin/env python3
import subprocess
import json

class ToolManager:
    TOOLS = {
        'rdkit': {'name': 'RDKit', 'check': 'python3 -c "import rdkit"'},
        'pyscf': {'name': 'PySCF', 'check': 'python3 -c "import pyscf"'},
        'scipy': {'name': 'SciPy', 'check': 'python3 -c "import scipy"'},
        'matplotlib': {'name': 'Matplotlib', 'check': 'python3 -c "import matplotlib"'},
        'biopython': {'name': 'Biopython', 'check': 'python3 -c "import Bio"'},
    }
    
    @staticmethod
    def check_tool_installed(tool_id):
        if tool_id not in ToolManager.TOOLS:
            return False
        
        # Direct Python import check
        try:
            if tool_id == 'rdkit':
                import rdkit
                return True
            elif tool_id == 'pyscf':
                import pyscf
                return True
            elif tool_id == 'scipy':
                import scipy
                return True
            elif tool_id == 'matplotlib':
                import matplotlib
                return True
            elif tool_id == 'biopython':
                import Bio
                return True
        except ImportError:
            return False
        
        return False
    
    @staticmethod
    def get_tool_version(tool_id):
        """Get version of installed tool"""
        try:
            if tool_id == 'rdkit':
                import rdkit
                return getattr(rdkit, '__version__', 'installed')
            elif tool_id == 'pyscf':
                import pyscf
                return getattr(pyscf, '__version__', 'installed')
            elif tool_id == 'scipy':
                import scipy
                return scipy.__version__
            elif tool_id == 'matplotlib':
                import matplotlib
                return matplotlib.__version__
            elif tool_id == 'biopython':
                import Bio
                return Bio.__version__
        except:
            return 'installed'
        return None
    
    @staticmethod
    def get_all_tools_status():
        status = {}
        for tool_id, tool_info in ToolManager.TOOLS.items():
            is_installed = ToolManager.check_tool_installed(tool_id)
            version = ToolManager.get_tool_version(tool_id) if is_installed else None
            
            status[tool_id] = {
                'name': tool_info['name'],
                'installed': is_installed,
                'version': version,
            }
        return status
    
    @staticmethod
    def install_tool(tool_id):
        return {'success': False, 'message': 'Installation not implemented yet'}
    
    @staticmethod
    def check_for_updates():
        return []
