import React, { useMemo, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { Lead } from '@/types';
import { mockLeads } from '@/mocks/leads';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

type Stage = 'new' | 'quoted' | 'won' | 'lost';

const stageTitles: Record<Stage, string> = {
  new: 'New',
  quoted: 'Quoted',
  won: 'Won',
  lost: 'Lost',
};

const stageColors: Record<Stage, string> = {
  new: 'bg-blue-50 border-blue-200',
  quoted: 'bg-purple-50 border-purple-200',
  won: 'bg-green-50 border-green-200',
  lost: 'bg-red-50 border-red-200',
};

const LeadsPipeline: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  const stages: Stage[] = ['new', 'quoted', 'won', 'lost'];

  const leadsByStage = useMemo(() => {
    const map: Record<Stage, Lead[]> = { new: [], quoted: [], won: [], lost: [] };
    for (const l of leads) {
      const s = (l.status === 'converted' ? 'won' : l.status) as Stage;
      if (map[s]) map[s].push(l);
    }
    return map;
  }, [leads]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    setLeads(prev => prev.map(l => {
      if (l.id !== draggableId) return l;
      const newStatus = destination.droppableId as Stage;
      return { ...l, status: newStatus === 'won' ? 'converted' : (newStatus as any) };
    }));
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lead Pipeline</h1>
        <p className="text-sm text-gray-600">Drag cards between stages to update status</p>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stages.map(stage => (
            <Card key={stage} className="p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">{stageTitles[stage]}</h3>
                <Badge className="bg-gray-100 text-gray-800">{leadsByStage[stage].length}</Badge>
              </div>
              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[300px] p-2 rounded-xl border transition-colors ${snapshot.isDraggingOver ? stageColors[stage] : 'border-gray-200'}`}
                  >
                    {leadsByStage[stage].map((l, index) => (
                      <Draggable draggableId={l.id} index={index} key={l.id}>
                        {(dragProvided, dragSnapshot) => (
                          <motion.div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3 bg-white border rounded-xl shadow-sm mb-2 ${dragSnapshot.isDragging ? 'shadow-md' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{l.client.name}</div>
                                <div className="text-xs text-gray-500">{l.client.email}</div>
                              </div>
                              <Badge className="bg-gray-100 text-gray-700 capitalize">{l.priority}</Badge>
                            </div>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Card>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default LeadsPipeline;


