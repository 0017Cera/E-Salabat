// Mock Supabase client for frontend-only development
const MOCK_CREDENTIALS = {
  email: 'admin@email.com',
  password: 'password'
};

const mockUser = {
  id: '1',
  email: MOCK_CREDENTIALS.email
};

export const supabase = {
  auth: {
    signUp: async ({ email }: { email: string, password: string }) => {
      if (email === MOCK_CREDENTIALS.email) {
        return { error: { message: 'User already exists' } };
      }
      return { data: { user: { ...mockUser, email } }, error: null };
    },
    signInWithPassword: async ({ email, password }: { email: string, password: string }) => {
      if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
        return { data: { user: mockUser }, error: null };
      }
      return { data: { user: null }, error: { message: 'Invalid login credentials' } };
    },
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: { user: mockUser } }, error: null }),
    getUser: async () => ({ data: { user: mockUser }, error: null })
  }
};