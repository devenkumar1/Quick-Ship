'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaUpload, FaTimes } from 'react-icons/fa';

type Product = {
  id?: number;
  name: string;
  price: number | string;
  shopId: number;
  image?: string;
  description?: string;
};

type ProductFormProps = {
  product?: Product | null;
  shops: Array<{ id: number; name: string }>;
  onSubmit: (productData: Product) => void;
  onCancel: () => void;
};

export default function ProductForm({ product, shops, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    name: '',
    price: '',
    shopId: shops.length > 0 ? shops[0].id : 0,
    description: '',
    image: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Initialize form if editing
  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name || '',
        price: product.price || '',
        shopId: product.shopId || (shops.length > 0 ? shops[0].id : 0),
        description: product.description || '',
        image: product.image || '',
      });
      
      if (product.image) {
        setImagePreview(product.image);
      }
    }
  }, [product, shops]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload this to a storage service
      // For now, we'll create a local object URL
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a valid number';
    } else if (Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert price to number
      const submitData = {
        ...formData,
        price: parseFloat(formData.price.toString()),
        shopId: Number(formData.shopId),
      };
      
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>
        <div className="mt-1 flex items-center">
          {imagePreview ? (
            <div className="relative inline-block">
              <Image
                src={imagePreview}
                alt="Product preview"
                width={100}
                height={100}
                className="object-cover rounded-md"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
              >
                <FaTimes size={12} />
              </button>
            </div>
          ) : (
            <label className="flex justify-center items-center px-6 py-3 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 cursor-pointer w-full h-32">
              <div className="space-y-1 text-center">
                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Upload an image
                  </span>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              <input
                id="image-upload"
                name="image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
      </div>

      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Price (₹) *
        </label>
        <input
          type="text"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="0.00"
          className={`w-full px-4 py-2 rounded-lg border ${
            errors.price ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
      </div>

      {/* Shop Selection */}
      <div>
        <label htmlFor="shopId" className="block text-sm font-medium text-gray-700 mb-1">
          Shop *
        </label>
        <select
          id="shopId"
          name="shopId"
          value={formData.shopId}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
} 