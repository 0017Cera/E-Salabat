import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    authService.getCurrentUser()
      .then(user => {
        setUser(user);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}