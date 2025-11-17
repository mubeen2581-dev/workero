import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Props {
  onSave: (cfg: { frequencyDays: number; remindOnEmail: boolean; remindOnWhatsApp: boolean }) => void;
}

const FollowUpSettings: React.FC<Props> = ({ onSave }) => {
  const [freq, setFreq] = useState(3);
  const [email, setEmail] = useState(true);
  const [wa, setWa] = useState(true);
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow-up Reminder</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency (days)</label>
          <input type="number" min={1} className="input" value={freq} onChange={(e) => setFreq(parseInt(e.target.value || '1', 10))} />
        </div>
        <label className="inline-flex items-center space-x-2">
          <input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} />
          <span className="text-sm text-gray-700">Email reminders</span>
        </label>
        <label className="inline-flex items-center space-x-2">
          <input type="checkbox" checked={wa} onChange={(e) => setWa(e.target.checked)} />
          <span className="text-sm text-gray-700">WhatsApp reminders</span>
        </label>
      </div>
      <div className="flex justify-end mt-4">
        <Button variant="primary" onClick={() => onSave({ frequencyDays: freq, remindOnEmail: email, remindOnWhatsApp: wa })}>Save</Button>
      </div>
    </Card>
  );
};

export default FollowUpSettings;


