import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { ShopProvider } from "./context/ShopContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import UserDashboard from "./pages/UserDashboard";
import GoogleCallback from "./pages/GoogleCallback";
import Configurator from "./pages/Configurator";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookieBanner from "./components/common/CookieBanner";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <LanguageProvider>
        <AuthProvider>
          <ShopProvider>
            <div className="min-h-screen flex flex-col font-sans text-slate-800">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/auth/google/callback" element={<GoogleCallback />} />
                  <Route path="/configurator" element={<Configurator />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                </Routes>
              </main>
              <Footer />
              <CookieBanner />
            </div>
          </ShopProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
