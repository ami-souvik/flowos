"use client";

import { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Types (Ideally move to types/index.ts)
interface Milestone { id: number; name: string; dueDate: string | null; status: string; }
interface DesignDoc { id: number; title: string; url: string; status: string; version: number; }
interface Task { id: number; title: string; assignedTo: string | null; status: string; dueDate: string | null; }
interface Project {
  id: number;
  name: string;
  lead: { name: string; budgetRange: string | null };
  status: string;
  budget: number;
  startDate: string | null;
  endDate: string | null;
  milestones: Milestone[];
  designDocs: DesignDoc[];
  tasks: Task[];
}

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProject(id);
  }, [id]);

  const fetchProject = async (pId: string) => {
    try {
      const res = await api.get(`/projects/${pId}/`);
      setProject(res.data);
    } catch (e) { console.error(e) } 
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    try {
      await api.delete(`/projects/${id}`);
      router.push('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) return <div className="p-12 text-center text-zinc-500 font-light">Loading project details...</div>;
  if (!project) return <div className="p-12 text-center text-zinc-500">Project not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <div className="flex items-center gap-3">
             <h2 className="text-3xl font-light text-zinc-900 dark:text-zinc-100">{project.name}</h2>
             <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-xs border border-zinc-200">
                {project.status}
             </span>
           </div>
           <p className="text-zinc-500 text-sm mt-1">Client: {project.lead.name} • Budget: ${Number(project.budget).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary">Client Portal View</Button>
            <Button>Edit Project</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Timeline & Designs */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Milestones */}
            <Card className="p-6 border-zinc-100 shadow-sm">
                <h3 className="text-lg font-medium text-zinc-800 mb-4">Project Timeline</h3>
                <div className="relative border-l border-zinc-200 ml-3 space-y-6">
                    {project.milestones.length === 0 && <p className="pl-6 text-zinc-400 text-sm italic">No milestones set.</p>}
                    {project.milestones.map((m) => (
                        <div key={m.id} className="mb-8 ml-6 relative group">
                            <span className={`absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${m.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-zinc-300'}`}></span>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-sm font-medium text-zinc-900">{m.name}</h4>
                                    <p className="text-xs text-zinc-500">{m.dueDate ? new Date(m.dueDate).toLocaleDateString() : 'No date'}</p>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded ${m.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                    {m.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Design Documents (Approvals) */}
            <Card className="p-6 border-zinc-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-zinc-800">Design Approvals</h3>
                    <Button size="sm" variant="ghost">Upload New</Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                     {project.designDocs.map((doc) => (
                         <div key={doc.id} className="group relative aspect-video bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 cursor-pointer hover:shadow-md transition-all">
                             <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-xs font-medium">
                                {doc.url ? 'Preview' : 'No Preview'}
                             </div>
                             <div className="absolute bottom-0 inset-x-0 bg-white/90 p-2 border-t border-zinc-100 backdrop-blur-sm">
                                 <p className="text-xs font-medium truncate text-zinc-800">{doc.title}</p>
                                 <div className="flex justify-between items-center mt-1">
                                     <span className="text-[10px] text-zinc-500">v{doc.version}</span>
                                     <span className={`text-[10px] font-medium ${
                                         doc.status === 'APPROVED' ? 'text-emerald-600' : 
                                         doc.status === 'REJECTED' ? 'text-red-600' : 'text-amber-600'
                                     }`}>{doc.status}</span>
                                 </div>
                             </div>
                         </div>
                     ))}
                     {project.designDocs.length === 0 && (
                         <div className="col-span-full py-8 text-center border-2 border-dashed border-zinc-200 rounded-lg text-zinc-400 text-sm">
                             No designs uploaded yet.
                         </div>
                     )}
                </div>
            </Card>
        </div>

        {/* Sidebar: Tasks & Quick Actions */}
        <div className="space-y-8">
            <Card className="p-6 border-zinc-100 shadow-sm bg-zinc-50/50">
                 <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Site Execution Tasks</h3>
                 <ul className="space-y-3">
                    {project.tasks.map((task) => (
                        <li key={task.id} className="flex items-start gap-3 p-3 bg-white rounded border border-zinc-200 shadow-sm">
                             <input type="checkbox" checked={task.status === 'DONE'} className="mt-1 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" readOnly />
                             <div className="flex-1 min-w-0">
                                 <p className={`text-sm ${task.status === 'DONE' ? 'text-zinc-400 line-through' : 'text-zinc-800'}`}>{task.title}</p>
                                 <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-zinc-500">{task.assignedTo || 'Unassigned'}</span>
                                    <span className="text-[10px] text-zinc-400">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</span>
                                 </div>
                             </div>
                        </li>
                    ))}
                    {project.tasks.length === 0 && <p className="text-zinc-400 text-sm italic text-center py-2">No active tasks.</p>}
                 </ul>
                 <Button className="w-full mt-4 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50" size="sm">Add Task</Button>
            </Card>
            
            <Card className="p-6 border-zinc-100 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">Client Info</h3>
                <div className="space-y-2 text-sm">
                    <p className="flex justify-between"><span className="text-zinc-500">Name:</span> <span className="text-zinc-800">{project.lead.name}</span></p>
                    <p className="flex justify-between"><span className="text-zinc-500">Budget Range:</span> <span className="text-zinc-800">{project.lead.budgetRange || 'N/A'}</span></p>
                    <div className="pt-4 mt-4 border-t border-zinc-100">
                         <Button className="w-full" size="sm" variant="secondary">Send Update Email</Button>
                    </div>
                </div>
            </Card>
        </div>

      </div>
    </div>
  );
}
