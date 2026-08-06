import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import {
  Search, Bell, Sun, Moon, User, MapPin,
  ChevronDown, X
} from 'lucide-react';

const searchSuggestions = [
  { name: 'Nagpur, Maharashtra', type: 'city' },
  { name: 'Wardha District', type: 'district' },
  { name: 'Kamptee, Nagpur', type: 'town' },
  { name: 'Chandrapur, Maharashtra', type: 'city' },
  { name: 'Amravati District', type: 'district' },
];

const notifications = [
  { id: 1, title: 'Flood Alert — Nagpur', message: 'High severity flood detected in Nag River basin.', time: '2 hours ago', type: 'danger', unread: true },
  { id: 2, title: 'Flash Flood — Kamptee', message: 'Critical flooding in residential areas.', time: '3 hours ago', type: 'danger', unread: true },
  { id: 3, title: 'Crop Stress — Wardha', message: 'Waterlogging affecting 12 hectares.', time: '5 hours ago', type: 'warning', unread: true },
  { id: 4, title: 'Analysis Complete', message: 'Satellite analysis for Amravati completed.', time: '1 day ago', type: 'info', unread: false },
];

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const filteredSuggestions = searchSuggestions.filter(s =>
    s.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="h-16 border-b flex items-center justify-between px-6 shrink-0 relative z-20"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}>
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: 'var(--text-tertiary)' }} />
        <input
          type="text"
          placeholder="Search location..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
          style={{
            background: 'var(--bg-hover)',
            color: 'var(--text-primary)',
            border: `1.5px solid ${searchFocused ? 'var(--color-primary)' : 'var(--border-color)'}`,
          }}
        />
        <AnimatePresence>
          {searchFocused && searchValue && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden shadow-lg"
              style={{
                background: 'var(--bg-card-solid)',
                border: '1px solid var(--border-color)',
              }}
            >
              {filteredSuggestions.map((s, i) => (
                <button key={i}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all text-left"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseDown={() => setSearchValue(s.name)}
                >
                  <MapPin className="w-4 h-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
                  <span>{s.name}</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--bg-hover)', color: 'var(--text-tertiary)' }}>
                    {s.type}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 ml-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110 relative"
            style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: 'var(--color-danger)' }}>
              3
            </span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl overflow-hidden"
                style={{
                  background: 'var(--bg-card-solid)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div className="p-4 border-b flex items-center justify-between"
                  style={{ borderColor: 'var(--border-color)' }}>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</h3>
                  <button onClick={() => setShowNotifications(false)}>
                    <X className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id}
                      className="px-4 py-3 border-b transition-all cursor-pointer"
                      style={{
                        borderColor: 'var(--border-color)',
                        background: n.unread ? 'var(--bg-hover)' : 'transparent',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.unread ? '' : 'opacity-0'}`}
                          style={{
                            background: n.type === 'danger' ? 'var(--color-danger)' :
                              n.type === 'warning' ? 'var(--color-warning)' : 'var(--color-info)'
                          }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                          <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'var(--bg-hover)' }}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #10b981, #6366f1)' }}>
              KT
            </div>
            <span className="text-sm font-medium hidden md:block" style={{ color: 'var(--text-primary)' }}>
              Krishna T.
            </span>
            <ChevronDown className="w-3 h-3 hidden md:block" style={{ color: 'var(--text-tertiary)' }} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl overflow-hidden"
                style={{
                  background: 'var(--bg-card-solid)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Krishna Talwekar</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>krishna@terraaid.ai</p>
                </div>
                {['Profile', 'Preferences', 'Help Center', 'Sign Out'].map((item) => (
                  <button key={item}
                    className="w-full px-4 py-2.5 text-sm text-left transition-all flex items-center gap-2"
                    style={{
                      color: item === 'Sign Out' ? 'var(--color-danger)' : 'var(--text-secondary)',
                    }}
                  >
                    <User className="w-4 h-4" />
                    {item}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
