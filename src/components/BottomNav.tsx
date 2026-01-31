import { Link, useLocation } from 'react-router-dom';
import { Home, Activity, DollarSign, User } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/activity', icon: Activity, label: 'Activity' },
    { path: '/earnings', icon: DollarSign, label: 'Earnings' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex justify-around items-center h-20 max-w-md mx-auto px-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive(path)
                ? 'text-[#c9a227]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon size={24} strokeWidth={isActive(path) ? 2.5 : 2} />
            <span className={`text-xs mt-1 ${isActive(path) ? 'font-semibold' : ''}`}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
