import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Background } from './Background';
import { Badge } from './Badge';
import { TrustBadges } from './TrustBadges';
import { useStore } from '../../context/StoreContext';
import { useTranslation } from 'react-i18next';

export function Hero() {
  const { hero, loading, error } = useStore();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-indigo-50 via-white to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="relative">
          <Background />
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32">
            <div className="text-center">
              <Badge />
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mt-8">
                {t('hero.welcome')}
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                {t('hero.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hero) return null;

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="relative">
        <Background />
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32 pb-32">
          <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10 space-y-8 text-center lg:text-left">
              <Badge />

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 animate-fadeIn">
                  <span className="block">{hero.title}</span>
                  <span className="inline-block bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {t('hero.collection')}
                  </span>
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 animate-fadeIn">
                  {hero.subtitle}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fadeIn">
                <button className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 text-white rounded-full text-base sm:text-lg font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200 transition-all duration-300 hover:-translate-y-0.5">
                  <span className="flex items-center justify-center">
                    {hero.primaryButtonText}
                    <ShoppingBag className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-gray-100">
                  <span className="flex items-center justify-center">
                    {hero.secondaryButtonText}
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
              
              <div className="hidden lg:block">
                <TrustBadges />
              </div>
            </div>

            <div className="relative mt-12 lg:mt-0">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl transform lg:translate-x-10">
                <img
                  className="w-full h-full object-cover object-center scale-105 hover:scale-110 transition-transform duration-700"
                  src={hero.image}
                  alt="Fashion model showcasing latest collection"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50" />
              <div className="absolute -top-4 -right-4 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50" />
            </div>
            
            <div className="mt-12 lg:hidden">
              <TrustBadges />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}