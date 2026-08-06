import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ScanSearch, AlertTriangle, Leaf,
  Clock, FileText, Settings, Globe, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  ScanSearch: <ScanSearch className="w-5 h-5" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5" />,
  Leaf: <Leaf className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
  { id: 'analyze', label: 'Analyze Region', icon: 'ScanSearch', path: '/dashboard/analyze' },
  { id: 'alerts', label: 'Disaster Alerts', icon: 'AlertTriangle', path: '/dashboard/alerts' },
  { id: 'crop', label: 'Crop Health', icon: 'Leaf', path: '/dashboard/crop-health' },
  { id: 'timeline', label: 'Timeline', icon: 'Clock', path: '/dashboard/timeline' },
  { id: 'reports', label: 'Reports', icon: 'FileText', path: '/dashboard/reports' },
  { id: 'settings', label: 'Settings', icon: 'Settings', path: '/dashboard/settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen sticky top-0 flex flex-col border-r z-30 shrink-0"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center shrink-0">
          <Globe className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold whitespace-nowrap"
            style={{ fontFamily: 'Outfit', color: 'var(--text-primary)' }}
          >
            Terra<span className="text-gradient-primary">Aid</span>
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === '/dashboard' && location.pathname === '/dashboard');

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{iconMap[item.icon]}</span>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {item.label}
                </motion.span>
              )}
              {!collapsed && item.id === 'alerts' && (
                <span className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: 'var(--color-danger)' }}>
                  3
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-item w-full"
          style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
