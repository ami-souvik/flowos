"use client";

import { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Vendor, Lead, ProjectItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

// Extend Vendor type locally if needed or update types/index.ts. 
// Assuming types/index.ts has basic Vendor. We need extended one here.
interface ExtendedVendor extends Vendor {
  leads: Lead[];
  projectItems: (ProjectItem & { project: { name: string } })[];
}

export default function VendorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [vendor, setVendor] = useState<ExtendedVendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchVendor(id);
  }, [id]);

  const fetchVendor = async (vId: string) => {
    try {
      const response = await api.get(`/vendors/${vId}/`);
      setVendor(response.data);
    } catch (error) {
      console.error('Error fetching vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;
    try {
      await api.delete(`/vendors/${id}`);
      router.push('/vendors');
    } catch (error) {
      console.error('Error deleting vendor:', error);
    }
  };

  if (loading && !vendor) return <div className="p-12 text-center text-zinc-500 font-light">Loading vendor details...</div>;
  if (!vendor) return <div className="p-12 text-center text-zinc-500">Vendor not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <div className="flex items-center gap-3">
             <h2 className="text-3xl font-light text-zinc-900 dark:text-zinc-100">{vendor.name}</h2>
             <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-xs border border-zinc-200">
                {vendor.serviceType || 'Service'}
             </span>
           </div>
           <p className="text-zinc-500 text-sm mt-1">Contact: {vendor.contactPerson} • {vendor.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Edit Vendor</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Project Items / Supply History */}
            <Card className="border-zinc-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-zinc-100">
                    <h3 className="text-lg font-medium text-zinc-800">Supply History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-zinc-50 text-zinc-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Item</th>
                                <th className="px-6 py-3">Project</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {vendor.projectItems?.map((item) => (
                                <tr key={item.id} className="hover:bg-zinc-50/50">
                                    <td className="px-6 py-4 font-medium text-zinc-900">{item.name}</td>
                                    <td className="px-6 py-4 text-zinc-600">{item.project?.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                                            item.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">${Number(item.costPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                            {(!vendor.projectItems || vendor.projectItems.length === 0) && (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-400 italic">No items supplied yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Linked Leads */}
            <Card className="border-zinc-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-zinc-100">
                    <h3 className="text-lg font-medium text-zinc-800">Assigned Leads</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-zinc-50 text-zinc-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Phone</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {vendor.leads?.map((lead) => (
                                <tr key={lead.id} className="hover:bg-zinc-50/50">
                                    <td className="px-6 py-4 font-medium text-zinc-900">{lead.name}</td>
                                    <td className="px-6 py-4 text-zinc-600">{lead.status}</td>
                                    <td className="px-6 py-4 text-zinc-600">{lead.phone}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">View</Link>
                                    </td>
                                </tr>
                            ))}
                            {(!vendor.leads || vendor.leads.length === 0) && (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-400 italic">No leads assigned.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
            <Card className="p-6 border-zinc-100 shadow-sm bg-zinc-50/50">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Contact Information</h3>
                <div className="space-y-4 text-sm">
                    <div>
                        <p className="text-zinc-400 text-xs">Email</p>
                        <p className="text-zinc-800 font-medium break-all">{vendor.email || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-zinc-400 text-xs">Phone</p>
                        <p className="text-zinc-800 font-medium">{vendor.phone || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-zinc-400 text-xs">Address</p>
                        <p className="text-zinc-800 font-medium whitespace-pre-wrap">{vendor.address || 'N/A'}</p>
                    </div>
                </div>
            </Card>
        </div>

      </div>
    </div>
  );
}
