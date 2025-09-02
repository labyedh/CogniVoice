import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Loader2, Download } from 'lucide-react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useAdmin } from '../../contexts/AdminContext'; // Updated import path
import { AdminUser } from '../../types/admin';
import { exportUsers } from '../../api/admin'; // <-- IMPORT our new function

const UsersManagement: React.FC = () => {
  const { users, updateUser, deleteUser, createUser } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'moderate' | 'high'>('all');
  
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isExporting, setIsExporting] = useState(false); // <-- Add state for export button

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user' as 'user' | 'admin',
    isActive: true
  });

  useEffect(() => {
    if (!showModal) {
      setEditingUser(null);
      setFormData({ firstName: '', lastName: '', email: '', role: 'user', isActive: true });
      setModalError(null);
    }
  }, [showModal]);

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);
    
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        // The API service expects only these fields for creation
        await createUser(formData);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save user:", error);
      setModalError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(id);
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert(error instanceof Error ? error.message : "Failed to delete user.");
      }
    }
  };
  const handleExport = async () => {
    setIsExporting(true);
    try {
        await exportUsers();
    } catch (error) {
        console.error("Export failed:", error);
        alert("Could not export users. Please check the console for details.");
    } finally {
        setIsExporting(false);
    }
};

  const getRiskBadge = (risk?: string) => {
    if (!risk) return null;
    
    const colors = {
      low: 'bg-green-100 text-green-700',
      moderate: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[risk as keyof typeof colors]}`}>
        {risk}
      </span>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesRisk = filterRisk === 'all' || user.riskLevel === filterRisk;
    
    return matchesSearch && matchesRole && matchesRisk;
  });

  return (
    <DashboardLayout title="Users Management" subtitle="Manage user accounts and permissions">
      <div className="space-y-6">
        
  
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B177E] focus:border-transparent"
              />
            </div>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B177E] focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
            
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B177E] focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
          
          <div className="flex gap-2">
                <button 
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex items-center justify-center w-28 space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                    {isExporting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                        </>
                    )}
                </button>
            <button
              onClick={handleCreate}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#9B177E] to-[#2A1458] hover:from-[#2A1458] hover:to-[#9B177E] text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#FFEAD8]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#FFEAD8] to-[#E8988A]/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#2A1458] uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#2A1458] uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#2A1458] uppercase tracking-wider">Analyses</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#2A1458] uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#2A1458] uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#2A1458] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#2A1458] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#FFEAD8]/20 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[#2A1458]">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.analysisCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRiskBadge(user.riskLevel)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-[#9B177E] hover:text-[#2A1458] transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Modal for Edit/Create */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-[#2A1458] mb-4">
                {editingUser ? 'Edit User' : 'Create New User'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* All form inputs are the same as what you provided */}
                <div className="grid grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#2A1458] mb-1">First Name</label>
                    <input type="text" required value={formData.firstName} onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B177E] focus:border-transparent" />
                  </div>
                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#2A1458] mb-1">Last Name</label>
                    <input type="text" required value={formData.lastName} onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B177E] focus:border-transparent" />
                  </div>
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[#2A1458] mb-1">Email</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B177E] focus:border-transparent" />
                </div>
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-[#2A1458] mb-1">Role</label>
                  <select value={formData.role} onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B177E] focus:border-transparent">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {/* Is Active Checkbox */}
                <div className="flex items-center">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} className="h-4 w-4 text-[#9B177E] focus:ring-[#9B177E] border-gray-300 rounded" />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-[#2A1458]">Active Account</label>
                </div>
                
                {/* Error message display */}
                {modalError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                    {modalError}
                  </div>
                )}
                
                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex items-center justify-center w-28 bg-gradient-to-r from-[#9B177E] to-[#2A1458] hover:from-[#2A1458] hover:to-[#9B177E] text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingUser ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default UsersManagement;