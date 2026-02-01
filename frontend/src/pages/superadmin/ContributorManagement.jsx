import { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock,
  Search,
  Filter,
  Ban,
  Trash2,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  Loader2,
  AlertCircle,
  ChevronDown,
  RotateCcw,
  Eye,
  X,
  MapPin,
  Link as LinkIcon,
  Linkedin,
  Shield,
  Star,
  Award
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import VerifiedBadge from '../../components/common/VerifiedBadge';

const ContributorManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [contributors, setContributors] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [approvedRes, pendingRes] = await Promise.all([
        api.get('/users/approved'),
        api.get('/users/pending'),
      ]);
      setContributors(approvedRes.data.data || []);
      setPendingUsers(pendingRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch contributors');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      setDetailsLoading(true);
      const response = await api.get(`/users/${userId}`);
      setSelectedUserDetails(response.data.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to fetch user details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      setActionLoading(userId);
      await api.put(`/users/${userId}/approve`);
      toast.success('User approved successfully');
      await fetchData();
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error('Failed to approve user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId) => {
    try {
      setActionLoading(userId);
      await api.put(`/users/${userId}/reject`, { reason: 'Application rejected by admin' });
      toast.success('User rejected');
      await fetchData();
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast.error('Failed to reject user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlock = async (userId) => {
    try {
      setActionLoading(userId);
      await api.put(`/users/${userId}/block`);
      toast.success('User blocked successfully');
      await fetchData();
      setShowConfirmModal(null);
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Failed to block user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      setActionLoading(userId);
      await api.put(`/users/${userId}/unblock`);
      toast.success('User unblocked successfully');
      await fetchData();
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast.error('Failed to unblock user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    try {
      setActionLoading(userId);
      await api.delete(`/users/${userId}`);
      toast.success('User deleted permanently');
      await fetchData();
      setShowConfirmModal(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      job_poster: { label: 'Job Contributor', color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' },
      resource_poster: { label: 'Resource Contributor', color: 'bg-blue-200 dark:bg-blue-400/20 text-blue-800 dark:text-blue-200' },
      tech_blog_poster: { label: 'Blog Contributor', color: 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300' },
      blog_poster: { label: 'Blog Contributor', color: 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300' },
      digital_product_poster: { label: 'Product Contributor', color: 'bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400' },
      others: { label: 'Other', color: 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300' },
    };
    const config = roleConfig[role] || roleConfig.others;
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { label: 'Active', color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' },
      pending: { label: 'Pending', color: 'bg-blue-50 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400' },
      blocked: { label: 'Blocked', color: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300' },
      rejected: { label: 'Rejected', color: 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter active contributors (not blocked)
  const activeContributors = contributors.filter(u => u.status === 'approved');
  const blockedContributors = contributors.filter(u => u.status === 'blocked');

  // Apply search and role filter for active contributors
  const filteredActiveContributors = activeContributors.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Apply search and role filter for blocked contributors
  const filteredBlockedContributors = blockedContributors.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Contributor Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage all contributors and pending approvals
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-200 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{contributors.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Contributors</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-200 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-400/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingUsers.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pending Approval</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-200 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeContributors.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-200 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{blockedContributors.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Blocked Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-dark-200 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === 'all'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              All Contributors
              {activeTab === 'all' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                activeTab === 'pending'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Pending Approval
              {pendingUsers.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  {pendingUsers.length}
                </span>
              )}
              {activeTab === 'pending' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('blocked')}
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                activeTab === 'blocked'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Blocked Users
              {blockedContributors.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {blockedContributors.length}
                </span>
              )}
              {activeTab === 'blocked' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>
        </div>

        {/* All Contributors Tab */}
        {activeTab === 'all' && (
          <>
            {/* Search & Filter */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-9 pr-8 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                >
                  <option value="">All Roles</option>
                  <option value="job_poster">Job Contributor</option>
                  <option value="resource_poster">Resource Contributor</option>
                  <option value="tech_blog_poster">Blog Contributor</option>
                  <option value="digital_product_poster">Product Contributor</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Contributors Cards Grid */}
            <div className="p-4">
              {filteredActiveContributors.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Contributors Found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm || roleFilter ? 'Try adjusting your search or filter' : 'No active contributors yet'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredActiveContributors.map((user) => (
                    <div key={user._id} className="bg-white dark:bg-dark-100 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-700">
                      {/* Header with Avatar and Status */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-xl object-cover border-2 border-gray-100 dark:border-gray-700" />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                              {user.name}
                              <VerifiedBadge user={user} size="sm" />
                            </h3>
                            {getRoleBadge(user.role)}
                          </div>
                        </div>
                        {getStatusBadge(user.status)}
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2.5 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span>{user.phone || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span>Joined: {formatDate(user.createdAt)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => fetchUserDetails(user._id)}
                          disabled={detailsLoading}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Full Details
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowConfirmModal({ type: 'block', user })}
                            disabled={actionLoading === user._id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl font-medium hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors"
                          >
                            <Ban className="w-4 h-4" />
                            Block
                          </button>
                          <button
                            onClick={() => setShowConfirmModal({ type: 'delete', user })}
                            disabled={actionLoading === user._id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Pending Approval Tab */}
        {activeTab === 'pending' && (
          <div className="p-4">
            {pendingUsers.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-blue-500 opacity-50" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  All Caught Up!
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  No pending approval requests at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {pendingUsers.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white dark:bg-dark-100 rounded-2xl border border-blue-200 dark:border-blue-800 p-5"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-xl object-cover border-2 border-gray-100 dark:border-gray-700" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                          {user.name}
                          <VerifiedBadge user={user} size="sm" />
                        </h3>
                        {getRoleBadge(user.role)}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>Applied: {formatDate(user.createdAt)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(user._id)}
                        disabled={actionLoading === user._id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors"
                      >
                        {actionLoading === user._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(user._id)}
                        disabled={actionLoading === user._id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-dark-300 hover:bg-gray-200 dark:hover:bg-dark-200 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors"
                      >
                        {actionLoading === user._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Blocked Users Tab */}
        {activeTab === 'blocked' && (
          <div className="p-4">
            {/* Search for blocked users */}
            <div className="mb-4 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search blocked users..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {filteredBlockedContributors.length === 0 ? (
              <div className="py-12 text-center">
                <UserCheck className="w-16 h-16 mx-auto mb-4 text-blue-500 opacity-50" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Blocked Users
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No blocked users match your search' : 'All users are currently active on the platform.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredBlockedContributors.map((user) => (
                  <div key={user._id} className="bg-white dark:bg-dark-100 rounded-2xl border border-red-200 dark:border-red-800 p-5 hover:shadow-lg transition-all duration-300">
                    {/* Header with Avatar and Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-xl object-cover border-2 border-gray-100 dark:border-gray-700 opacity-75" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-xl">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                            {user.name}
                            <VerifiedBadge user={user} size="sm" />
                          </h3>
                          {getRoleBadge(user.role)}
                        </div>
                      </div>
                      {getStatusBadge(user.status)}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>{user.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>Blocked: {formatDate(user.blockedAt || user.updatedAt || user.createdAt)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => fetchUserDetails(user._id)}
                        disabled={detailsLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Full Details
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUnblock(user._id)}
                          disabled={actionLoading === user._id}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl font-medium hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors"
                        >
                          {actionLoading === user._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <RotateCcw className="w-4 h-4" />
                              Unblock
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setShowConfirmModal({ type: 'delete', user })}
                          disabled={actionLoading === user._id}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">About Blocked Users</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    Blocked users cannot login to the platform and will see an error message when they try. 
                    Their posts and data remain intact. You can unblock them anytime to restore their access. 
                    Only delete if you want to permanently remove the user and all their data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                showConfirmModal.type === 'delete' 
                  ? 'bg-red-100 dark:bg-red-500/20' 
                  : 'bg-orange-100 dark:bg-orange-500/20'
              }`}>
                {showConfirmModal.type === 'delete' ? (
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                ) : (
                  <Ban className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {showConfirmModal.type === 'delete' ? 'Delete User' : 'Block User'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {showConfirmModal.user.name}
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {showConfirmModal.type === 'delete' 
                ? 'Are you sure you want to permanently delete this user? This action cannot be undone and all their data will be removed.'
                : 'Are you sure you want to block this user? They will not be able to login to the platform until you unblock them.'
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => showConfirmModal.type === 'delete' 
                  ? handleDelete(showConfirmModal.user._id) 
                  : handleBlock(showConfirmModal.user._id)
                }
                disabled={actionLoading === showConfirmModal.user._id}
                className={`flex-1 px-4 py-2.5 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                  showConfirmModal.type === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {actionLoading === showConfirmModal.user._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  showConfirmModal.type === 'delete' ? 'Delete' : 'Block'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Full Details Modal */}
      {showDetailsModal && selectedUserDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedUserDetails(null);
                }}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4">
                {selectedUserDetails.avatar ? (
                  <img 
                    src={selectedUserDetails.avatar} 
                    alt={selectedUserDetails.name}
                    className="w-20 h-20 rounded-xl object-cover border-4 border-white/30"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center text-3xl font-bold">
                    {selectedUserDetails.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold">{selectedUserDetails.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    {getRoleBadge(selectedUserDetails.role)}
                    {getStatusBadge(selectedUserDetails.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Contact Information
                  </h3>
                  <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                        <p className="text-gray-900 dark:text-white font-medium truncate">{selectedUserDetails.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                        <p className="text-gray-900 dark:text-white font-medium">{selectedUserDetails.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                        <p className="text-gray-900 dark:text-white font-medium">{selectedUserDetails.location || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Social Links
                  </h3>
                  <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                        <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Website</p>
                        {selectedUserDetails.website ? (
                          <a href={selectedUserDetails.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium hover:underline truncate block">
                            {selectedUserDetails.website}
                          </a>
                        ) : (
                          <p className="text-gray-900 dark:text-white font-medium">Not provided</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                        <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">LinkedIn Profile</p>
                        {selectedUserDetails.linkedin ? (
                          <a href={selectedUserDetails.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium hover:underline truncate block">
                            {selectedUserDetails.linkedin}
                          </a>
                        ) : (
                          <p className="text-gray-900 dark:text-white font-medium">Not provided</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Bio
                  </h3>
                  <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-4">
                    <p className="text-gray-700 dark:text-gray-300">{selectedUserDetails.bio || 'No bio provided'}</p>
                  </div>
                </div>

                {/* Account Details */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Account Details
                  </h3>
                  <div className="bg-gray-50 dark:bg-dark-100 rounded-xl p-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Joining Date</p>
                        <p className="text-gray-900 dark:text-white font-medium">{formatDate(selectedUserDetails.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Last Login</p>
                        <p className="text-gray-900 dark:text-white font-medium">{formatDateTime(selectedUserDetails.lastLogin)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                        <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Points</p>
                        <p className="text-gray-900 dark:text-white font-medium">{selectedUserDetails.points || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                        <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Earnings</p>
                        <p className="text-gray-900 dark:text-white font-medium">₹{selectedUserDetails.totalEarnings || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedUserDetails(null);
                }}
                className="px-6 py-2.5 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributorManagement;
