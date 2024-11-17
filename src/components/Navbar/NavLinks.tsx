import React from 'react';
import { ChevronDown } from 'lucide-react';

export function NavLinks() {
  return (
    <div className="flex items-center gap-8">
      {['New In', 'Women', 'Men', 'Accessories', 'Sale'].map((item) => (
        <div key={item} className="relative group">
          <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium transition-colors py-2">
            {item}
            <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
          </button>

          {/* Dropdown */}
          <div className="absolute top-full left-0 w-48 pt-4 hidden group-hover:block">
            <div className="bg-white rounded-lg shadow-xl ring-1 ring-gray-200 p-2">
              <div className="py-1">
                {['Best Sellers', 'New Arrivals', 'Sale Items'].map((subItem) => (
                  <a
                    key={subItem}
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    {subItem}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}