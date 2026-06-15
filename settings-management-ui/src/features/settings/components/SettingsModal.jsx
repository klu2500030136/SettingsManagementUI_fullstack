import { useState, useEffect } from "react";
import axiosInstance from "../../../services/api/axios";
import toast from "react-hot-toast";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

function SettingsModal({ isOpen, onClose, onSave, editingSetting }) {
  const [form, setForm] = useState({
    settingKey: "",
    settingValue: "",
    settingType: "STRING",
    groupId: ""
  });
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (isOpen) {
      axiosInstance.get("/api/groups")
        .then(res => setGroups(res.data.data || []))
        .catch(() => toast.error("Failed to load groups"));

      if (editingSetting) {
        setForm({
          settingKey: editingSetting.settingKey,
          settingValue: editingSetting.settingValue,
          settingType: editingSetting.settingType,
          groupId: editingSetting.groupId
        });
      } else {
        setForm({ settingKey: "", settingValue: "", settingType: "STRING", groupId: "" });
      }
    }
  }, [isOpen, editingSetting]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingSetting ? "Edit Setting" : "Add Setting"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Setting Key"
          type="text"
          required
          value={form.settingKey}
          onChange={(e) => setForm({ ...form, settingKey: e.target.value })}
          placeholder="e.g. MAX_USERS"
        />
        <Input
          label="Value"
          type="text"
          required
          value={form.settingValue}
          onChange={(e) => setForm({ ...form, settingValue: e.target.value })}
        />
        
        <div>
          <label className="block text-sm font-semibold text-surface-900 dark:text-text-main mb-2">Type</label>
          <select 
            value={form.settingType}
            onChange={(e) => setForm({ ...form, settingType: e.target.value })}
            className="w-full bg-white/50 dark:bg-[#141414]/50 backdrop-blur-md border border-surface-200 dark:border-white/10 rounded-[14px] px-4 py-3 text-sm text-surface-900 dark:text-text-main outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all shadow-sm font-semibold"
          >
            <option value="STRING" className="text-[#0B0B0B]">String</option>
            <option value="BOOLEAN" className="text-[#0B0B0B]">Boolean</option>
            <option value="NUMBER" className="text-[#0B0B0B]">Number</option>
            <option value="JSON" className="text-[#0B0B0B]">JSON</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-surface-900 dark:text-text-main mb-2">Group</label>
          <select 
            required 
            value={form.groupId}
            onChange={(e) => setForm({ ...form, groupId: e.target.value })}
            className="w-full bg-white/50 dark:bg-[#141414]/50 backdrop-blur-md border border-surface-200 dark:border-white/10 rounded-[14px] px-4 py-3 text-sm text-surface-900 dark:text-text-main outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all shadow-sm font-semibold"
          >
            <option value="" className="text-[#0B0B0B]">Select a group...</option>
            {groups.map(g => (
              <option key={g.groupId} value={g.groupId} className="text-[#0B0B0B]">{g.groupName}</option>
            ))}
          </select>
        </div>

        <div className="pt-2 flex gap-3">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {editingSetting ? "Save Changes" : "Create Setting"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default SettingsModal;
