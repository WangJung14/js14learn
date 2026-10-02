'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { usersApi } from '@/lib/api';
import { User, Role } from '@/types';
import {
  Users,
  Shield,
  UserCheck,
  Search,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Edit role modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('STUDENT');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersApi.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load user accounts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleOpenRoleModal = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role || 'STUDENT');
    setUpdateError(null);
    setIsRoleModalOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    try {
      setUpdating(true);
      setUpdateError(null);
      await usersApi.updateUserRole(selectedUser.id, selectedRole);
      setIsRoleModalOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err: unknown) {
      setUpdateError((err as Error).message || 'Failed to update user role.');
    } finally {
      setUpdating(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const nameStr = u.name || '';
    const emailStr = u.email || '';
    const matchesSearch =
      nameStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emailStr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1 font-mono">
            <Users className="w-4 h-4" />
            <span>User Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Manage Users & Roles
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Audit registered student accounts and promote or manage administrator roles.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchUsers()}
          isLoading={loading}
          className="self-start md:self-auto text-xs border-slate-800 hover:bg-slate-900"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh List
        </Button>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 bg-slate-900/80 border-slate-800/80 shadow-xl backdrop-blur-md rounded-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-xs bg-slate-950 border-slate-800 text-slate-100"
            />
          </div>

          {/* Role Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-400 mr-1 font-mono">Role:</span>
            {['ALL', 'STUDENT', 'ADMIN'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  roleFilter === role
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {role === 'ALL' ? 'All Roles' : role}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Error state with Retry */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => void fetchUsers()}
            className="text-xs border-rose-500/30 hover:bg-rose-500/10 text-rose-300 self-start sm:self-auto"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Users Table */}
      <Card className="shadow-2xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-950/60 border-b border-slate-800/80 px-6 py-4">
          <CardTitle className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
            Registered Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No users found"
                description={
                  searchQuery
                    ? `No user records matching "${searchQuery}".`
                    : 'No user accounts are currently registered.'
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950/40 border-b border-slate-800/80 text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">
                    <th className="py-3.5 px-6">User</th>
                    <th className="py-3.5 px-6">Role</th>
                    <th className="py-3.5 px-6">Joined Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-transparent">
                  {filteredUsers.map((u) => {
                    const avatarUrl =
                      u.avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                        u.name || 'User',
                      )}`;

                    return (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={avatarUrl}
                              alt={u.name || 'User'}
                              className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-100 truncate">{u.name || 'Unnamed'}</p>
                              <p className="text-xs text-slate-400 truncate">{u.email || 'No email'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6">
                          {u.role === 'ADMIN' ? (
                            <Badge variant="ADMIN" className="flex items-center gap-1 w-fit font-mono text-[10px]">
                              <Shield className="w-3 h-3" /> Admin
                            </Badge>
                          ) : (
                            <Badge variant="STUDENT" className="flex items-center gap-1 w-fit font-mono text-[10px]">
                              <UserCheck className="w-3 h-3" /> Student
                            </Badge>
                          )}
                        </td>
                        <td className="py-3.5 px-6 text-slate-400 text-xs font-mono">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenRoleModal(u)}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                          >
                            Change Role
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Role Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Change User Role"
        description="Update account permissions between Student and Administrator."
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400 font-mono">Target User</p>
              <p className="font-bold text-slate-100 text-sm mt-0.5">{selectedUser.name || 'Unnamed'}</p>
              <p className="text-xs text-slate-400">{selectedUser.email || 'No email'}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block font-mono">
                Select New Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('STUDENT')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedRole === 'STUDENT'
                      ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/20'
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900'
                  }`}
                >
                  <p className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-indigo-400" /> Student
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Standard access to roadmap, exercises, submissions, and groups.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('ADMIN')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedRole === 'ADMIN'
                      ? 'border-purple-500 bg-purple-950/40 ring-2 ring-purple-500/20'
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900'
                  }`}
                >
                  <p className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-purple-400" /> Admin
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Full management access to study days, exercises, submissions, and users.
                  </p>
                </button>
              </div>
            </div>

            {updateError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-medium text-rose-400">
                {updateError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRoleModalOpen(false)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpdateRole}
                isLoading={updating}
              >
                Save Role
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
