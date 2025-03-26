'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'react-hot-toast';

// Form validation schema
const sellerSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  shopName: z.string().min(3, 'Shop name must be at least 3 characters'),
  location: z.string().min(5, 'Location must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
});

type SellerFormData = z.infer<typeof sellerSchema>;

export default function BecomeSellerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SellerFormData>({
    resolver: zodResolver(sellerSchema),
  });

  // Redirect if not logged in
  if (status === 'unauthenticated') {
    router.push('/auth/login?callbackUrl=/become-seller');
    return null;
  }

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  // Redirect if already a seller
  if (session?.user?.role === 'SELLER') {
    router.push('v1/seller/dashboard');
    return null;
  }

  const onSubmit = async (data: SellerFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/seller-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }

      toast.success('Application submitted successfully! We will review your application and get back to you soon.');
      router.push('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Become a Seller</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email field (disabled) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={session?.user?.email || ''}
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* Phone number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <Input
              {...register('phone')}
              type="tel"
              placeholder="Enter your phone number"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Shop name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Name
            </label>
            <Input
              {...register('shopName')}
              type="text"
              placeholder="Enter your shop name"
              className={errors.shopName ? 'border-red-500' : ''}
            />
            {errors.shopName && (
              <p className="mt-1 text-sm text-red-500">{errors.shopName.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <Input
              {...register('location')}
              type="text"
              placeholder="Enter your shop location"
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Description
            </label>
            <Textarea
              {...register('description')}
              placeholder="Describe your shop and what you plan to sell"
              className={errors.description ? 'border-red-500' : ''}
              rows={4}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-lime-600 hover:bg-lime-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </div>
    </div>
  );
} 