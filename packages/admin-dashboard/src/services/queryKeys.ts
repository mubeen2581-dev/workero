export const queryKeys = {
  inventory: {
    driverStock: (technicianId: string) => ['inventory', 'driverStock', technicianId] as const,
    transfers: ['inventory', 'transfers'] as const,
    audit: ['inventory', 'audit'] as const,
  },
};


