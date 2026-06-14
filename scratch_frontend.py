import os
import shutil

base_dir = "c:/Users/LENOVO/Downloads/DBEDBD/EndProject/settings-management-ui/src"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def remove_file(path):
    if os.path.exists(path):
        if os.path.isdir(path):
            shutil.rmtree(path)
        else:
            os.remove(path)

# 1. Axios Instance
axios_content = """import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
"""
write_file(f"{base_dir}/services/api/axios.js", axios_content)

# 2. Auth Slice
auth_slice_content = """import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/api/axios";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
"""
write_file(f"{base_dir}/store/slices/authSlice.js", auth_slice_content)

# 3. LoginPage.jsx
login_page = """import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, clearError } from "../store/slices/authSlice";
import toast from "react-hot-toast";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    return () => { dispatch(clearError()); };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(res)) {
      toast.success("Login successful!");
    } else {
      toast.error(res.payload || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Sign in</h2>
          <p className="text-slate-500 mt-2">Welcome back to Settings API</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
export default LoginPage;
"""
write_file(f"{base_dir}/pages/LoginPage.jsx", login_page)

# 4. RegisterPage.jsx
register_page = """import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, clearError } from "../store/slices/authSlice";
import toast from "react-hot-toast";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerUser({ username, email, password }));
    if (registerUser.fulfilled.match(res)) {
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } else {
      toast.error(res.payload || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Register</h2>
          <p className="text-slate-500 mt-2">Create a new account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Username</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
export default RegisterPage;
"""
write_file(f"{base_dir}/pages/RegisterPage.jsx", register_page)

# 5. SettingsPage.jsx
settings_page = """import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SettingsTable from "../features/settings/components/SettingsTable";
import SettingsSearch from "../features/settings/components/SettingsSearch";
import SettingsModal from "../features/settings/components/SettingsModal";
import Pagination from "../features/settings/components/Pagination";
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-600 mt-2">Manage all system settings.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingSetting(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
          >
            Add Setting
          </button>
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
"""
write_file(f"{base_dir}/pages/SettingsPage.jsx", settings_page)

# 6. CategoriesPage.jsx (Groups)
categories_page = """import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "../services/api/axios";

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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-4xl font-bold text-slate-800">Configuration Groups</h1>
        <p className="text-slate-600 mt-2">View and manage logical groupings for your settings.</p>
      </div>

      {isAdmin && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border border-slate-200">
          <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Group" : "Create Group"}</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Group Name</label>
              <input
                type="text"
                required
                value={form.groupName}
                onChange={(e) => setForm({ ...form, groupName: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm({ groupName: "", description: "" }); }} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading groups...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Group Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                {isAdmin && <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {groups.map((group) => (
                <tr key={group.groupId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{group.groupName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{group.description}</td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(group)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                      <button onClick={() => handleDelete(group.groupId)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default CategoriesPage;
"""
write_file(f"{base_dir}/pages/CategoriesPage.jsx", categories_page)

# 7. PreferencesPage.jsx
preferences_page = """import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../services/api/axios";

function PreferencesPage() {
  const [preferences, setPreferences] = useState({ uiTheme: "light", notificationsEnabled: true });
  const [loading, setLoading] = useState(true);

  const fetchPreferences = async () => {
    try {
      const response = await axiosInstance.get("/api/preferences");
      if (response.data.data) {
        setPreferences(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch preferences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  const handleSave = async () => {
    try {
      await axiosInstance.put("/api/preferences", preferences);
      toast.success("Preferences updated successfully");
    } catch (error) {
      toast.error("Failed to update preferences");
    }
  };

  if (loading) return <div className="text-gray-500">Loading preferences...</div>;

  return (
    <div className="max-w-2xl bg-white rounded-xl shadow p-8 border border-slate-200">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">User Preferences</h1>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">UI Theme</label>
          <select
            value={preferences.uiTheme}
            onChange={(e) => setPreferences({ ...preferences, uiTheme: e.target.value })}
            className="block w-full rounded-md border-slate-300 shadow-sm p-3 border focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </select>
        </div>
        <div className="flex items-center">
          <input
            id="notifications"
            type="checkbox"
            checked={preferences.notificationsEnabled}
            onChange={(e) => setPreferences({ ...preferences, notificationsEnabled: e.target.checked })}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="notifications" className="ml-3 block text-sm font-medium text-slate-900">
            Enable Email Notifications
          </label>
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-150 shadow"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

export default PreferencesPage;
"""
write_file(f"{base_dir}/pages/PreferencesPage.jsx", preferences_page)

# 8. SettingsTable.jsx (Update to remove mock props logic if any, handle new keys)
settings_table = """import React from "react";

function SettingsTable({ settings, onEdit, onDelete, isAdmin }) {
  if (settings.length === 0) {
    return <div className="text-center py-10 bg-white shadow rounded-xl border border-slate-200 text-slate-500">No settings found.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Key</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Group</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              {isAdmin && <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {settings.map((setting) => (
              <tr key={setting.settingId} className="hover:bg-slate-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{setting.settingKey}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono bg-slate-100 rounded mx-6 my-2 inline-block px-2">{setting.settingValue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {setting.groupName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{setting.settingType}</td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => onEdit(setting)} className="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Edit</button>
                    <button onClick={() => onDelete(setting.settingId)} className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SettingsTable;
"""
write_file(f"{base_dir}/features/settings/components/SettingsTable.jsx", settings_table)

# 9. SettingsModal.jsx (Update forms to match real DTO)
settings_modal = """import { useState, useEffect } from "react";
import axiosInstance from "../../../services/api/axios";
import toast from "react-hot-toast";

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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {editingSetting ? "Edit Setting" : "Add Setting"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Setting Key</label>
            <input type="text" required value={form.settingKey}
              onChange={(e) => setForm({ ...form, settingKey: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. MAX_USERS"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Value</label>
            <input type="text" required value={form.settingValue}
              onChange={(e) => setForm({ ...form, settingValue: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select value={form.settingType}
              onChange={(e) => setForm({ ...form, settingType: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
              <option value="STRING">String</option>
              <option value="BOOLEAN">Boolean</option>
              <option value="NUMBER">Number</option>
              <option value="JSON">JSON</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Group</label>
            <select required value={form.groupId}
              onChange={(e) => setForm({ ...form, groupId: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
              <option value="">Select a group...</option>
              {groups.map(g => (
                <option key={g.groupId} value={g.groupId}>{g.groupName}</option>
              ))}
            </select>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-sm shadow-blue-200 transition-colors">
              {editingSetting ? "Save Changes" : "Create Setting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default SettingsModal;
"""
write_file(f"{base_dir}/features/settings/components/SettingsModal.jsx", settings_modal)

# 10. Remove Mock Data
remove_file(f"{base_dir}/features/settings/data/settingsData.js")
remove_file(f"{base_dir}/services/mockAuthService.js")

# 11. Add Login / Register routing in App.jsx or AppRouter
# Assuming AppRouter.jsx handles the routing
app_router = """import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardPage from "../pages/DashboardPage";
import SettingsPage from "../pages/SettingsPage";
import PreferencesPage from "../pages/PreferencesPage";
import CategoriesPage from "../pages/CategoriesPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;
  return children;
}

function AppRouter() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="preferences" element={<PreferencesPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
"""
write_file(f"{base_dir}/routes/AppRouter.jsx", app_router)
