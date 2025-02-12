import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || null);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-salabat-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-ginger-700">e-Salabat IoT</h1>
          <button
            onClick={toggleMobileMenu}
            className="text-ginger-600 hover:text-ginger-900 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white shadow-lg`}>
        <div className="hidden md:flex h-16 items-center px-6 bg-salabat-500">
          <h1 className="text-xl font-bold text-white">e-Salabat IoT</h1>
        </div>
        <nav className="mt-6">
          <div className="px-3 space-y-1">
            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                location.pathname === '/dashboard'
                  ? 'text-salabat-700 bg-salabat-50'
                  : 'text-ginger-600 hover:bg-salabat-50 hover:text-ginger-900'
              }`}
            >
              <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Machine Status
            </Link>
            <Link
              to="/run"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                location.pathname === '/run'
                  ? 'text-salabat-700 bg-salabat-50'
                  : 'text-ginger-600 hover:bg-salabat-50 hover:text-ginger-900'
              }`}
            >
              <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Run Control
            </Link>
            <Link
              to="/logs"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                location.pathname === '/logs'
                  ? 'text-salabat-700 bg-salabat-50'
                  : 'text-ginger-600 hover:bg-salabat-50 hover:text-ginger-900'
              }`}
            >
              <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              System Logs
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                location.pathname === '/about'
                  ? 'text-salabat-700 bg-salabat-50'
                  : 'text-ginger-600 hover:bg-salabat-50 hover:text-ginger-900'
              }`}
            >
              <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </Link>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end h-16">
              <div className="flex items-center">
                <span className="text-ginger-700 mr-4 hidden sm:block">{userEmail}</span>
                <button
                  onClick={handleSignOut}
                  className="bg-ginger-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-ginger-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}