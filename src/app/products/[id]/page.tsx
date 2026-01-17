"use client";

import { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  const fetchProduct = async (pId: string) => {
    try {
      const response = await api.get(`/products/${pId}/`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      router.push('/products');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading && !product) return <div className="p-12 text-center text-zinc-500 font-light">Loading product details...</div>;
  if (!product) return <div className="p-12 text-center text-zinc-500">Product not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <div className="flex items-center gap-3">
             <h2 className="text-3xl font-light text-zinc-900 dark:text-zinc-100">{product.name}</h2>
             <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-xs border border-zinc-200 font-mono">
                {product.code || 'NO-CODE'}
             </span>
           </div>
           <p className="text-zinc-500 text-sm mt-1">{product.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Edit Product</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
            <Card className="p-6 border-zinc-100 shadow-sm">
                <h3 className="text-lg font-medium text-zinc-800 mb-4">Pricing Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-50 rounded border border-zinc-100">
                        <p className="text-zinc-500 text-xs mb-1">Cost Price</p>
                        <p className="text-2xl font-light text-zinc-900">${Number(product.costPrice).toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded border border-zinc-100">
                        <p className="text-zinc-500 text-xs mb-1">Selling Price</p>
                        <p className="text-2xl font-light text-emerald-600">${Number(product.productPrice).toFixed(2)}</p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-100">
                    <p className="text-sm text-zinc-600 flex justify-between">
                        <span>Margin:</span>
                        <span className="font-medium text-zinc-900">
                            ${(Number(product.productPrice) - Number(product.costPrice)).toFixed(2)} 
                            <span className="text-zinc-400 font-normal text-xs ml-1">
                                ({((Number(product.productPrice) - Number(product.costPrice)) / Number(product.productPrice) * 100).toFixed(1)}%)
                            </span>
                        </span>
                    </p>
                </div>
            </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
            <Card className="p-6 border-zinc-100 shadow-sm bg-zinc-50/50">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Product Stats</h3>
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="text-zinc-400 text-xs">Created At</p>
                        <p className="text-zinc-800 font-medium">
                            {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>
            </Card>
        </div>

      </div>
    </div>
  );
}
