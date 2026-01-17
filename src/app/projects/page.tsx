"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Trash2 } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  lead: { name: string };
  status: string;
  budget: number | string;
  startDate?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leads, setLeads] = useState<{ id: number, name: string }[]>([]);

  const [newProject, setNewProject] = useState<{
    name: string;
    leadId: string;
    status: string;
    budget: string;
    startDate: string;
    endDate: string;
  }>({
    name: '',
    leadId: '',
    status: 'CONCEPT',
    budget: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchProjects();
    fetchLeads();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      // Only show won leads ideally, but all for now
      setLeads(res.data);
    } catch (e) { console.error(e) }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setIsModalOpen(false);
      setNewProject({ name: '', leadId: '', status: 'CONCEPT', budget: '', startDate: '', endDate: '' });
      fetchProjects();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light text-zinc-900 dark:text-zinc-100">Interior Design Projects</h2>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          Create Project
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-400 font-light">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card className="border-zinc-100 shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-100 hover:bg-zinc-50/50">
                    <TableHead className="font-medium text-zinc-500">Project Name</TableHead>
                    <TableHead className="font-medium text-zinc-500">Client</TableHead>
                    <TableHead className="font-medium text-zinc-500">Status</TableHead>
                    <TableHead className="font-medium text-zinc-500">Budget</TableHead>
                    <TableHead className="font-medium text-zinc-500">Start Date</TableHead>
                    <TableHead className="font-medium text-zinc-500 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id} className="border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                      <TableCell className="font-medium text-zinc-800">{project.name}</TableCell>
                      <TableCell className="text-zinc-600">{project.lead?.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs tracking-wide ${project.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          project.status === 'EXECUTION' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-zinc-100 text-zinc-600 border border-zinc-200'
                          }`}>
                          {project.status}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-zinc-600 text-xs">${Number(project.budget).toLocaleString()}</TableCell>
                      <TableCell className="text-zinc-500 text-xs">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2 items-center">
                        <Link href={`/projects/${project.id}`} className="text-xs font-medium text-zinc-500 hover:text-zinc-900 border-b border-transparent hover:border-zinc-300 transition-all pb-0.5">
                          View Details
                        </Link>
                        <button 
                            onClick={() => handleDelete(project.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {projects.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-zinc-400 font-light">
                        No active projects. Start a new one to begin the design journey.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <Card className="w-full max-w-md bg-white border-zinc-200 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-lg font-medium text-zinc-900 mb-4">New Project</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <Input
                  label="Project Name"
                  placeholder="e.g. Modern Minimalist Apartment"
                  value={newProject.name}
                  onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Client (Lead)</label>
                  <select
                    className="w-full p-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-400 bg-zinc-50"
                    value={newProject.leadId}
                    onChange={e => setNewProject({ ...newProject, leadId: e.target.value })}
                    required
                  >
                    <option value="">Select Client</option>
                    {leads.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Budget"
                    type="number"
                    placeholder="0.00"
                    value={newProject.budget}
                    onChange={e => setNewProject({ ...newProject, budget: e.target.value })}
                  />
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Status</label>
                    <select
                      className="w-full p-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-400 bg-zinc-50"
                      value={newProject.status}
                      onChange={e => setNewProject({ ...newProject, status: e.target.value })}
                    >
                      <option value="CONCEPT">Concept</option>
                      <option value="DESIGN">Design</option>
                      <option value="PROCUREMENT">Procurement</option>
                      <option value="EXECUTION">Execution</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={newProject.startDate}
                    onChange={e => setNewProject({ ...newProject, startDate: e.target.value })}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={newProject.endDate}
                    onChange={e => setNewProject({ ...newProject, endDate: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-zinc-100">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-800">Cancel</Button>
                  <Button type="submit" className="bg-zinc-900 text-white hover:bg-zinc-800">Create Project</Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
