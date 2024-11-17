import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { FilterBar } from './FilterBar';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  rating: number;
  reviews: any[];
  category: Category | string;
  originalPrice?: number;
  discount?: string;
  isNew?: boolean;
  colors: { name: string }[];
  sizes: { name: string }[];
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchProducts(), fetchCategories()]);
      } catch (error) {
        // Error handling is done in individual fetch functions
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [categoryFromUrl]);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const fetchProducts = async () => {
    try {
      setError(null);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast.error('Failed to fetch products');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      const activeCategories = response.data
        .filter((cat: Category) => cat.isActive)
        .sort((a: Category, b: Category) => a.name.localeCompare(b.name));
      setCategories(activeCategories);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const getCategoryId = (product: Product): string => {
    if (typeof product.category === 'string') {
      return product.category;
    }
    return product.category._id;
  };

  const getCategoryName = (product: Product): string => {
    if (typeof product.category === 'string') {
      const category = categories.find(cat => cat._id === product.category);
      return category?.name || 'Uncategorized';
    }
    return product.category.name;
  };

  const filterProducts = (product: Product) => {
    // Category filter
    if (selectedCategory !== 'all' && getCategoryId(product) !== selectedCategory) {
      return false;
    }

    // Apply other filters
    if (selectedFilters.length > 0) {
      const hasSize = selectedFilters.some(filter => 
        product.sizes.some(size => size.name === filter)
      );
      
      const hasColor = selectedFilters.some(filter => 
        product.colors.some(color => color.name === filter)
      );

      const hasPriceRange = selectedFilters.some(filter => {
        const price = product.price;
        switch (filter) {
          case 'under-50':
            return price < 50;
          case '50-100':
            return price >= 50 && price <= 100;
          case '100-200':
            return price >= 100 && price <= 200;
          case '200-500':
            return price >= 200 && price <= 500;
          case 'over-500':
            return price > 500;
          default:
            return false;
        }
      });

      return hasSize || hasColor || hasPriceRange;
    }

    return true;
  };

  const filteredProducts = products.filter(filterProducts);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-600">
        {error}
      </div>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Our Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of premium fashion pieces, crafted with quality and style in mind.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterBar
            categories={categories.map(cat => ({
              id: cat._id,
              name: cat.name
            }))}
            selectedCategory={selectedCategory}
            selectedFilters={selectedFilters}
            onCategoryChange={setSelectedCategory}
            onFilterChange={setSelectedFilters}
          />
          
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={{
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.images[0],
                      rating: product.rating,
                      reviews: product.reviews.length,
                      category: getCategoryName(product),
                      originalPrice: product.originalPrice,
                      discount: product.discount ? `-${product.discount}%` : undefined,
                      isNew: product.isNew
                    }} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}