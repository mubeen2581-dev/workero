import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { User as Technician, ScheduleEvent } from '@/types';

interface SmartMatchPanelProps {
  job?: ScheduleEvent; // optional: when undefined, show hint
  technicians: Technician[];
  onAssign?: (technicianId: string) => void;
  onClose?: () => void;
  className?: string;
}

type RankedTech = Technician & { score: number; workloadHours: number; distanceKm: number };

const SmartMatchPanel: React.FC<SmartMatchPanelProps> = ({ job, technicians, onAssign, onClose, className = '' }) => {
  const [filters, setFilters] = useState({
    skills: [] as string[],
    maxDistance: 50,
    maxWorkload: 24,
    sort: 'score' as 'score' | 'distance' | 'workload',
  });

  const ranked = useMemo<RankedTech[]>(() => {
    // Very simple mocked ranking: prefer lower workload and arbitrary distance
    // In real app: use geolocation and actual workload calculations
    const requiredSkills: string[] = (job as any)?.requiredSkills || [];
    let list = technicians
      .map((t, idx) => {
        const workloadHours = (idx * 3) % 16; // mock 0..15h
        const distanceKm = 2 + (idx * 5) % 25; // mock 2..26km
        const skillMatch = requiredSkills.length
          ? Math.min(1, (t.skills || []).filter((s) => requiredSkills.includes(s)).length / requiredSkills.length)
          : 0.5;
        const score = Math.max(0, 100 - workloadHours * 3 - distanceKm) + Math.round(50 * skillMatch);
        return { ...t, score, workloadHours, distanceKm };
      });

    // Apply filters
    list = list.filter((t) => t.distanceKm <= filters.maxDistance && t.workloadHours <= filters.maxWorkload);
    if (filters.skills.length) list = list.filter((t) => (t.skills || []).some((s) => filters.skills.includes(s)));

    // Sort
    if (filters.sort === 'distance') list.sort((a, b) => a.distanceKm - b.distanceKm);
    else if (filters.sort === 'workload') list.sort((a, b) => a.workloadHours - b.workloadHours);
    else list.sort((a, b) => b.score - a.score);

    return list;
  }, [technicians, job, filters]);

  return (
    <Card className={className}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Smart Match</h3>
            <p className="text-sm text-gray-600">Recommended technicians {job ? `for "${job.title}"` : ''}</p>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
          )}
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-600">Max distance (km)</label>
            <input type="range" min={1} max={50} value={filters.maxDistance} onChange={(e) => setFilters({ ...filters, maxDistance: Number(e.target.value) })} className="w-full" />
            <div className="text-xs text-gray-700">{filters.maxDistance}km</div>
          </div>
          <div>
            <label className="text-xs text-gray-600">Max workload (h)</label>
            <input type="range" min={0} max={24} value={filters.maxWorkload} onChange={(e) => setFilters({ ...filters, maxWorkload: Number(e.target.value) })} className="w-full" />
            <div className="text-xs text-gray-700">{filters.maxWorkload}h</div>
          </div>
          <div>
            <label className="text-xs text-gray-600">Sort by</label>
            <select className="input w-full" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value as any })}>
              <option value="score">Best match</option>
              <option value="distance">Nearest</option>
              <option value="workload">Lowest workload</option>
            </select>
          </div>
          <div className="sm:col-span-3">
            <label className="text-xs text-gray-600">Required skills</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {Array.from(new Set(technicians.flatMap((t) => t.skills || []))).map((s) => (
                <button key={s} onClick={() => setFilters({ ...filters, skills: filters.skills.includes(s) ? filters.skills.filter((x) => x !== s) : [...filters.skills, s] })} className={`px-2 py-1 rounded-full text-xs border ${filters.skills.includes(s) ? 'bg-primary-100 text-primary-700 border-primary-200' : 'bg-white text-gray-700 border-gray-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {ranked.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">
            <div className="flex items-center gap-3 min-w-0">
              <img src={(t as any).avatar || 'https://via.placeholder.com/40'} alt={t.firstName} className="w-10 h-10 rounded-full object-cover" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{t.firstName} {t.lastName}</div>
                <div className="text-xs text-gray-600">Score {Math.round(t.score)} • {t.workloadHours}h workload • {t.distanceKm}km away</div>
                {t.skills && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {t.skills.slice(0, 4).map((s) => (
                      <span key={s} className="px-1.5 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-700">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Button variant="primary" size="sm" onClick={() => onAssign?.(t.id)}>Assign</Button>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default SmartMatchPanel;


