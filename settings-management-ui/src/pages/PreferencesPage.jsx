import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../services/api/axios";
import { useTheme } from "../context/ThemeContext";

function extractPreferenceData(response, fallbackTheme) {
  return {
    uiTheme: fallbackTheme,
    notificationsEnabled: true,
    languagePreference: "English",
    timeZonePreference: "IST",
    dashboardLayoutPreference: "Standard",
    ...(response?.data?.data || response?.data || {}),
  };
}

function getErrorMessage(error, fallback) {
  return (
    error.response?.data?.message ||
    error.response?.data?.detail?.message ||
    error.response?.data?.detail ||
    fallback
  );
}

function PreferencesPage() {
  const { theme } = useTheme();

  const [preferences, setPreferences] = useState({
    uiTheme: theme,
    notificationsEnabled: true,
    languagePreference: "English",
    timeZonePreference: "IST",
    dashboardLayoutPreference: "Standard",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchPreferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/api/preferences");
      const data = extractPreferenceData(response, theme);
      setPreferences(data);
    } catch (error) {
      const message = getErrorMessage(error, "Failed to fetch preferences");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [theme]);

  useEffect(() => {
    Promise.resolve().then(fetchPreferences);
  }, [fetchPreferences]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        uiTheme: preferences.uiTheme,
        notificationsEnabled: Boolean(preferences.notificationsEnabled),
        languagePreference: preferences.languagePreference,
        timeZonePreference: preferences.timeZonePreference,
        dashboardLayoutPreference: preferences.dashboardLayoutPreference,
      };
      const response = await axiosInstance.put("/api/preferences", payload);
      const data = extractPreferenceData(response, theme);
      setPreferences(data);
      toast.success("Preferences updated successfully");
      await fetchPreferences();
    } catch (error) {
      const message = getErrorMessage(error, "Failed to update preferences");
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-500">Loading preferences...</div>;

  return (
    <div className="max-w-2xl glass-card dark:glass-panel-dark animate-fade-in mx-auto mt-4">
      <h1 className="text-3xl font-bold font-heading text-surface-900 dark:text-text-main mb-8 tracking-tight">User Preferences</h1>
      <div className="space-y-6">
        <div>
          <label htmlFor="uiTheme" className="block text-sm font-bold text-surface-900 dark:text-text-main mb-2 tracking-tight">UI Theme</label>
          <select
            id="uiTheme"
            value={preferences.uiTheme}
            onChange={(e) => {
              const val = e.target.value;

              setPreferences((current) => ({
                ...current,
                uiTheme: val
              }));
            }}
            className="w-full bg-white/50 dark:bg-[#141414]/50 backdrop-blur-md border border-surface-200 dark:border-white/10 rounded-[14px] px-4 py-3 text-sm text-surface-900 dark:text-text-main outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all shadow-sm font-semibold"
          >
            <option value="light" className="text-[#0B0B0B]">Light</option>
            <option value="dark" className="text-[#0B0B0B]">Dark</option>
            <option value="system" className="text-[#0B0B0B]">System Default</option>
          </select>
        </div>
        <div className="flex items-center p-4 glass-card dark:glass-panel-dark rounded-xl border border-surface-200 dark:border-white/10 transition-colors cursor-pointer" onClick={() => setPreferences((current) => ({ ...current, notificationsEnabled: !current.notificationsEnabled }))}>
          <input
            id="notifications"
            type="checkbox"
            checked={Boolean(preferences.notificationsEnabled)}
            onChange={(e) => setPreferences((current) => ({ ...current, notificationsEnabled: e.target.checked }))}
            className="h-5 w-5 accent-brand bg-white/50 dark:bg-[#1C1C1C] border-surface-300 dark:border-white/10 rounded cursor-pointer pointer-events-none"
          />
          <label htmlFor="notifications" className="ml-3 block text-sm font-bold text-surface-900 dark:text-text-main cursor-pointer tracking-tight pointer-events-none">
            Enable Email Notifications
          </label>
        </div>
        <div>
          <label htmlFor="languagePreference" className="block text-sm font-bold text-surface-900 dark:text-text-main mb-2 tracking-tight">Language Preference</label>
          <select
            id="languagePreference"
            value={preferences.languagePreference}
            onChange={(e) => {
              const val = e.target.value;

              setPreferences((current) => ({
                ...current,
                languagePreference: val
              }));
            }}
            className="w-full bg-white/50 dark:bg-[#141414]/50 backdrop-blur-md border border-surface-200 dark:border-white/10 rounded-[14px] px-4 py-3 text-sm text-surface-900 dark:text-text-main outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all shadow-sm font-semibold"
          >
            <option value="English" className="text-[#0B0B0B]">English</option>
            <option value="Hindi" className="text-[#0B0B0B]">Hindi</option>
            <option value="Telugu" className="text-[#0B0B0B]">Telugu</option>
          </select>
        </div>
        <div>
          <label htmlFor="timeZonePreference" className="block text-sm font-bold text-surface-900 dark:text-text-main mb-2 tracking-tight">Time Zone Preference</label>
          <select
            id="timeZonePreference"
            value={preferences.timeZonePreference}
            onChange={(e) => {
              const val = e.target.value;

              setPreferences((current) => ({
                ...current,
                timeZonePreference: val
              }));
            }}
            className="w-full bg-white/50 dark:bg-[#141414]/50 backdrop-blur-md border border-surface-200 dark:border-white/10 rounded-[14px] px-4 py-3 text-sm text-surface-900 dark:text-text-main outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all shadow-sm font-semibold"
          >
            <option value="IST" className="text-[#0B0B0B]">IST</option>
            <option value="UTC" className="text-[#0B0B0B]">UTC</option>
            <option value="PST" className="text-[#0B0B0B]">PST</option>
          </select>
        </div>
        <div>
          <label htmlFor="dashboardLayoutPreference" className="block text-sm font-bold text-surface-900 dark:text-text-main mb-2 tracking-tight">Dashboard Layout Preference</label>
          <select
            id="dashboardLayoutPreference"
            value={preferences.dashboardLayoutPreference}
            onChange={(e) => {
              const val = e.target.value;

              setPreferences((current) => ({
                ...current,
                dashboardLayoutPreference: val
              }));
            }}
            className="w-full bg-white/50 dark:bg-[#141414]/50 backdrop-blur-md border border-surface-200 dark:border-white/10 rounded-[14px] px-4 py-3 text-sm text-surface-900 dark:text-text-main outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all shadow-sm font-semibold"
          >
            <option value="Compact" className="text-[#0B0B0B]">Compact</option>
            <option value="Standard" className="text-[#0B0B0B]">Standard</option>
            <option value="Detailed" className="text-[#0B0B0B]">Detailed</option>
          </select>
        </div>
        {error && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-500 font-medium">
            {error}
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-gold w-full mt-4"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}

export default PreferencesPage;
