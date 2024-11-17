import React from 'react';

interface Size {
  name: string;
  stock: number;
}

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export function SizeSelector({ sizes, selectedSize, onSizeChange }: SizeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Size</label>
        <button className="text-sm text-indigo-600 hover:text-indigo-700">Size Guide</button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {sizes.map(({ name, stock }) => (
          <button
            key={name}
            onClick={() => onSizeChange(name)}
            disabled={stock === 0}
            className={`py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              name === selectedSize
                ? 'bg-indigo-600 text-white ring-2 ring-indigo-600'
                : stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50'
            }`}
          >
            {name}
            {stock === 0 && (
              <span className="block text-xs mt-1">Out of stock</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}