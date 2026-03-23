import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  MessageCircle,
  BarChart3,
  Megaphone,
  LogOut,
  Bell,
  Sparkles,
} from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import NotificationPanel from './NotificationPanel';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/chat', icon: MessageCircle, label: 'Chat' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/poster', icon: Megaphone, label: 'Promo' },
];

export default function NavBar() {
  const { user, signOut } = useAuthContext();
  const { notifications, unreadCount } = useNotifications();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const initial = user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || '?';
  const photoURL = user?.photoURL;

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-gray-800 bg-gray-950">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15">
            <Sparkles size={18} className="text-emerald-400" />
          </div>
          <span className="text-lg font-bold">BizBuddy AI</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 px-3 pt-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                }`
              }
            >
              <Icon size={20} strokeWidth={1.5} />
              <span>{label}</span>
            </NavLink>
          ))}

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(true)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-900 hover:text-gray-200"
          >
            <div className="relative">
              <Bell size={20} strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span>Alerts</span>
          </button>
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-700 bg-gray-800">
              {photoURL ? (
                <img src={photoURL} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-gray-300">{initial}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.displayName || 'User'}</p>
              <p className="truncate text-[11px] text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-gray-950/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'
                }`
              }
            >
              <Icon size={20} strokeWidth={1.5} />
              <span>{label}</span>
            </NavLink>
          ))}

          {/* Notification Bell */}
          <button
            onClick={() => setShowNotifications(true)}
            className="relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] font-medium text-gray-500 transition-colors hover:text-gray-300"
          >
            <div className="relative">
              <Bell size={20} strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span>Alerts</span>
          </button>

          {/* User Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-700 bg-gray-800 transition-colors hover:border-gray-600"
            >
              {photoURL ? (
                <img src={photoURL} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-gray-300">{initial}</span>
              )}
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute bottom-12 right-0 z-50 w-48 animate-scale-in rounded-xl border border-gray-800 bg-gray-900 p-2 shadow-xl">
                  <p className="truncate px-2 py-1 text-xs text-gray-500">
                    {user?.email}
                  </p>
                  <button
                    onClick={() => { setShowMenu(false); signOut(); }}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Notification Panel */}
      {showNotifications && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onRentalReturned={() => {}}
        />
      )}
    </>
  );
}
