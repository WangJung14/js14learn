'use me';
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
      setUsers(data);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenRoleModal = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
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
      fetchUsers();
    } catch (err: unknown) {
      setUpdateError((err as Error).message || 'Failed to update user role.');
    } finally {
      setUpdating(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage user accounts, assign roles, and audit registered students and administrators.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 bg-white shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          {/* Role Filter Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-600 mr-1">Role:</span>
            {['ALL', 'STUDENT', 'ADMIN'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  roleFilter === role
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {role === 'ALL' ? 'All Roles' : role}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <Card className="shadow-sm border border-slate-200 overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="text-base font-semibold text-slate-800">
            Registered Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              title="No users found"
              description="No user records match your search criteria."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Group</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {user.role === 'ADMIN' ? (
                          <Badge variant="ADMIN" className="flex items-center gap-1 w-fit">
                            <Shield className="w-3 h-3" /> Admin
                          </Badge>
                        ) : (
                          <Badge variant="STUDENT" className="flex items-center gap-1 w-fit">
                            <UserCheck className="w-3 h-3" /> Student
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        {user.groupMembers?.[0]?.group?.name ? user.groupMembers[0].group.name : <span className="text-slate-400 italic">No Group</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-xs">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenRoleModal(user)}
                          className="text-xs"
                        >
                          Change Role
                        </Button>
                      </td>
                    </tr>
                  ))}
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
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500">Target User</p>
              <p className="font-semibold text-slate-900 text-sm">{selectedUser.name}</p>
              <p className="text-xs text-slate-600">{selectedUser.email}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                Select New Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('STUDENT')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedRole === 'STUDENT'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <p className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-indigo-600" /> Student
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Standard access to roadmap, exercises, submissions, and groups.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('ADMIN')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedRole === 'ADMIN'
                      ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <p className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-purple-600" /> Admin
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Full management access to study days, exercises, submissions, and users.
                  </p>
                </button>
              </div>
            </div>

            {updateError && (
              <p className="text-xs text-red-600 font-medium">{updateError}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
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
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Save Role'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
