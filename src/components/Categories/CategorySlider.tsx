import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
  image: string;
  slug: string;
  isActive: boolean;
  order: number;
}

export function CategorySlider() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const itemsToShow = Math.min(5, categories.length);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      // Filter active categories and sort by order
      const activeCategories = response.data
        .filter((cat: Category) => cat.isActive)
        .sort((a: Category, b: Category) => a.order - b.order);
      setCategories(activeCategories);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + 1 >= categories.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - 1 < 0 ? categories.length - 1 : prev - 1
    );
  };

  const getVisibleCategories = () => {
    const visibleItems: Category[] = [];
    let count = 0;
    let index = currentIndex;

    while (count < itemsToShow && count < categories.length) {
      visibleItems.push(categories[index]);
      count++;
      index = (index + 1) % categories.length;
    }

    return visibleItems;
  };

  const handleCategoryClick = (category: Category) => {
    navigate(`/products?category=${category._id}`);
  };

  useEffect(() => {
    if (categories.length <= itemsToShow) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, categories.length, itemsToShow]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  const showNavigation = categories.length > itemsToShow;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Shop by Category</h2>
            <p className="mt-2 text-gray-600">Browse our curated collection of categories</p>
          </div>
          {showNavigation && (
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Previous category"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Next category"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="flex justify-between items-center gap-8">
            {getVisibleCategories().map((category, index) => (
              <button
                key={category._id}
                onClick={() => handleCategoryClick(category)}
                className="flex-1"
                style={{
                  opacity: index === Math.floor(itemsToShow / 2) ? 1 : 0.7,
                  transform: `scale(${
                    index === Math.floor(itemsToShow / 2) ? 1.1 : 1
                  })`,
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <div className="text-center space-y-4 group">
                  <div className="aspect-square relative">
                    <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-white shadow-lg">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/40 group-hover:to-black/50 transition-colors" />
                    </div>
                  </div>
                  <div className="relative">
                    <h3 className="text-gray-900 font-bold text-lg transition-colors group-hover:text-indigo-600">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 group-hover:text-indigo-500 transition-colors">
                      Shop Now
                    </p>
                    {/* Active Indicator */}
                    <div className="absolute -top-2 right-1/2 transform translate-x-1/2 w-2 h-2 rounded-full bg-green-500 animate-pulse">
                      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {showNavigation && (
            <>
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
            </>
          )}
        </div>

        {/* Navigation Dots */}
        {showNavigation && (
          <div className="flex justify-center gap-2 mt-8">
            {categories.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-6 bg-indigo-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to category ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}