import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface FilterBarProps {
  categories: Category[];
  selectedCategory: string;
  selectedFilters: string[];
  onCategoryChange: (categoryId: string) => void;
  onFilterChange: (filters: string[]) => void;
}

export function FilterBar({ 
  categories, 
  selectedCategory, 
  selectedFilters,
  onCategoryChange, 
  onFilterChange 
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    sizes: true,
    colors: true,
    price: true
  });

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Black', class: 'bg-gray-900' },
    { name: 'White', class: 'bg-white border border-gray-200' },
    { name: 'Navy', class: 'bg-indigo-900' },
    { name: 'Brown', class: 'bg-amber-800' },
    { name: 'Green', class: 'bg-emerald-700' },
    { name: 'Red', class: 'bg-red-600' }
  ];
  const priceRanges = [
    { label: 'Under $50', value: 'under-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100 - $200', value: '100-200' },
    { label: '$200 - $500', value: '200-500' },
    { label: 'Over $500', value: 'over-500' }
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearFilters = () => {
    onCategoryChange('all');
    onFilterChange([]);
    setIsOpen(false);
  };

  const FilterSection = ({ title, children, name }: { title: string; children: React.ReactNode; name: keyof typeof expandedSections }) => (
    <div className="py-4 border-b border-gray-200 last:border-0">
      <button
        onClick={() => toggleSection(name)}
        className="flex items-center justify-between w-full group"
      >
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
          expandedSections[name] ? 'rotate-180' : ''
        }`} />
      </button>
      <div className={`mt-4 space-y-4 ${expandedSections[name] ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden sticky top-0 z-10 bg-white py-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Filter className="w-5 h-5" />
          Filters {selectedFilters.length > 0 && `(${selectedFilters.length})`}
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      <div className={`lg:hidden fixed inset-0 z-40 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <div className="absolute inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <div className="flex items-center gap-4">
              {(selectedCategory !== 'all' || selectedFilters.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-5rem)]">
            {renderFilters()}
          </div>
        </div>
      </div>

      {/* Desktop Filters */}
      <aside className="hidden lg:block w-64 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filters</span>
          </div>
          {(selectedCategory !== 'all' || selectedFilters.length > 0) && (
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Clear all
            </button>
          )}
        </div>
        {renderFilters()}
      </aside>
    </>
  );

  function renderFilters() {
    return (
      <div className="space-y-1">
        <FilterSection title="Categories" name="categories">
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === 'all'}
                onChange={() => {
                  onCategoryChange('all');
                  if (isOpen) setIsOpen(false);
                }}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className={`text-sm ${selectedCategory === 'all' ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}>
                All Categories
              </span>
            </label>
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category.id}
                  onChange={() => {
                    onCategoryChange(category.id);
                    if (isOpen) setIsOpen(false);
                  }}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className={`text-sm ${selectedCategory === category.id ? 'text-indigo-600 font-medium' : 'text-gray-600'}`}>
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Size" name="sizes">
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <label
                key={size}
                className="relative flex items-center justify-center"
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={selectedFilters.includes(size)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onFilterChange([...selectedFilters, size]);
                    } else {
                      onFilterChange(selectedFilters.filter(f => f !== size));
                    }
                  }}
                />
                <div className="w-full py-2 text-sm text-center border rounded-lg cursor-pointer transition-all duration-200 peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 hover:bg-gray-50 peer-checked:hover:bg-indigo-700">
                  {size}
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Color" name="colors">
          <div className="grid grid-cols-6 gap-3">
            {colors.map((color) => (
              <label
                key={color.name}
                className="relative group"
              >
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={selectedFilters.includes(color.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onFilterChange([...selectedFilters, color.name]);
                    } else {
                      onFilterChange(selectedFilters.filter(f => f !== color.name));
                    }
                  }}
                />
                <div className={`w-8 h-8 rounded-full cursor-pointer ${color.class} ring-2 ring-transparent peer-checked:ring-indigo-600 peer-checked:ring-offset-2 transition-all duration-200`} />
                <span className="sr-only">{color.name}</span>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {color.name}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Price Range" name="price">
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={selectedFilters.includes(range.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onFilterChange([...selectedFilters, range.value]);
                    } else {
                      onFilterChange(selectedFilters.filter(f => f !== range.value));
                    }
                  }}
                />
                <span className="text-sm text-gray-600">{range.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    );
  }
}