import { Lead } from '@/types';

/**
 * Export leads to CSV format
 */
export const exportLeadsToCSV = (leads: Lead[], filename: string = 'leads-export.csv') => {
  if (leads.length === 0) {
    return;
  }

  // Define CSV headers
  const headers = [
    'Client Name',
    'Email',
    'Phone',
    'Address',
    'City',
    'State',
    'Zip Code',
    'Source',
    'Status',
    'Priority',
    'Estimated Value',
    'Lead Score',
    'Assigned To',
    'Notes',
    'Created At',
    'Updated At',
  ];

  // Convert leads to CSV rows
  const rows = leads.map(lead => {
    const client = lead.client;
    const address = client?.address || {};
    
    return [
      client?.name || '',
      client?.email || '',
      client?.phone || '',
      address.street || '',
      address.city || '',
      address.state || '',
      address.zipCode || '',
      lead.source || '',
      lead.status || '',
      lead.priority || '',
      (lead.estimatedValue || lead.estimated_value || 0).toString(),
      (client?.leadScore || 0).toString(),
      lead.assigned_user 
        ? `${lead.assigned_user.first_name} ${lead.assigned_user.last_name}`
        : lead.assignedTo || lead.assigned_to || 'Unassigned',
      lead.notes || '',
      lead.createdAt || lead.created_at || '',
      lead.updatedAt || lead.updated_at || '',
    ];
  });

  // Escape CSV values (handle commas, quotes, newlines)
  const escapeCSV = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  // Combine headers and rows
  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

