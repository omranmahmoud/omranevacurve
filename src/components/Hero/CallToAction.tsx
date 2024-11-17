import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
      <button className="group relative px-8 py-4 bg-indigo-600 text-white rounded-full text-lg font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200 transition-all duration-300 hover:-translate-y-0.5">
        <span className="flex items-center justify-center">
          Shop Collection
          <ShoppingBag className="ml-2 w-5 h-5 group-hover:transform group-hover:translate-x-1 transition-transform" />
        </span>
      </button>
      <button className="group relative px-8 py-4 bg-white text-gray-700 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-gray-100">
        <span className="flex items-center justify-center">
          Explore Lookbook
          <ArrowRight className="ml-2 w-5 h-5 group-hover:transform group-hover:translate-x-1 transition-transform" />
        </span>
      </button>
    </div>
  );
}