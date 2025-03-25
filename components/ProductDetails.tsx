'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaShoppingCart, FaHeart, FaArrowLeft, FaStore } from 'react-icons/fa';
import useProductStore from '@/store/productStore';
import useCartStore from '@/store/cartStore';
import type { Product as StoreProduct } from '@/store/productStore';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface ProductDetailsProps {
  id: string;
}

export default function ProductDetails({ id }: ProductDetailsProps) {
  const { data: session } = useSession();
  const { fetchProductById } = useProductStore();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductById(parseInt(id));
        
        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id, fetchProductById]);

  // Calculate average rating
  const averageRating = product?.reviews && product.reviews.length > 0
    ? (product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length).toFixed(1)
    : "0.0";

  // Handle quantity change
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  // Handle image navigation
  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const previousImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleSubmitReview = async () => {
    if (!session) {
      toast.error('Please login to submit a review');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      toast.success('Review submitted successfully');
      setReviewDialogOpen(false);
      // Refresh product data to show new review
      const updatedProduct = await fetchProductById(parseInt(id));
      if (updatedProduct) {
        setProduct(updatedProduct);
      }
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-lime-600 border-r-transparent"></div>
            <p className="mt-4 text-lg text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link href="/Products" className="flex items-center text-lime-600 hover:text-lime-800 mb-8">
          <FaArrowLeft className="mr-2" /> Back to Products
        </Link>
        
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="text-center max-w-md">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              <p>{error || 'Product not found'}</p>
            </div>
            <Button asChild>
              <Link href="/Products">Browse All Products</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back link */}
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/Products" className="flex items-center gap-2">
          <FaArrowLeft /> Back to Products
        </Link>
      </Button>
      
      {/* Product detail */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Product image */}
          <div className="md:w-1/2 relative h-[300px] md:h-[500px]">
            {product.images && product.images.length > 0 && (
              <>
                <Image 
                  src={product.images[currentImageIndex]}
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-lime-600' : 'bg-gray-300'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={previousImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full"
                    >
                      ←
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
                    >
                      →
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
          
          {/* Product info */}
          <div className="md:w-1/2 p-6 md:p-8">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                <FaHeart size={24} />
              </Button>
            </div>
            
            {/* Shop info */}
            <Link href={`/shop/${product.shopId}`} className="flex items-center text-lime-600 mb-4">
              <FaStore className="mr-2" />
              {product.shop.name}
            </Link>
            
            <Separator className="my-4" />
            
            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex items-center mr-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <FaStar
                    key={star}
                    className={`${
                      parseFloat(averageRating) >= star 
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating} ({product.reviews.length} reviews)
              </span>
            </div>
            
            {/* Price */}
            <div className="text-3xl font-bold text-lime-600 mb-6">
              ₹{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            </div>
            
            <Separator className="my-4" />

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}
            
            {/* Quantity selector */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  className="rounded-l-lg"
                >
                  -
                </Button>
                <div className="w-14 h-10 bg-gray-50 flex items-center justify-center border-t border-b border-gray-200">
                  {quantity}
                </div>
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  className="rounded-r-lg"
                >
                  +
                </Button>
              </div>
            </div>
            
            {/* Add to cart button */}
            <Button 
              className="w-full bg-lime-600 hover:bg-lime-700"
              size="lg"
              onClick={handleAddToCart}
            >
              <FaShoppingCart className="mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
        
        {/* Reviews section */}
        <Separator className="my-8" />
        
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Customer Reviews</h2>
            <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-lime-600 hover:bg-lime-700">
                  Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                  <DialogDescription>
                    Share your experience with this product
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                          className="focus:outline-none"
                          title={`Rate ${star} stars`}
                          aria-label={`Rate ${star} stars`}
                        >
                          <FaStar
                            className={star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}
                            size={24}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Comment</label>
                    <Textarea
                      placeholder="Share your thoughts about the product..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    />
                  </div>
                  <Button 
                    onClick={handleSubmitReview}
                    className="w-full bg-lime-600 hover:bg-lime-700"
                  >
                    Submit Review
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Reviews</TabsTrigger>
              <TabsTrigger value="positive">Positive</TabsTrigger>
              <TabsTrigger value="negative">Critical</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map(star => (
                          <FaStar
                            key={star}
                            className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{review.text}</p>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="positive" className="space-y-4">
              {product.reviews
                .filter(review => review.rating >= 4)
                .map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map(star => (
                            <FaStar
                              key={star}
                              className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.text}</p>
                  </div>
                ))}
            </TabsContent>
            <TabsContent value="negative" className="space-y-4">
              {product.reviews
                .filter(review => review.rating < 4)
                .map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map(star => (
                            <FaStar
                              key={star}
                              className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.text}</p>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}