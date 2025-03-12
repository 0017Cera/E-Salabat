import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [_userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || null);
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-salabat-50 flex flex-col">
      {/* Main content */}
      <main className="flex-1 pb-16">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center px-3 py-2 text-sm ${
              location.pathname === '/dashboard'
                ? 'text-salabat-600'
                : 'text-gray-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </Link>

          <Link
            to="/run"
            className={`flex flex-col items-center px-3 py-2 text-sm ${
              location.pathname === '/run'
                ? 'text-salabat-600'
                : 'text-gray-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Run</span>
          </Link>

          <Link
            to="/logs"
            className={`flex flex-col items-center px-3 py-2 text-sm ${
              location.pathname === '/logs'
                ? 'text-salabat-600'
                : 'text-gray-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>History</span>
          </Link>

          <Link
            to="/about"
            className={`flex flex-col items-center px-3 py-2 text-sm ${
              location.pathname === '/about'
                ? 'text-salabat-600'
                : 'text-gray-600'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>About</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}