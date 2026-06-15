import { useState, useEffect } from "react";

function GroupModal({
  isOpen,
  onClose,
  onSave,
  editingGroup,
}) {

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    settingsCount: "",
  });

  useEffect(() => {

    if (editingGroup) {
      setFormData(editingGroup);
    }

  }, [editingGroup]);

  if (!isOpen) return null;

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    onSave(formData);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-6 w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6">

          {editingGroup
            ? "Edit Category"
            : "Add Category"}

        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="number"
            name="settingsCount"
            placeholder="Settings Count"
            value={formData.settingsCount}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="bg-slate-300 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default GroupModal;