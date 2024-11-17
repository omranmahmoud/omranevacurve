import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { Featured } from './components/Featured/Featured';
import { CategorySlider } from './components/Categories/CategorySlider';
import { ProductGrid } from './components/ProductGrid/ProductGrid';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AdminLayout } from './components/Admin/AdminLayout';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { LoginPage } from './components/Auth/LoginPage';
import { RegisterPage } from './components/Auth/RegisterPage';
import { Footer } from './components/Footer/Footer';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ProfileLayout } from './components/Profile/ProfileLayout';
import { ScrollToTop } from './components/Common/ScrollToTop';
import { WhatsAppButton } from './components/Common/WhatsAppButton';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <CurrencyProvider>
            <CartProvider>
              <WishlistProvider>
                <ScrollToTop />
                <Toaster position="top-right" />
                <WhatsAppButton />
                <Routes>
                  {/* Main Store Routes */}
                  <Route path="/" element={
                    <>
                      <Navbar />
                      <main>
                        <Hero />
                        <Featured />
                        <CategorySlider />
                        <ProductGrid />
                      </main>
                      <Footer />
                    </>
                  } />

                  <Route path="/products" element={
                    <>
                      <Navbar />
                      <ProductsPage />
                      <Footer />
                    </>
                  } />

                  <Route path="/product/:id" element={
                    <>
                      <Navbar />
                      <ProductDetailsPage />
                      <Footer />
                    </>
                  } />

                  {/* Profile Routes */}
                  <Route path="/profile/*" element={
                    <ProtectedRoute>
                      <ProfileLayout />
                    </ProtectedRoute>
                  } />

                  {/* Admin Routes */}
                  <Route path="/admin/*" element={
                    <ProtectedRoute requireAdmin>
                      <AdminLayout />
                    </ProtectedRoute>
                  } />

                  {/* Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </WishlistProvider>
            </CartProvider>
          </CurrencyProvider>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;