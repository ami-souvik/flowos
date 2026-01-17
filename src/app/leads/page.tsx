"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Lead } from '@/types';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import KanbanBoard from '@/components/leads/KanbanBoard';
import { LayoutGrid, List, Trash2 } from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLead, setNewLead] = useState<Partial<Lead>>({ name: '', email: '', phone: '', status: 'NEW', source: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await api.get('/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/leads', newLead);
      setIsModalOpen(false);
      setNewLead({ name: '', email: '', phone: '', status: 'NEW', source: '' });
      fetchLeads();
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  const handleLeadUpdate = async (updatedLead: Lead) => {
    // Optimistic update
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));

    try {
      await api.put(`/leads/${updatedLead.id}`, updatedLead);
    } catch (error) {
      console.error('Error updating lead:', error);
      // Revert on failure
      fetchLeads();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h2>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 dark:bg-neutral-800 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                ? 'bg-white dark:bg-neutral-700 shadow-sm text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'board'
                ? 'bg-white dark:bg-neutral-700 shadow-sm text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>Add New Lead</Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : viewMode === 'list' ? (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${lead.status === 'NEW' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        lead.status === 'WON' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          lead.status === 'LOST' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                        {lead.status}
                      </span>
                    </TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2 items-center">
                      <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm">
                        View
                      </Link>
                      <button 
                        onClick={() => handleDeleteLead(lead.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {leads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No leads found. Create one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <div className="h-[calc(100vh-200px)] overflow-hidden">
          <KanbanBoard leads={leads} onLeadUpdate={handleLeadUpdate} />
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <Card className="w-full max-w-md animate-in fade-in zoom-in duration-200">
            <CardHeader>
              <CardTitle>Add New Lead</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateLead} className="space-y-4">
                <Input
                  placeholder="Name"
                  value={newLead.name}
                  onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                  required
                  label="Name"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={newLead.email || ''}
                  onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                  label="Email"
                />
                <Input
                  placeholder="Phone"
                  value={newLead.phone}
                  onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                  required
                  label="Phone"
                />
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 dark:text-white"
                    value={newLead.status}
                    onChange={e => setNewLead({ ...newLead, status: e.target.value })}
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="QUALIFIED">Qualified</option>
                  </select>
                </div>
                <Input
                  placeholder="Source (e.g. Referral, Web)"
                  value={newLead.source || ''}
                  onChange={e => setNewLead({ ...newLead, source: e.target.value })}
                  label="Source"
                />
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Lead</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Developer API Section */}
      <Card className="mt-8 border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Developer API</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Integrate your website forms directly with our public lead capture API.
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Endpoint</h4>
              <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                POST {typeof window !== 'undefined' ? window.location.origin : ''}/api/public/leads
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Example Request</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
{`curl -X POST ${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/public/leads \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "source": "Website Contact Form",
    "budgetRange": "10000-20000",
    "notes": "Looking for interior design services."
  }'`}
              </pre>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Response (201 Created)</h4>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
{`{
  "message": "Lead created successfully",
  "id": 123,
  "name": "John Doe"
}`}
              </pre>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}