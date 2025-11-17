import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MapPin, Users, FileText, Calendar, DollarSign } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Table, TableHeader, TableHeaderCell, TableBody } from '@/components/ui/Table';
import { mockLeads } from '@/mocks/leads';
import { mockInvoices } from '@/mocks/invoices';

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const client = useMemo(() => {
    const fromLeads = mockLeads.find(l => l.client.id === id)?.client;
    return fromLeads || null;
  }, [id]);

  const clientLeads = useMemo(() => mockLeads.filter(l => l.client.id === id), [id]);
  const clientInvoices = useMemo(() => mockInvoices.filter(inv => inv.client.id === client?.id), [client]);

  if (!client) {
    return (
      <div className="p-6">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Client not found</h2>
          <Button variant="primary" onClick={() => navigate('/leads')}>Back to Leads</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>Back</Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600">Client Profile</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold">{client.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-gray-900">{client.name}</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {client.tags.map(tag => (
                  <Badge key={tag} className="bg-gray-100 text-gray-800">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-700"><Mail className="w-4 h-4" />{client.email}</div>
            <div className="flex items-center space-x-2 text-sm text-gray-700"><Phone className="w-4 h-4" />{client.phone}</div>
            <div className="flex items-center space-x-2 text-sm text-gray-700"><MapPin className="w-4 h-4" />{client.address.street}, {client.address.city}</div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">History</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <tr>
                    <TableHeaderCell>Type</TableHeaderCell>
                    <TableHeaderCell>Date</TableHeaderCell>
                    <TableHeaderCell>Details</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                  </tr>
                </TableHeader>
                <TableBody>
                  {clientLeads.map(lead => (
                    <tr key={`lead-${lead.id}`}>
                      <td className="text-sm">Lead</td>
                      <td className="text-sm">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="text-sm">{lead.notes || lead.source}</td>
                      <td className="text-sm capitalize">{lead.status}</td>
                    </tr>
                  ))}
                  {clientInvoices.map(inv => (
                    <tr key={`inv-${inv.id}`}>
                      <td className="text-sm">Invoice</td>
                      <td className="text-sm">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td className="text-sm">Total</td>
                      <td className="text-sm capitalize">{inv.status}</td>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{clientLeads.length}</p>
                </div>
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{clientInvoices.length}</p>
                </div>
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Last Activity</p>
                  <p className="text-2xl font-bold text-gray-900">{clientLeads[0] ? new Date(clientLeads[0].updatedAt).toLocaleDateString() : '-'}</p>
                </div>
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;


