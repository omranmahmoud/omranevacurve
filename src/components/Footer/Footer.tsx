import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../Logo';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: t('footer.newArrivals'), href: '/new-arrivals' },
      { label: t('footer.bestSellers'), href: '/best-sellers' },
      { label: t('footer.sale'), href: '/sale' },
      { label: t('footer.collections'), href: '/collections' },
      { label: t('footer.giftCards'), href: '/gift-cards' }
    ],
    support: [
      { label: t('footer.contactUs'), href: '/contact' },
      { label: t('footer.faqs'), href: '/faqs' },
      { label: t('footer.shipping'), href: '/shipping' },
      { label: t('footer.returns'), href: '/returns' },
      { label: t('footer.sizeGuide'), href: '/size-guide' }
    ],
    company: [
      { label: t('footer.aboutUs'), href: '/about' },
      { label: t('footer.careers'), href: '/careers' },
      { label: t('footer.storeLocator'), href: '/stores' },
      { label: t('footer.sustainability'), href: '/sustainability' },
      { label: t('footer.press'), href: '/press' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  return (
    <footer className="bg-white border-t">
      {/* Newsletter Section */}
      <div className="py-12 sm:py-16 bg-gradient-to-b from-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t('footer.newsletter.title')}
            </h3>
            <p className="mt-3 text-base sm:text-lg text-gray-600">
              {t('footer.newsletter.subtitle')}
            </p>
            <form className="mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row sm:max-w-md mx-auto gap-3">
                <input
                  type="email"
                  name="email-address"
                  id="email-address"
                  autoComplete="email"
                  required
                  className="w-full px-5 py-3 placeholder-gray-500 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border border-gray-300 rounded-full shadow-sm"
                  placeholder={t('footer.newsletter.placeholder')}
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {t('footer.newsletter.subscribe')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo and Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-block">
              <Logo className="h-12 w-auto text-gray-900" />
            </Link>
            <p className="text-gray-600 max-w-xs">
              {t('footer.description')}
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span>{t('footer.address')}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span>{t('footer.phone')}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span>{t('footer.email')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <details className="group md:open">
                <summary className="flex items-center justify-between cursor-pointer md:cursor-default">
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                    {t(`footer.${title}`)}
                  </h3>
                </summary>
                <ul className="mt-4 space-y-3 group-open:animate-fadeIn">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-base text-gray-600 hover:text-gray-900"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{social.label}</span>
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              © {year} Eva Curves. {t('footer.rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}