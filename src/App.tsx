import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { About } from './pages/About';
import { Logs } from './pages/Logs';
import { Run } from './pages/Run';
import { AuthGuard } from './components/AuthGuard';
import { Layout } from './components/Layout';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Layout>
                <Dashboard />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/about"
          element={
            <AuthGuard>
              <Layout>
                <About />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/logs"
          element={
            <AuthGuard>
              <Layout>
                <Logs />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/run"
          element={
            <AuthGuard>
              <Layout>
                <Run />
              </Layout>
            </AuthGuard>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App