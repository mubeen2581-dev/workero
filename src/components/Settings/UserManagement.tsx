import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  Key,
  Settings
} from 'lucide-react';
import { 
  mockUserProfiles, 
  getRoles,
  getPermissions
} from '@/mocks/settings';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { Table } from '../ui/Table';
import { formatDistanceToNow } from 'date-fns';

interface UserManagementProps {
  className?: string;
}

const UserManagement: React.FC<UserManagementProps> = ({
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const roles = getRoles();
  const permissions = getPermissions();

  const filteredUsers = useMemo(() => {
    let filtered = mockUserProfiles.filter(user => {
      const matchesSearch = 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.userId.includes(roleFilter);
      const matchesStatus = statusFilter === 'all' || user.userId.includes(statusFilter);

      return matchesSearch && matchesRole && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'created':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updated':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        default:
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [mockUserProfiles, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  const getRoleColor = (roleId: string) => {
    const colorMap: Record<string, string> = {
      'role-1': 'bg-red-100 text-red-800',
      'role-2': 'bg-blue-100 text-blue-800',
      'role-3': 'bg-green-100 text-green-800',
      'role-4': 'bg-purple-100 text-purple-800',
    };
    return colorMap[roleId] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? CheckCircle : XCircle;
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.userId));
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on users:`, selectedUsers);
    // Implement bulk actions here
  };

  const columns = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
          onChange={handleSelectAll}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
      render: (user: any) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(user.userId)}
          onChange={() => handleSelectUser(user.userId)}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
    {
      key: 'user',
      header: 'User',
      render: (user: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
            ) : (
              <Users className="w-5 h-5 text-primary-600" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: () => {
        const role = roles.find(r => r.id === 'role-1'); // Mock role assignment
        return (
          <Badge className={getRoleColor(role?.id || '')}>
            {role?.name || 'No Role'}
          </Badge>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: () => {
        const isActive = true; // Mock active status
        const StatusIcon = getStatusIcon(isActive);
        return (
          <Badge className={getStatusColor(isActive)}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      key: 'preferences',
      header: 'Preferences',
      render: (user: any) => (
        <div className="text-sm text-gray-600">
          <p className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>{user.preferences.theme}</span>
          </p>
          <p className="text-xs text-gray-500">{user.timezone}</p>
        </div>
      ),
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      render: (user: any) => (
        <div className="text-sm text-gray-600">
          <p>{formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true })}</p>
          <p className="text-xs text-gray-500">
            {new Date(user.updatedAt).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: any) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={() => console.log('View user:', user.userId)}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => console.log('Edit user:', user.userId)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Key}
            onClick={() => console.log('Reset password:', user.userId)}
          >
            Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => console.log('Delete user:', user.userId)}
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm sm:text-base text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button variant="secondary" icon={Download} className="hidden sm:flex">
            Export Users
          </Button>
          <Button variant="secondary" icon={Download} className="sm:hidden p-2">
            <span className="sr-only">Export Users</span>
          </Button>
          <Button variant="primary" icon={UserPlus} className="flex-1 sm:flex-none">
            <span className="hidden sm:inline">Add User</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">{mockUserProfiles.length}</p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
              <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{mockUserProfiles.length}</p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Roles</p>
              <p className="text-lg sm:text-2xl font-bold text-purple-600">{roles.length}</p>
            </div>
            <div className="p-2 sm:p-3 bg-purple-100 rounded-xl">
              <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Permissions</p>
              <p className="text-lg sm:text-2xl font-bold text-orange-600">{permissions.length}</p>
            </div>
            <div className="p-2 sm:p-3 bg-orange-100 rounded-xl">
              <Settings className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <Select
              value={roleFilter}
              onChange={(value) => setRoleFilter(value)}
              options={[
                { value: 'all', label: 'All Roles' },
                ...roles.map(role => ({
                  value: role.id,
                  label: role.name,
                }))
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <div className="flex space-x-2">
              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                options={[
                  { value: 'name', label: 'Name' },
                  { value: 'email', label: 'Email' },
                  { value: 'created', label: 'Created' },
                  { value: 'updated', label: 'Last Active' },
                ]}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkAction('activate')}
                >
                  Activate
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkAction('deactivate')}
                >
                  Deactivate
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkAction('export')}
                >
                  Export Selected
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedUsers([])}
            >
              Clear Selection
            </Button>
          </div>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {mockUserProfiles.length} users
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" icon={Filter}>
            More Filters
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <Table className="w-full">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-sm text-gray-900">
                    {column.render(user)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first user.'
            }
          </p>
          <Button variant="primary" icon={UserPlus}>
            Add User
          </Button>
        </Card>
      )}
    </motion.div>
  );
};

export default UserManagement;
