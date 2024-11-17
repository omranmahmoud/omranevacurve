import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Minus } from 'lucide-react';
import { uploadToCloudinary } from '../../services/cloudinary';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

interface Color {
  name: string;
  code: string;
}

interface Size {
  name: string;
  stock: number;
}

interface Category {
  _id: string;
  name: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
}

export function AddProductModal({ isOpen, onClose, onSubmit }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    isNew: false,
    isFeatured: false,
    colors: [] as Color[],
    sizes: [] as Size[]
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [newColor, setNewColor] = useState({ name: '', code: '' });
  const [newSize, setNewSize] = useState({ name: '', stock: 0 });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const predefinedColors = [
    { name: 'Black', code: '#000000' },
    { name: 'White', code: '#FFFFFF' },
    { name: 'Navy', code: '#000080' },
    { name: 'Brown', code: '#964B00' },
    { name: 'Green', code: '#008000' },
    { name: 'Red', code: '#FF0000' }
  ];

  const predefinedSizes = [
    { name: 'XS', label: 'Extra Small' },
    { name: 'S', label: 'Small' },
    { name: 'M', label: 'Medium' },
    { name: 'L', label: 'Large' },
    { name: 'XL', label: 'Extra Large' },
    { name: 'XXL', label: '2X Large' }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addColor = () => {
    if (!newColor.name || !newColor.code) {
      toast.error('Please enter both color name and code');
      return;
    }

    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, newColor]
    }));
    setNewColor({ name: '', code: '' });
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const addSize = () => {
    if (!newSize.name || newSize.stock < 0) {
      toast.error('Please enter valid size details');
      return;
    }

    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, newSize]
    }));
    setNewSize({ name: '', stock: 0 });
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (images.length === 0) {
        throw new Error('Please add at least one image');
      }

      if (formData.colors.length === 0) {
        throw new Error('Please add at least one color');
      }

      if (formData.sizes.length === 0) {
        throw new Error('Please add at least one size');
      }

      // Upload images to Cloudinary
      const imageUrls = await Promise.all(
        images.map(image => uploadToCloudinary(image))
      );

      // Calculate total stock from sizes
      const totalStock = formData.sizes.reduce((sum, size) => sum + size.stock, 0);

      await onSubmit({
        ...formData,
        price: parseFloat(formData.price),
        stock: totalStock,
        images: imageUrls
      });

      onClose();
      toast.success('Product added successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Add New Product</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Mark as New</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Featured Product</span>
                </label>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Product Images (Max 5)
              </label>
              
              <div className="grid grid-cols-5 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Add Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Colors
              </label>

              <div className="grid grid-cols-6 gap-4 mb-4">
                {predefinedColors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setNewColor(color)}
                    className="p-3 rounded-lg border hover:border-gray-300 transition-colors"
                  >
                    <div className="w-full h-6 rounded" style={{ backgroundColor: color.code }} />
                    <p className="mt-1 text-xs text-center text-gray-600">{color.name}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Color name"
                  value={newColor.name}
                  onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="color"
                  value={newColor.code}
                  onChange={(e) => setNewColor(prev => ({ ...prev, code: e.target.value }))}
                  className="w-14 p-1 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {formData.colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: color.code }}
                      />
                      <span className="font-medium text-gray-900">{color.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sizes and Stock
              </label>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {predefinedSizes.map((size) => (
                  <button
                    key={size.name}
                    type="button"
                    onClick={() => setNewSize(prev => ({ ...prev, name: size.name }))}
                    className={`p-3 rounded-lg border hover:border-gray-300 transition-colors ${
                      newSize.name === size.name ? 'border-indigo-600' : 'border-gray-200'
                    }`}
                  >
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{size.name}</p>
                      <p className="text-xs text-gray-500">{size.label}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                <select
                  value={newSize.name}
                  onChange={(e) => setNewSize(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Size</option>
                  {predefinedSizes.map((size) => (
                    <option key={size.name} value={size.name}>
                      {size.name} - {size.label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  placeholder="Stock"
                  value={newSize.stock}
                  onChange={(e) => setNewSize(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={addSize}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {formData.sizes.map((size, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-gray-900">{size.name}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        Stock: {size.stock}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Total Stock: {formData.sizes.reduce((sum, size) => sum + size.stock, 0)} units
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}