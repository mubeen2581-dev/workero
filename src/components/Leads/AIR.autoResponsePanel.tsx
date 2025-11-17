import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

interface Props {
  onSave: (config: { enabled: boolean; tone: string; delayMinutes: number }) => void;
}

const AIAutoResponsePanel: React.FC<Props> = ({ onSave }) => {
  const [enabled, setEnabled] = useState(false);
  const [tone, setTone] = useState('friendly');
  const [delay, setDelay] = useState(5);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">AI Auto-Response</h3>
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-primary-500 relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-4 after:w-4 after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Select label="Tone" options={[{ value: 'friendly', label: 'Friendly' }, { value: 'formal', label: 'Formal' }, { value: 'concise', label: 'Concise' }]} value={tone} onChange={(v) => setTone(v as string)} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delay (minutes)</label>
          <input type="number" min={0} className="input" value={delay} onChange={(e) => setDelay(parseInt(e.target.value || '0', 10))} />
        </div>
        <div className="flex items-end">
          <Button variant="primary" onClick={() => onSave({ enabled, tone, delayMinutes: delay })}>Save</Button>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3">Auto-replies will be sent to new inbound messages when enabled.</p>
    </Card>
  );
};

export default AIAutoResponsePanel;


