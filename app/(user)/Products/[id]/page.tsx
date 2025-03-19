'use client';

import { use } from 'react';
import ProductDetails from "@/components/ProductDetails";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <ProductDetails id={resolvedParams.id} />;
} 