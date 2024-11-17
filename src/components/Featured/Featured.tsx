import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Star, ShoppingBag, Heart } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface FeaturedProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description?: string;
  images: string[];
  category: string;
  isNew: boolean;
  rating: number;
  reviews: any[];
  order: number;
}

export function Featured() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/products');
      const featuredProducts = response.data
        .filter((p: FeaturedProduct) => p.isFeatured)
        .sort((a: FeaturedProduct, b: FeaturedProduct) => a.order - b.order);
      setProducts(featuredProducts);
    } catch (error) {
      toast.error('Failed to fetch featured products');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const currentProduct = products[currentIndex];

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const handleAddToCart = () => {
    addToCart({
      id: currentProduct._id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.images[0]
    });
    toast.success('Added to cart');
  };

  const toggleWishlist = () => {
    const productId = currentProduct._id;
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        id: productId,
        name: currentProduct.name,
        price: currentProduct.price,
        image: currentProduct.images[0]
      });
      toast.success('Added to wishlist');
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent" />
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Featured Collection
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Discover our most sought-after pieces
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Slider */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
            <div className="absolute inset-0 flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="min-w-full h-full relative"
                  style={{ display: index === currentIndex ? 'block' : 'none' }}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
            >
              <ArrowRight className="w-6 h-6 text-gray-900" />
            </button>

            {/* Progress Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'w-8 bg-white' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-900">
                    {currentProduct.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({currentProduct.reviews.length} reviews)
                </span>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-gray-900">
                  {currentProduct.name}
                </h3>
                <p className="text-lg text-gray-600">
                  {currentProduct.description || 'A timeless piece crafted with premium materials and attention to detail.'}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-indigo-600">
                  ${currentProduct.price.toFixed(2)}
                </span>
                {currentProduct.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${currentProduct.originalPrice.toFixed(2)}
                    </span>
                    <span className="px-2 py-1 text-sm font-medium bg-rose-100 text-rose-700 rounded-full">
                      Save {Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* Category */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-800">
                {currentProduct.category}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-indigo-600 text-white h-14 rounded-full font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                  Add to Cart
                </button>
                <button
                  onClick={toggleWishlist}
                  className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <Heart 
                    className={`w-6 h-6 ${
                      isInWishlist(currentProduct._id) 
                        ? 'fill-rose-600 text-rose-600' 
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                  <p className="text-sm text-gray-600">On all orders over $100</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                  <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}