"use client";

import { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Invoice } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function InvoiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchInvoice(id);
  }, [id]);

  const fetchInvoice = async (iId: string) => {
    try {
      const response = await api.get(`/invoices/${iId}/`);
      setInvoice(response.data);
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await api.delete(`/invoices/${id}`);
      router.push('/invoices');
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  if (loading && !invoice) return <div className="p-12 text-center text-zinc-500 font-light">Loading invoice details...</div>;
  if (!invoice) return <div className="p-12 text-center text-zinc-500">Invoice not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <div className="flex items-center gap-3">
             <h2 className="text-3xl font-light text-zinc-900 dark:text-zinc-100">Invoice #{invoice.id}</h2>
             <span className={`px-2 py-0.5 rounded-full text-xs border ${
                invoice.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                invoice.status === 'OVERDUE' ? 'bg-red-50 text-red-700 border-red-100' :
                'bg-amber-50 text-amber-700 border-amber-100'
             }`}>
                {invoice.status}
             </span>
           </div>
           <p className="text-zinc-500 text-sm mt-1">Client: {invoice.lead?.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Record Payment</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
            <Card className="p-6 border-zinc-100 shadow-sm">
                <div className="flex justify-between items-end mb-6 border-b border-zinc-100 pb-4">
                    <div>
                        <p className="text-sm text-zinc-500">Total Amount</p>
                        <p className="text-3xl font-light text-zinc-900">${Number(invoice.amount).toFixed(2)}</p>
                    </div>
                    {invoice.quotationId && (
                        <div className="text-right">
                            <p className="text-xs text-zinc-400">Reference</p>
                            <p className="text-sm font-medium text-blue-600">Quotation #{invoice.quotationId}</p>
                        </div>
                    )}
                </div>
                
                {/* Payment History Placeholder */}
                <div>
                    <h3 className="text-sm font-medium text-zinc-800 mb-3">Payment History</h3>
                    <div className="text-sm text-zinc-500 italic bg-zinc-50 p-4 rounded border border-zinc-100 text-center">
                        No payments recorded.
                    </div>
                </div>
            </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
            <Card className="p-6 border-zinc-100 shadow-sm bg-zinc-50/50">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Dates</h3>
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="text-zinc-400 text-xs">Invoice Date</p>
                        <p className="text-zinc-800 font-medium">
                            {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-zinc-400 text-xs">Due Date</p>
                        <p className={`font-medium ${
                            new Date(invoice.dueDate || '') < new Date() && invoice.status !== 'PAID' 
                            ? 'text-red-600' 
                            : 'text-zinc-800'
                        }`}>
                            {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>
            </Card>
        </div>

      </div>
    </div>
  );
}
