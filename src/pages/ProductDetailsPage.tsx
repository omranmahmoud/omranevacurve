import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { convertPrice, formatPrice } from '../utils/currency';
import { Reviews } from '../components/Reviews/Reviews';
import { RelatedProducts } from '../components/Featured/RelatedProducts';
import { ColorSelector } from '../components/ProductDetails/ColorSelector';
import { SizeSelector } from '../components/ProductDetails/SizeSelector';
import api from '../services/api';
import { toast } from 'react-hot-toast';

interface Color {
  name: string;
  code: string;
}

interface Size {
  name: string;
  stock: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  colors: Color[];
  sizes: Size[];
  stock: number;
  rating: number;
  reviews: any[];
  isNew?: boolean;
}

export function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { currency } = useCurrency();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        // Set default selections
        if (response.data.colors.length > 0) {
          setSelectedColor(response.data.colors[0].name);
        }
        if (response.data.sizes.length > 0) {
          setSelectedSize(response.data.sizes[0].name);
        }
      } catch (error) {
        toast.error('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  // Convert prices from USD to selected currency
  const displayPrice = convertPrice(product.price, 'USD', currency);
  const displayOriginalPrice = product.originalPrice ? 
    convertPrice(product.originalPrice, 'USD', currency) 
    : undefined;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }

    // Check if selected size is in stock
    const sizeStock = product.sizes.find(s => s.name === selectedSize)?.stock || 0;
    if (sizeStock === 0) {
      toast.error('Selected size is out of stock');
      return;
    }

    addToCart({
      id: product._id,
      name: product.name,
      price: displayPrice,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize
    });
    toast.success('Added to cart');
  };

  const toggleWishlist = () => {
    const productData = {
      id: product._id,
      name: product.name,
      price: displayPrice,
      image: product.images[0]
    };

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(productData);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden ${
                      index === selectedImage ? 'ring-2 ring-indigo-600' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              {product.isNew && (
                <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full">
                  New
                </span>
              )}
              {displayOriginalPrice && (
                <span className="px-3 py-1 bg-rose-600 text-white text-xs font-medium rounded-full">
                  Save {Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-900">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviews.length} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-indigo-600">
                {formatPrice(displayPrice, currency)}
              </span>
              {displayOriginalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(displayOriginalPrice, currency)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600">{product.description}</p>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <ColorSelector
                colors={product.colors}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
              />
            )}

            {/* Actions */}
            <div className="space-y-4 pt-6">
              <button
                onClick={handleAddToCart}
                className="w-full bg-indigo-600 text-white py-4 rounded-full font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 group"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                Add to Cart
              </button>

              <button
                onClick={toggleWishlist}
                className={`w-full py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors ${
                  isInWishlist(product._id)
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-white text-gray-900 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                {isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <Reviews
            productId={product._id}
            reviews={product.reviews}
            onReviewAdded={() => {
              // Refresh product data to get updated reviews
              api.get(`/products/${id}`).then(response => setProduct(response.data));
            }}
          />
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts />
        </div>
      </div>
    </div>
  );
}