"use client";

import { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Lead, Activity } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({ activityType: 'CALL', summary: '', description: '', date: '', completed: false });

  useEffect(() => {
    if (id) {
        fetchLead(id);
        fetchActivities(id);
    }
  }, [id]);

  const fetchLead = async (leadId: string) => {
    try {
      const response = await api.get(`/leads/${leadId}/`);
      setLead(response.data);
    } catch (error) {
      console.error('Error fetching lead:', error);
    }
  };

  const fetchActivities = async (leadId: string) => {
    try {
      const response = await api.get('/activities/');
      setActivities(response.data.filter((a: Activity) => a.leadId == Number(leadId)));
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
        setLoading(false);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await api.post('/activities/', { ...newActivity, lead: id });
      setNewActivity({ activityType: 'CALL', summary: '', description: '', date: '', completed: false });
      fetchActivities(id);
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      router.push('/leads');
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  if (loading && !lead) return <div className="p-12 text-center text-zinc-500 font-light">Loading lead details...</div>;
  if (!lead) return <div className="p-12 text-center text-zinc-500">Lead not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <div className="flex items-center gap-3">
             <h2 className="text-3xl font-light text-zinc-900 dark:text-zinc-100">{lead.name}</h2>
             <span className={`px-2 py-0.5 rounded-full text-xs border ${
                      lead.status === 'NEW' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      lead.status === 'WON' ? 'bg-green-50 text-green-700 border-green-100' :
                      'bg-zinc-50 text-zinc-600 border-zinc-200'
            }`}>
                {lead.status}
             </span>
           </div>
           <p className="text-zinc-500 text-sm mt-1">Source: {lead.source} • Created: {new Date(lead.createdAt || Date.now()).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary">Edit Lead</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Activity Log */}
            <Card className="p-6 border-zinc-100 shadow-sm">
                <h3 className="text-lg font-medium text-zinc-800 mb-4">Activity Log</h3>
                <div className="relative border-l border-zinc-200 ml-3 space-y-6">
                    {activities.length === 0 && <p className="pl-6 text-zinc-400 text-sm italic">No activities recorded yet.</p>}
                    {activities.map((activity) => (
                        <div key={activity.id} className="mb-8 ml-6 relative group">
                            <span className={`absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${
                                activity.activityType === 'CALL' ? 'bg-blue-400' :
                                activity.activityType === 'MEETING' ? 'bg-purple-400' :
                                'bg-zinc-400'
                            }`}></span>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-sm font-medium text-zinc-900">{activity.summary}</h4>
                                    <p className="text-xs text-zinc-500">{new Date(activity.date).toLocaleString()}</p>
                                    <p className="text-sm text-zinc-600 mt-1">{activity.description}</p>
                                </div>
                                <span className="text-[10px] uppercase text-zinc-400 font-medium tracking-wider">
                                    {activity.activityType}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Notes */}
            {lead.notes && (
                <Card className="p-6 border-zinc-100 shadow-sm">
                    <h3 className="text-lg font-medium text-zinc-800 mb-2">Notes</h3>
                    <p className="text-zinc-600 text-sm whitespace-pre-wrap">{lead.notes}</p>
                </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Contact Info */}
            <Card className="p-6 border-zinc-100 shadow-sm bg-zinc-50/50">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Contact Details</h3>
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="text-zinc-400 text-xs">Email</p>
                        <p className="text-zinc-800 font-medium">{lead.email || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-zinc-400 text-xs">Phone</p>
                        <p className="text-zinc-800 font-medium">{lead.phone}</p>
                    </div>
                    <div>
                        <p className="text-zinc-400 text-xs">Assigned Vendor</p>
                        <p className="text-zinc-800 font-medium">{lead.assignedVendor?.name || 'Unassigned'}</p>
                    </div>
                </div>
            </Card>

            {/* Add Activity Form */}
            <Card className="p-6 border-zinc-100 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Log New Activity</h3>
                <form onSubmit={handleAddActivity} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1">Type</label>
                        <select 
                            className="w-full p-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-400 bg-zinc-50"
                            value={newActivity.activityType} 
                            onChange={e => setNewActivity({...newActivity, activityType: e.target.value as Activity['activityType']})}
                        >
                            <option value="CALL">Call</option>
                            <option value="MEETING">Meeting</option>
                            <option value="TASK">Task</option>
                            <option value="EMAIL">Email</option>
                        </select>
                    </div>
                    <Input 
                        label="Date & Time"
                        type="datetime-local" 
                        value={newActivity.date as string}
                        onChange={e => setNewActivity({...newActivity, date: e.target.value})}
                        required
                    />
                    <Input 
                        label="Summary"
                        placeholder="Brief summary"
                        value={newActivity.summary}
                        onChange={e => setNewActivity({...newActivity, summary: e.target.value})}
                        required
                    />
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1">Description</label>
                        <textarea 
                            className="w-full p-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-400 bg-zinc-50 h-24 resize-none"
                            value={newActivity.description || ''}
                            onChange={e => setNewActivity({...newActivity, description: e.target.value})}
                        />
                    </div>
                    <Button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800">
                        Add Activity
                    </Button>
                </form>
            </Card>
          </div>
      </div>
    </div>
  );
}