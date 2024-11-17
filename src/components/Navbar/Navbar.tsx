import React, { useState, useEffect } from 'react';
import { Menu, X, Search, User, ChevronDown } from 'lucide-react';
import { NavLinks } from './NavLinks';
import { NavActions } from './NavActions';
import { MobileMenu } from './MobileMenu';
import { Link } from 'react-router-dom';
import { Logo } from '../Logo';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 lg:h-20 flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute left-0 block w-6 h-0.5 transform transition-all duration-300 ease-out bg-gray-600 ${
                  isMobileMenuOpen 
                    ? 'rotate-45 translate-y-0 top-3' 
                    : '-translate-y-1 top-3'
                }`}
              />
              <span
                className={`absolute left-0 top-3 block w-6 h-0.5 bg-gray-600 transition-opacity duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 block w-6 h-0.5 transform transition-all duration-300 ease-out bg-gray-600 ${
                  isMobileMenuOpen 
                    ? '-rotate-45 translate-y-0 top-3' 
                    : 'translate-y-1 top-3'
                }`}
              />
            </div>
          </button>

          {/* Logo */}
          <div className="flex-shrink-0 lg:ml-0">
            <Link to="/" className="flex items-center gap-2 group">
              <Logo className="h-12 w-auto text-gray-900 group-hover:text-indigo-600 transition-colors" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            <NavLinks />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <NavActions />
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}