import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Upload, 
  Beaker, 
  BarChart3, 
  Eye, 
  Clock, 
  Download, 
  Settings,
  HelpCircle,
  ChevronLeft,
  Moon,
  Sun
} from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../contexts/ThemeContext';

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/upload', icon: Upload, label: 'Data Upload' },
  { path: '/simulation', icon: Beaker, label: 'Simulation Studio' },
  { path: '/results', icon: Eye, label: 'Results Viewer' },
  { path: '/visualization', icon: BarChart3, label: 'Visualization Lab' },
  { path: '/queue', icon: Clock, label: 'Job Queue' },
  { path: '/export', icon: Download, label: 'Export Center' },
  { path: '/settings', icon: Settings, label: 'Settings' },
  { path: '/help', icon: HelpCircle, label: 'Help' },
];

export const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen bg-background" data-testid="app-layout">
      {/* Sidebar */}
      <aside
        className={`border-r border-border bg-card transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        } flex flex-col`}
        data-testid="sidebar"
      >
        {/* Logo */}
        <div className="h-16 border-b border-border flex items-center justify-between px-4">
          {!collapsed && <Logo />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            data-testid="sidebar-toggle"
          >
            <ChevronLeft
              size={20}
              className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Icon size={20} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6" data-testid="header">
          <h1 className="text-xl font-manrope font-bold">
            {navItems.find(item => item.path === location.pathname)?.label || 'PeptiCascade'}
          </h1>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              data-testid="theme-toggle"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6" data-testid="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};