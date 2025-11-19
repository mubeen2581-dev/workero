import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, GripVertical, Folder } from 'lucide-react';
import { QuoteItem } from '@/types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface QuoteGroupsProps {
  items: QuoteItem[];
  onItemsChange: (items: QuoteItem[]) => void;
}

const QuoteGroups: React.FC<QuoteGroupsProps> = ({ items, onItemsChange }) => {
  const [groups, setGroups] = useState<string[]>(() => {
    const uniqueGroups = new Set(items.map(item => item.groupName || 'Uncategorized').filter(Boolean));
    return Array.from(uniqueGroups);
  });
  const [newGroupName, setNewGroupName] = useState('');
  const [showAddGroup, setShowAddGroup] = useState(false);

  const addGroup = () => {
    if (newGroupName.trim() && !groups.includes(newGroupName.trim())) {
      const updatedGroups = [...groups, newGroupName.trim()];
      setGroups(updatedGroups);
      setNewGroupName('');
      setShowAddGroup(false);
    }
  };

  const removeGroup = (groupName: string) => {
    const updatedGroups = groups.filter(g => g !== groupName);
    setGroups(updatedGroups);
    
    // Move items from removed group to "Uncategorized"
    const updatedItems = items.map(item => 
      item.groupName === groupName 
        ? { ...item, groupName: null, sortOrder: item.sortOrder || 0 }
        : item
    );
    onItemsChange(updatedItems);
  };

  const updateItemGroup = (itemId: string, newGroupName: string | null) => {
    const updatedItems = items.map(item => 
      item.id === itemId 
        ? { ...item, groupName: newGroupName, sortOrder: item.sortOrder || 0 }
        : item
    );
    onItemsChange(updatedItems);
  };

  const groupedItems = groups.reduce((acc, group) => {
    acc[group] = items.filter(item => item.groupName === group);
    return acc;
  }, {} as Record<string, QuoteItem[]>);

  const uncategorizedItems = items.filter(item => !item.groupName || !groups.includes(item.groupName));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Groups & Line Items</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddGroup(!showAddGroup)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Group
        </Button>
      </div>

      {showAddGroup && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex gap-2"
        >
          <Input
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Group name (e.g., Labor, Materials, Optional Add-ons)"
            onKeyPress={(e) => e.key === 'Enter' && addGroup()}
          />
          <Button onClick={addGroup} size="sm">Add</Button>
          <Button variant="outline" size="sm" onClick={() => {
            setShowAddGroup(false);
            setNewGroupName('');
          }}>Cancel</Button>
        </motion.div>
      )}

      <div className="space-y-6">
        {groups.map((group) => (
          <Card key={group} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                {group}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeGroup(group)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {groupedItems[group]?.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <span className="flex-1 text-sm">{item.description}</span>
                  <span className="text-sm font-medium text-gray-700">
                    £{item.lineTotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {uncategorizedItems.length > 0 && (
          <Card className="p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Uncategorized Items</h4>
            <div className="space-y-2">
              {uncategorizedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="flex-1 text-sm">{item.description}</span>
                  <select
                    value={item.groupName || ''}
                    onChange={(e) => updateItemGroup(item.id, e.target.value || null)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="">Select Group</option>
                    {groups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuoteGroups;



