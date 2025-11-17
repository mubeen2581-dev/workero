export type RAMSTemplate = { id: string; name: string; description: string };

export const ramsTemplates: RAMSTemplate[] = [
  { id: 'rams-1', name: 'Electrical Safety RAMS', description: 'Risk assessment and method statement for electrical works.' },
  { id: 'rams-2', name: 'Plumbing RAMS', description: 'RAMS for domestic/commercial plumbing tasks.' },
  { id: 'rams-3', name: 'General Construction RAMS', description: 'Generic construction RAMS covering on‑site safety.' },
];

export function generateRAMS(templateId: string, jobTitle: string = 'Assigned Job') {
  const tpl = ramsTemplates.find(t => t.id === templateId);
  const now = new Date().toLocaleDateString();
  const content = `# ${tpl?.name || 'RAMS'}\n\nDate: ${now}\nJob: ${jobTitle}\n\n## Risks\n- Working at height\n- Electrical hazards\n- Manual handling\n\n## Controls\n- PPE (gloves, eye protection)\n- Isolate power before work\n- Use proper lifting techniques\n\n## Method\n1. Site induction and toolbox talk.\n2. Risk controls in place and PPE donned.\n3. Execute task per manufacturer and company procedures.\n4. Clear site and dispose of waste safely.\n`;
  return content;
}


