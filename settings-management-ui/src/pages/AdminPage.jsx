import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import AdminStats from "../features/admin/components/AdminStats";

import UsersTable from "../features/admin/components/UsersTable";

import SystemSettingsPanel from "../features/admin/components/SystemSettingsPanel";

import axiosInstance from "../services/api/axios";

function AdminPage() {

  const [users, setUsers] =
    useState([]);

  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const { user: currentUser } =
    useSelector((state) => state.auth);

  const fetchAdminData = useCallback(async () => {
    setLoading(true);

    try {
      const [usersResponse, statsResponse] =
        await Promise.all([
          axiosInstance.get("/api/admin/users"),
          axiosInstance.get("/api/admin/stats"),
        ]);

      setUsers(usersResponse.data?.data || []);
      setStats(statsResponse.data?.data || null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(fetchAdminData);
  }, [fetchAdminData]);

  // Role Change
  const handleRoleChange = async (
    userId,
    newRole
  ) => {

    try {
      await axiosInstance.put(`/api/admin/users/${userId}/role`, {
        roleName: newRole,
      });

      toast.success("User role updated successfully");
      await fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user role");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) return;

    try {
      await axiosInstance.delete(`/api/admin/users/${user.userId}`);
      toast.success("User deleted successfully");
      await fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div>

        <h1 className="text-3xl font-bold font-heading text-surface-900 dark:text-text-main tracking-tight">
          Admin Panel
        </h1>

        <p className="text-text-secondary mt-1.5 text-base font-medium">
          Manage users, roles, and system security.
        </p>

      </div>

      {/* Stats */}
      <AdminStats stats={stats} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Users */}
        <div className="xl:col-span-2">

          {loading ? (
            <div className="text-center text-gray-500 py-10">
              Loading users...
            </div>
          ) : (
            <UsersTable
              users={users}
              currentUserEmail={currentUser?.email}
              onRoleChange={handleRoleChange}
              onDelete={handleDelete}
            />
          )}

        </div>

        {/* System Settings */}
        <SystemSettingsPanel />

      </div>

    </div>
  );
}

export default AdminPage;
