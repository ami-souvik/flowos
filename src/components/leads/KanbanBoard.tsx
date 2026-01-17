'use client';

import React, { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';

const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'NEGOTIATION', 'WON', 'LOST'];

interface KanbanBoardProps {
  leads: Lead[];
  onLeadUpdate: (lead: Lead) => void;
}

export default function KanbanBoard({ leads, onLeadUpdate }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<number | null>(null);

  // Group leads by status
  const columns = useMemo(() => {
    const cols: Record<string, Lead[]> = {};
    STATUSES.forEach(status => {
      cols[status] = leads.filter(l => l.status === status);
    });
    return cols;
  }, [leads]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeLeadId = active.id as number;
    const overId = over.id; // This could be a lead ID or a container ID (status)

    // Find the active lead
    const activeLead = leads.find(l => l.id === activeLeadId);
    if (!activeLead) return;

    // Determine the new status
    let newStatus = activeLead.status;

    if (STATUSES.includes(overId as string)) {
      // Dropped directly on a column
      newStatus = overId as string;
    } else {
      // Dropped on another card
      const overLead = leads.find(l => l.id === overId);
      if (overLead) {
        newStatus = overLead.status;
      }
    }

    if (activeLead.status !== newStatus) {
      onLeadUpdate({ ...activeLead, status: newStatus });
    }

    setActiveId(null);
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full overflow-x-auto gap-4 pb-4">
        {STATUSES.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            leads={columns[status] || []}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeId ? (
           <LeadCard lead={leads.find(l => l.id === activeId)!} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({ status, leads }: { status: string; leads: Lead[] }) {
  // We use the status as the id for the droppable container if needed, 
  // but for SortableContext we need items.
  // Actually, mixing droppable containers and sortable items is common.
  // To keep it simple, we'll make the Column a Droppable area effectively 
  // by using SortableContext with the items inside it.
  
  // Note: We are using the status string as a droppable ID in DndContext logic manually if needed,
  // but let's see how SortableContext behaves.
  
  return (
    <div className="flex-shrink-0 w-80 bg-gray-100 dark:bg-neutral-800 rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">{status}</h3>
        <span className="bg-gray-200 dark:bg-neutral-700 px-2 py-0.5 rounded-full text-xs text-gray-600 dark:text-gray-400">
          {leads.length}
        </span>
      </div>
      
      <SortableContext
        id={status} // This makes the column itself a valid drop target if empty? No, SortableContext just provides strategy.
        items={leads.map(l => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div 
            // We need a ref for the droppable area? 
            // Dnd-kit's SortableContext doesn't provide a DOM node ref directly.
            // We usually wrap this in a Droppable if we want the *empty* column to be a target.
            // But SortableContext items act as targets.
            // If the list is empty, we can't drop on it easily unless we make the container droppable.
        >
          <DroppableContainer id={status} className="flex-1 min-h-[150px] space-y-3">
            {leads.map(lead => (
              <SortableLeadItem key={lead.id} lead={lead} />
            ))}
          </DroppableContainer>
        </div>
      </SortableContext>
    </div>
  );
}

// Helper to make the empty column area droppable
import { useDroppable } from '@dnd-kit/core';

function DroppableContainer({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
}


function SortableLeadItem({ lead }: { lead: Lead }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LeadCard lead={lead} />
    </div>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <Card className="cursor-grab hover:shadow-md transition-shadow bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700">
      <CardContent className="p-4 space-y-2">
        <div className="font-medium text-gray-900 dark:text-white truncate">
          {lead.name}
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>{lead.phone}</span>
        </div>
        {lead.source && (
          <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded inline-block">
            {lead.source}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
