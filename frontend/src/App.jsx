import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Maharashtra from './pages/Maharashtra';
import Chandrapur from './pages/Chandrapur';
import Korpana from './pages/Korpana';
import Rajura from './pages/Rajura';
import NewsDetail from './pages/NewsDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateNews from './pages/CreateNews';
import EditNews from './pages/EditNews';
import ManageNews from './pages/ManageNews';
import Advertising from './pages/Advertising';
import CategoryPage from './pages/CategoryPage';
import ModerationDashboard from './pages/ModerationDashboard';
import AdsManagement from './pages/AdsManagement';
import AdBookingsManagement from './pages/AdBookingsManagement';
import AdAnalytics from './pages/AdAnalytics';

const AppContent = () => {
  const { pathname } = useLocation();
  const isAdminPath = pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/maharashtra" element={<Maharashtra />} />
          <Route path="/chandrapur" element={<Chandrapur />} />
          <Route path="/korpana" element={<Korpana />} />
          <Route path="/rajura" element={<Rajura />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          <Route
            path="/dashboard/moderation"
            element={
              <ProtectedRoute>
                <ModerationDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/ads"
            element={
              <ProtectedRoute>
                <AdsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/ad-bookings"
            element={
              <ProtectedRoute>
                <AdBookingsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/analytics"
            element={
              <ProtectedRoute>
                <AdAnalytics />
              </ProtectedRoute>
            }
          />
          <Route path="/advertising" element={<Advertising />} />
          <Route path="/category/:category" element={<CategoryPage />} />
        </Routes>
      </div>
      {!isAdminPath && <Footer />}
    </div>
  );
};

function App() {
  return (
    <NewsProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppContent />
      </Router>
    </NewsProvider>
  );
}

export default App;
