import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { routes } from './routes';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import RouteMetaTags from './components/RouteMetaTags';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <Router basename="/tools">
        <RouteMetaTags />
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<AdminDashboard />} />
                {/* Tool Routes */}
                {Object.values(routes.tools).map(({ path, component: Component }) => (
                  <Route key={path} path={path} element={<Component />} />
                ))}
                
                {/* Page Routes */}
                {Object.values(routes.pages).map(({ path, component: Component }) => (
                  <Route key={path} path={path} element={<Component />} />
                ))}
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
