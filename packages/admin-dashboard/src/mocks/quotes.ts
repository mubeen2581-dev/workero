import { Quote, QuoteItem, Client } from '@/types';
import { mockClients } from './leads';

export const mockQuoteItems: QuoteItem[] = [
  {
    id: 'item-1',
    description: 'Kitchen Cabinet Installation - Custom Oak',
    quantity: 1,
    unitPrice: 2500,
    taxRate: 8.5,
    lineTotal: 2712.5,
  },
  {
    id: 'item-2',
    description: 'Granite Countertop - 2.5cm Thick',
    quantity: 25,
    unitPrice: 45,
    taxRate: 8.5,
    lineTotal: 1218.75,
  },
  {
    id: 'item-3',
    description: 'Stainless Steel Sink with Faucet',
    quantity: 1,
    unitPrice: 350,
    taxRate: 8.5,
    lineTotal: 379.75,
  },
  {
    id: 'item-4',
    description: 'Backsplash Tile Installation',
    quantity: 1,
    unitPrice: 800,
    taxRate: 8.5,
    lineTotal: 868,
  },
  {
    id: 'item-5',
    description: 'Electrical Outlet Installation',
    quantity: 4,
    unitPrice: 75,
    taxRate: 8.5,
    lineTotal: 325.5,
  },
  {
    id: 'item-6',
    description: 'Plumbing Connection for Dishwasher',
    quantity: 1,
    unitPrice: 200,
    taxRate: 8.5,
    lineTotal: 217,
  },
];

export const mockQuotes: Quote[] = [
  {
    id: 'quote-1',
    clientId: 'client-1',
    client: mockClients[0],
    items: mockQuoteItems.slice(0, 4),
    subtotal: 5375,
    taxAmount: 456.875,
    total: 5831.875,
    profitMargin: 25.5,
    status: 'sent',
    validUntil: '2024-12-30T00:00:00Z',
    notes: 'Premium kitchen renovation with custom oak cabinets and granite countertops. Includes all necessary electrical and plumbing work.',
    createdAt: '2024-12-10T10:00:00Z',
    updatedAt: '2024-12-15T14:30:00Z',
  },
  {
    id: 'quote-2',
    clientId: 'client-2',
    client: mockClients[1],
    items: [
      {
        id: 'item-7',
        description: 'Bathroom Vanity - 36" Double Sink',
        quantity: 1,
        unitPrice: 1200,
        taxRate: 8.5,
        lineTotal: 1302,
      },
      {
        id: 'item-8',
        description: 'Ceramic Tile Flooring',
        quantity: 45,
        unitPrice: 8,
        taxRate: 8.5,
        lineTotal: 367.2,
      },
      {
        id: 'item-9',
        description: 'Shower Tile Installation',
        quantity: 1,
        unitPrice: 1500,
        taxRate: 8.5,
        lineTotal: 1627.5,
      },
      {
        id: 'item-10',
        description: 'Toilet Installation',
        quantity: 1,
        unitPrice: 300,
        taxRate: 8.5,
        lineTotal: 325.5,
      },
    ],
    subtotal: 3394.5,
    taxAmount: 288.5325,
    total: 3683.0325,
    profitMargin: 22.8,
    status: 'accepted',
    validUntil: '2024-12-25T00:00:00Z',
    notes: 'Complete bathroom remodel including vanity, flooring, and shower. Urgent timeline required.',
    createdAt: '2024-12-05T14:30:00Z',
    updatedAt: '2024-12-14T16:45:00Z',
  },
  {
    id: 'quote-3',
    clientId: 'client-3',
    client: mockClients[2],
    items: [
      {
        id: 'item-11',
        description: 'Electrical Panel Upgrade - 200 Amp',
        quantity: 1,
        unitPrice: 1800,
        taxRate: 8.5,
        lineTotal: 1953,
      },
      {
        id: 'item-12',
        description: 'GFCI Outlet Installation',
        quantity: 6,
        unitPrice: 85,
        taxRate: 8.5,
        lineTotal: 552.75,
      },
      {
        id: 'item-13',
        description: 'Electrical Wiring - Kitchen',
        quantity: 1,
        unitPrice: 400,
        taxRate: 8.5,
        lineTotal: 434,
      },
    ],
    subtotal: 2805.75,
    taxAmount: 238.48875,
    total: 3044.23875,
    profitMargin: 18.2,
    status: 'draft',
    validUntil: '2024-12-20T00:00:00Z',
    notes: 'Electrical panel upgrade for commercial property. Includes GFCI outlets and kitchen wiring.',
    createdAt: '2024-12-08T09:15:00Z',
    updatedAt: '2024-12-12T11:30:00Z',
  },
  {
    id: 'quote-4',
    clientId: 'client-4',
    client: mockClients[3],
    items: [
      {
        id: 'item-14',
        description: 'Premium Kitchen Design Consultation',
        quantity: 1,
        unitPrice: 500,
        taxRate: 8.5,
        lineTotal: 542.5,
      },
      {
        id: 'item-15',
        description: 'Custom Cabinet Design & Build',
        quantity: 1,
        unitPrice: 8500,
        taxRate: 8.5,
        lineTotal: 9222.5,
      },
      {
        id: 'item-16',
        description: 'Quartz Countertop - Premium Grade',
        quantity: 30,
        unitPrice: 65,
        taxRate: 8.5,
        lineTotal: 2111.25,
      },
      {
        id: 'item-17',
        description: 'High-End Appliance Package',
        quantity: 1,
        unitPrice: 12000,
        taxRate: 8.5,
        lineTotal: 13020,
      },
    ],
    subtotal: 24375,
    taxAmount: 2071.875,
    total: 26446.875,
    profitMargin: 35.2,
    status: 'sent',
    validUntil: '2024-12-28T00:00:00Z',
    notes: 'Premium kitchen renovation with custom cabinets and high-end appliances. Client has approved design concepts.',
    createdAt: '2024-12-12T11:00:00Z',
    updatedAt: '2024-12-15T09:30:00Z',
  },
  {
    id: 'quote-5',
    clientId: 'client-5',
    client: mockClients[4],
    items: [
      {
        id: 'item-18',
        description: 'Emergency Plumbing Repair',
        quantity: 1,
        unitPrice: 150,
        taxRate: 8.5,
        lineTotal: 162.75,
      },
      {
        id: 'item-19',
        description: 'Pipe Replacement - 2 sections',
        quantity: 2,
        unitPrice: 200,
        taxRate: 8.5,
        lineTotal: 434,
      },
      {
        id: 'item-20',
        description: 'Water Damage Assessment',
        quantity: 1,
        unitPrice: 100,
        taxRate: 8.5,
        lineTotal: 108.5,
      },
    ],
    subtotal: 450,
    taxAmount: 38.25,
    total: 488.25,
    profitMargin: 15.0,
    status: 'accepted',
    validUntil: '2024-12-18T00:00:00Z',
    notes: 'Emergency plumbing repair due to water damage. Urgent work required.',
    createdAt: '2024-12-14T16:30:00Z',
    updatedAt: '2024-12-15T09:15:00Z',
  },
  {
    id: 'quote-6',
    clientId: 'client-6',
    client: mockClients[5],
    items: [
      {
        id: 'item-21',
        description: 'HVAC System Maintenance - Annual',
        quantity: 1,
        unitPrice: 800,
        taxRate: 8.5,
        lineTotal: 868,
      },
      {
        id: 'item-22',
        description: 'Filter Replacement Package',
        quantity: 1,
        unitPrice: 150,
        taxRate: 8.5,
        lineTotal: 162.75,
      },
      {
        id: 'item-23',
        description: 'Duct Cleaning Service',
        quantity: 1,
        unitPrice: 400,
        taxRate: 8.5,
        lineTotal: 434,
      },
    ],
    subtotal: 1350,
    taxAmount: 114.75,
    total: 1464.75,
    profitMargin: 20.5,
    status: 'draft',
    validUntil: '2024-12-22T00:00:00Z',
    notes: 'Annual HVAC maintenance contract for office building. Includes filter replacement and duct cleaning.',
    createdAt: '2024-12-10T15:20:00Z',
    updatedAt: '2024-12-13T10:45:00Z',
  },
];

export const mockQuoteStatuses = [
  { value: 'draft', label: 'Draft', count: 2, color: 'bg-gray-100 text-gray-800' },
  { value: 'sent', label: 'Sent', count: 2, color: 'bg-blue-100 text-blue-800' },
  { value: 'accepted', label: 'Accepted', count: 2, color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', count: 0, color: 'bg-red-100 text-red-800' },
  { value: 'expired', label: 'Expired', count: 0, color: 'bg-yellow-100 text-yellow-800' },
];

export const mockAISuggestions = [
  {
    id: 'suggestion-1',
    category: 'materials',
    title: 'Recommended Materials',
    description: 'Based on your project description, consider these high-quality materials:',
    items: [
      { name: 'Premium Oak Cabinets', price: 2500, reason: 'Matches client preference for natural wood' },
      { name: 'Granite Countertops', price: 45, reason: 'Durable and easy to maintain' },
      { name: 'Stainless Steel Appliances', price: 1200, reason: 'Modern look, long-lasting' },
    ],
  },
  {
    id: 'suggestion-2',
    category: 'labor',
    title: 'Labor Estimates',
    description: 'Estimated labor costs based on project scope:',
    items: [
      { name: 'Cabinet Installation', price: 800, reason: '2-3 days for custom cabinets' },
      { name: 'Countertop Installation', price: 400, reason: '1 day including templating' },
      { name: 'Electrical Work', price: 300, reason: 'Outlet installation and wiring' },
    ],
  },
  {
    id: 'suggestion-3',
    category: 'addons',
    title: 'Recommended Add-ons',
    description: 'Additional services that could increase project value:',
    items: [
      { name: 'Under-cabinet Lighting', price: 250, reason: 'Enhances kitchen functionality' },
      { name: 'Soft-close Hardware', price: 150, reason: 'Premium feature, client satisfaction' },
      { name: 'Backsplash Installation', price: 600, reason: 'Completes the kitchen look' },
    ],
  },
];

export const mockQuoteTemplates = [
  {
    id: 'template-1',
    name: 'Kitchen Renovation',
    description: 'Complete kitchen renovation template',
    items: [
      { description: 'Cabinet Installation', quantity: 1, unitPrice: 2500 },
      { description: 'Countertop Installation', quantity: 25, unitPrice: 45 },
      { description: 'Sink & Faucet', quantity: 1, unitPrice: 350 },
      { description: 'Backsplash', quantity: 1, unitPrice: 800 },
    ],
  },
  {
    id: 'template-2',
    name: 'Bathroom Remodel',
    description: 'Standard bathroom remodel template',
    items: [
      { description: 'Vanity Installation', quantity: 1, unitPrice: 1200 },
      { description: 'Tile Flooring', quantity: 45, unitPrice: 8 },
      { description: 'Shower Tile', quantity: 1, unitPrice: 1500 },
      { description: 'Toilet Installation', quantity: 1, unitPrice: 300 },
    ],
  },
  {
    id: 'template-3',
    name: 'Electrical Upgrade',
    description: 'Electrical panel and outlet upgrade',
    items: [
      { description: 'Panel Upgrade', quantity: 1, unitPrice: 1800 },
      { description: 'GFCI Outlets', quantity: 6, unitPrice: 85 },
      { description: 'Wiring', quantity: 1, unitPrice: 400 },
    ],
  },
];

export const calculateQuoteTotal = (items: QuoteItem[]): { subtotal: number; taxAmount: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
  const total = subtotal + taxAmount;
  
  return { subtotal, taxAmount, total };
};

export const generateAISuggestions = (description: string): any[] => {
  // Mock AI suggestions based on description keywords
  const suggestions = [];
  
  if (description.toLowerCase().includes('kitchen')) {
    suggestions.push(mockAISuggestions[0]);
  }
  
  if (description.toLowerCase().includes('bathroom')) {
    suggestions.push(mockAISuggestions[1]);
  }
  
  if (description.toLowerCase().includes('electrical')) {
    suggestions.push(mockAISuggestions[2]);
  }
  
  return suggestions;
};
