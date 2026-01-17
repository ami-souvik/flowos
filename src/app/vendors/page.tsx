"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Vendor } from '@/types';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Trash2 } from 'lucide-react';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({ name: '', contactPerson: '', email: '', phone: '', address: '', serviceType: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await api.get('/vendors');
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;
    try {
      await api.delete(`/vendors/${id}`);
      setVendors(prev => prev.filter(v => v.id !== id));
    } catch (error) {
      console.error('Error deleting vendor:', error);
    }
  };

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/vendors', newVendor);
      setIsModalOpen(false);
      setNewVendor({ name: '', contactPerson: '', email: '', phone: '', address: '', serviceType: '' });
      fetchVendors();
    } catch (error) {
      console.error('Error creating vendor:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Vendors</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add New Vendor</Button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.serviceType}</TableCell>
                    <TableCell>{vendor.contactPerson}</TableCell>
                    <TableCell>{vendor.phone}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2 items-center">
                        <Link href={`/vendors/${vendor.id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm">
                            View
                        </Link>
                        <button 
                            onClick={() => handleDelete(vendor.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </TableCell>
                  </TableRow>
                ))}
                {vendors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No vendors found.
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
              <CardTitle>Add New Vendor</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateVendor} className="space-y-4">
                <Input
                  placeholder="Company Name"
                  value={newVendor.name}
                  onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
                  required
                  label="Company Name"
                />
                <Input
                  placeholder="Contact Person"
                  value={newVendor.contactPerson || ''}
                  onChange={e => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                  label="Contact Person"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={newVendor.email || ''}
                  onChange={e => setNewVendor({ ...newVendor, email: e.target.value })}
                  label="Email"
                />
                <Input
                  placeholder="Phone"
                  value={newVendor.phone || ''}
                  onChange={e => setNewVendor({ ...newVendor, phone: e.target.value })}
                  label="Phone"
                />
                <Input
                  placeholder="Service Type (e.g. Plumbing)"
                  value={newVendor.serviceType || ''}
                  onChange={e => setNewVendor({ ...newVendor, serviceType: e.target.value })}
                  label="Service Type"
                />
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Vendor</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
