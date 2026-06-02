import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
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
                </Routes>
              </main>
              <Footer />
            </div>
          </ShopProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
