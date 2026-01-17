"use client";

import { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Quotation, QuotationItem, Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function QuotationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState<Partial<QuotationItem>>({ productId: undefined, description: '', quantity: 1, unitPrice: 0 });

  useEffect(() => {
    if (id) {
      fetchQuotation(id);
      fetchProducts();
    }
  }, [id]);

  const fetchQuotation = async (qId: string) => {
    try {
      const response = await api.get(`/quotations/${qId}/`);
      setQuotation(response.data);
    } catch (error) {
      console.error('Error fetching quotation:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/');
      setProducts(res.data);
    } catch (e) { console.error(e) }
  }

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prodId = parseInt(e.target.value);
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setNewItem({
        ...newItem,
        productId: prodId,
        description: prod.description || '',
        unitPrice: Number(prod.productPrice)
      });
    } else {
      setNewItem({ ...newItem, productId: undefined });
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !quotation) return;
    try {
      const currentItems = quotation.items || [];
      const updatedItems = [...currentItems, { ...newItem, subtotal: (newItem.quantity || 1) * (Number(newItem.unitPrice) || 0) }];
      
      await api.put(`/quotations/${id}`, {
        ...quotation,
        items: updatedItems
      });

      setNewItem({ productId: undefined, description: '', quantity: 1, unitPrice: 0 });
      fetchQuotation(id);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const convertToInvoice = async () => {
    if (!quotation) return;
    try {
      if (quotation.invoice) {
        alert("Invoice already exists for this quotation.");
        return;
      }

      const invoiceData = {
        quotationId: quotation.id,
        leadId: quotation.leadId,
        amount: quotation.totalAmount,
        status: 'DRAFT',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      await api.post('/invoices/', invoiceData);
      router.push('/invoices');
    } catch (e) {
      console.error("Failed to create invoice", e);
      alert("Failed to create invoice");
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this quotation?')) return;
    try {
      await api.delete(`/quotations/${id}`);
      router.push('/quotations');
    } catch (error) {
      console.error('Error deleting quotation:', error);
    }
  };

  if (loading && !quotation) return <div className="p-12 text-center text-zinc-500 font-light">Loading quotation details...</div>;
  if (!quotation) return <div className="p-12 text-center text-zinc-500">Quotation not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <div className="flex items-center gap-3">
             <h2 className="text-3xl font-light text-zinc-900 dark:text-zinc-100">Quotation #{quotation.id}</h2>
             <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-xs border border-zinc-200">
                DRAFT
             </span>
           </div>
           <p className="text-zinc-500 text-sm mt-1">Client: {quotation.lead?.name} • Date: {new Date(quotation.date).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={convertToInvoice}>Convert to Invoice</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Items */}
        <div className="lg:col-span-2 space-y-8">
            <Card className="border-zinc-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-zinc-100">
                    <h3 className="text-lg font-medium text-zinc-800">Line Items</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-zinc-50 text-zinc-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3 w-24 text-center">Qty</th>
                                <th className="px-6 py-3 w-32 text-right">Unit Price</th>
                                <th className="px-6 py-3 w-32 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {quotation.items?.map((item) => (
                                <tr key={item.id} className="hover:bg-zinc-50/50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-zinc-900">{item.product?.name}</div>
                                        <div className="text-zinc-500 text-xs">{item.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">{item.quantity}</td>
                                    <td className="px-6 py-4 text-right">${Number(item.unitPrice).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right font-medium">${Number(item.subtotal).toFixed(2)}</td>
                                </tr>
                            ))}
                            {(!quotation.items || quotation.items.length === 0) && (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-400 italic">No items added yet.</td></tr>
                            )}
                        </tbody>
                        <tfoot className="bg-zinc-50 font-medium text-zinc-900">
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-right">Total Amount</td>
                                <td className="px-6 py-4 text-right text-lg">${Number(quotation.totalAmount).toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </Card>

            <Card className="p-6 border-zinc-100 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Add Line Item</h3>
                <form onSubmit={handleAddItem} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Product</label>
                            <select
                                className="w-full p-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-400 bg-zinc-50"
                                value={newItem.productId || ''}
                                onChange={handleProductChange}
                            >
                                <option value="">Select Product (Optional)</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} (${Number(p.productPrice).toFixed(2)})</option>
                                ))}
                            </select>
                        </div>
                        <Input
                            label="Unit Price"
                            type="number" step="0.01"
                            value={newItem.unitPrice}
                            onChange={e => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) })}
                            required
                        />
                    </div>
                    <Input
                        label="Description"
                        placeholder="Item description"
                        value={newItem.description}
                        onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Quantity"
                            type="number" min="1"
                            value={newItem.quantity}
                            onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                            required
                        />
                        <div className="flex items-end">
                             <Button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800">Add Item</Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
            <Card className="p-6 border-zinc-100 shadow-sm bg-zinc-50/50">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Quotation Details</h3>
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="text-zinc-400 text-xs">Valid Until</p>
                        <p className="text-zinc-800 font-medium">
                            {quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : 'No expiry'}
                        </p>
                    </div>
                    <div>
                        <p className="text-zinc-400 text-xs">Created At</p>
                        <p className="text-zinc-800 font-medium">
                            {new Date(quotation.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </Card>
        </div>

      </div>
    </div>
  );
}