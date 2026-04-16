import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import { UserAuthProvider } from './context/UserAuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import AdRenderer from './components/AdRenderer';

import Home from './pages/Home';
import Maharashtra from './pages/Maharashtra';
import Chandrapur from './pages/Chandrapur';
import Korpana from './pages/Korpana';
import Rajura from './pages/Rajura';
import International from './pages/International';
import National from './pages/National';
import NewsDetail from './pages/NewsDetail';

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
import AdPlansManagement from './pages/AdPlansManagement';
import AdminReports from './pages/AdminReports';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import UserProfile from './pages/UserProfile';
import UserForgotPassword from './pages/UserForgotPassword';
import UserResetPassword from './pages/UserResetPassword';

const AppContent = () => {
  const { pathname } = useLocation();
  const isAdminPath = pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <Navbar />

      {!isAdminPath && (
        <div className="container-editorial py-4">
          <div className="flex justify-center mb-2">
            <AdRenderer placement="header" />
          </div>
        </div>
      )}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/international" element={<International />} />
          <Route path="/national" element={<National />} />
          <Route path="/maharashtra" element={<Maharashtra />} />
          <Route path="/chandrapur" element={<Chandrapur />} />
          <Route path="/korpana" element={<Korpana />} />
          <Route path="/rajura" element={<Rajura />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/forgot-password" element={<UserForgotPassword />} />
          <Route path="/user/reset-password" element={<UserResetPassword />} />
          <Route 
            path="/user/profile" 
            element={
              <UserProtectedRoute>
                <UserProfile />
              </UserProtectedRoute>
            } 
          />
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
            path="/dashboard/plans"
            element={
              <ProtectedRoute>
                <AdPlansManagement />
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
          <Route
            path="/dashboard/reports"
            element={
              <ProtectedRoute>
                <AdminReports />
              </ProtectedRoute>
            }
          />
          <Route path="/advertising" element={<Advertising />} />
          <Route path="/category/:category" element={<CategoryPage />} />
        </Routes>
      </div>
      {!isAdminPath && (
        <>
          <div className="container-editorial py-8 flex justify-center border-t border-editorial-border dark:border-zinc-800">
            <AdRenderer placement="footer" />
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <UserAuthProvider>
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
    </UserAuthProvider>
  );
}

export default App;
