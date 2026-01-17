"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Quotation, Lead } from '@/types';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Trash2 } from 'lucide-react';

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [leads, setLeads] = useState<{ id: number, name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuotation, setNewQuotation] = useState<Partial<Quotation>>({ leadId: 0, validUntil: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchQuotations();
    fetchLeads();
  }, []);

  const fetchQuotations = async () => {
    try {
      const response = await api.get('/quotations');
      setQuotations(response.data);
    } catch (error) {
      console.error('Error fetching quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await api.get('/leads');
      setLeads(response.data);
    } catch (error) { console.error(error); }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this quotation?')) return;
    try {
      await api.delete(`/quotations/${id}`);
      setQuotations(prev => prev.filter(q => q.id !== id));
    } catch (error) {
      console.error('Error deleting quotation:', error);
    }
  };

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/quotations', newQuotation);
      setIsModalOpen(false);
      setNewQuotation({ leadId: 0, validUntil: '' });
      fetchQuotations();
    } catch (error) {
      console.error('Error creating quotation:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Quotations</h2>
        <Button onClick={() => setIsModalOpen(true)}>Create Quotation</Button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actions</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="flex gap-2">
                      <Link href={`/quotations/${quotation.id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                        View
                      </Link>
                      <button 
                        onClick={() => handleDelete(quotation.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </TableCell>
                    <TableCell className="font-medium">{quotation.lead?.name}</TableCell>
                    <TableCell>{new Date(quotation.date).toLocaleDateString()}</TableCell>
                    <TableCell>{quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>${Number(quotation.totalAmount).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {quotations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No quotations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <Card className="w-full max-w-md animate-in fade-in zoom-in duration-200">
            <CardHeader>
              <CardTitle>Create Quotation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateQuotation} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Client</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 dark:text-white"
                    value={newQuotation.leadId}
                    onChange={e => setNewQuotation({ ...newQuotation, leadId: parseInt(e.target.value) })}
                    required
                  >
                    <option value="">Select Client</option>
                    {leads.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <Input
                  type="date"
                  value={newQuotation.validUntil as string || ''}
                  onChange={e => setNewQuotation({ ...newQuotation, validUntil: e.target.value })}
                  label="Valid Until"
                />
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Draft</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}