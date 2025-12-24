import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Local from './pages/Local';
import National from './pages/National';
import International from './pages/International';
import NewsDetail from './pages/NewsDetail';
import Login from './pages/Login';

// Protected Pages (Reporter Dashboard)
import Dashboard from './pages/Dashboard';
import CreateNews from './pages/CreateNews';
import EditNews from './pages/EditNews';
import ManageNews from './pages/ManageNews';

function App() {
  return (
    <NewsProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/local" element={<Local />} />
            <Route path="/national" element={<National />} />
            <Route path="/international" element={<International />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/create"
              element={
                <ProtectedRoute>
                  <CreateNews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/edit/:id"
              element={
                <ProtectedRoute>
                  <EditNews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/manage"
              element={
                <ProtectedRoute>
                  <ManageNews />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </NewsProvider>
  );
}

export default App;

