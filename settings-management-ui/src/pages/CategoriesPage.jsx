import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "../services/api/axios";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";

function CategoriesPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ groupName: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  
  const { role } = useSelector(state => state.auth);
  const isAdmin = role === "ROLE_ADMIN";

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/groups");
      setGroups(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/api/groups/${editingId}`, form);
        toast.success("Group updated successfully");
      } else {
        await axiosInstance.post("/api/groups", form);
        toast.success("Group created successfully");
      }
      setForm({ groupName: "", description: "" });
      setEditingId(null);
      fetchGroups();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (group) => {
    setEditingId(group.groupId);
    setForm({ groupName: group.groupName, description: group.description || "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axiosInstance.delete(`/api/groups/${id}`);
      toast.success("Group deleted");
      fetchGroups();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete group");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl animate-fade-in pb-10">
      <div>
        <h1 className="text-3xl font-bold font-heading text-surface-900 dark:text-text-main tracking-tight">Configuration Groups</h1>
        <p className="text-text-secondary mt-1.5 text-base font-medium">View and manage logical groupings for your settings.</p>
      </div>

      {isAdmin && (
        <Card>
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold font-heading mb-6 text-surface-900 dark:text-text-main tracking-tight">
              {editingId ? "Edit Group" : "Create Group"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Group Name"
                  type="text"
                  required
                  value={form.groupName}
                  onChange={(e) => setForm({ ...form, groupName: e.target.value })}
                />
              </div>
              <div>
                <Input
                  label="Description"
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button type="submit">
                {editingId ? "Update Group" : "Create Group"}
              </Button>
              {editingId && (
                <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setForm({ groupName: "", description: "" }); }}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <p className="text-text-secondary font-medium">Loading groups...</p>
      ) : (
        <Table>
          <Table.Thead>
            <tr>
              <Table.Th>Group Name</Table.Th>
              <Table.Th>Description</Table.Th>
              {isAdmin && <Table.Th className="text-right">Actions</Table.Th>}
            </tr>
          </Table.Thead>
          <Table.Tbody>
            {groups.map((group) => (
              <Table.Tr key={group.groupId}>
                <Table.Td className="font-semibold">{group.groupName}</Table.Td>
                <Table.Td className="text-text-secondary">{group.description}</Table.Td>
                {isAdmin && (
                  <Table.Td className="text-right">
                    <button onClick={() => handleEdit(group)} className="text-brand hover:text-brand-hover mr-4 font-semibold transition-colors">Edit</button>
                    <button onClick={() => handleDelete(group.groupId)} className="text-rose-500 hover:text-rose-400 font-semibold transition-colors">Delete</button>
                  </Table.Td>
                )}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </div>
  );
}
export default CategoriesPage;
