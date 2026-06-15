import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SettingsTable from "../features/settings/components/SettingsTable";
import SettingsSearch from "../features/settings/components/SettingsSearch";
import SettingsModal from "../features/settings/components/SettingsModal";
import Pagination from "../features/settings/components/Pagination";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";
import axiosInstance from "../services/api/axios";

function SettingsPage() {
  const [settings, setSettings] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const { role } = useSelector(state => state.auth);
  const isAdmin = role === "ROLE_ADMIN";
  
  const itemsPerPage = 5;

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/settings");
      setSettings(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const filteredSettings = settings.filter(
    (setting) =>
      setting.settingKey.toLowerCase().includes(search.toLowerCase()) ||
      setting.groupName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSettings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSettings = filteredSettings.slice(startIndex, startIndex + itemsPerPage);

  const handleSave = async (newSetting) => {
    try {
      if (editingSetting) {
        await axiosInstance.put(`/api/settings/${editingSetting.settingId}`, newSetting);
        toast.success("Setting updated successfully");
      } else {
        await axiosInstance.post("/api/settings", newSetting);
        toast.success("Setting created successfully");
      }
      setIsModalOpen(false);
      setEditingSetting(null);
      fetchSettings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (setting) => {
    setEditingSetting(setting);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this setting?")) return;
    try {
      await axiosInstance.delete(`/api/settings/${id}`);
      toast.success("Setting deleted successfully");
      fetchSettings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-surface-900 dark:text-text-main tracking-tight">Settings</h1>
          <p className="text-text-secondary mt-1.5 text-base font-medium">Manage all system settings.</p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => {
              setEditingSetting(null);
              setIsModalOpen(true);
            }}
          >
            Add Setting
          </Button>
        )}
      </div>

      <SettingsSearch search={search} setSearch={setSearch} />

      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading settings...</div>
      ) : (
        <>
          <SettingsTable
            settings={paginatedSettings}
            onEdit={isAdmin ? handleEdit : null}
            onDelete={isAdmin ? handleDelete : null}
            isAdmin={isAdmin}
          />
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      )}

      {isModalOpen && isAdmin && (
        <SettingsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          editingSetting={editingSetting}
        />
      )}
    </div>
  );
}
export default SettingsPage;
