import ToggleSwitch from "./ToggleSwitch";

function PreferencesForm({
  preferences,
  setPreferences,
}) {

  const handleChange = (e) => {

    setPreferences({
      ...preferences,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">

      {/* Theme */}
      <div>

        <label className="block mb-2 font-medium">
          Theme
        </label>

        <select
          name="theme"
          value={preferences.theme}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg px-4 py-3"
        >

          <option value="light">
            Light
          </option>

          <option value="dark">
            Dark
          </option>

        </select>

      </div>

      {/* Language */}
      <div>

        <label className="block mb-2 font-medium">
          Language
        </label>

        <input
          type="text"
          name="language"
          value={preferences.language}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg px-4 py-3"
        />

      </div>

      {/* Timezone */}
      <div>

        <label className="block mb-2 font-medium">
          Timezone
        </label>

        <input
          type="text"
          name="timezone"
          value={preferences.timezone}
          onChange={handleChange}
          className="w-full border border-slate-300 rounded-lg px-4 py-3"
        />

      </div>

      {/* Notifications */}
      <div className="flex items-center justify-between">

        <div>

          <h3 className="font-medium">
            Notifications
          </h3>

          <p className="text-sm text-slate-500">
            Enable email notifications
          </p>

        </div>

        <ToggleSwitch
          enabled={preferences.notifications}
          onChange={(value) =>
            setPreferences({
              ...preferences,
              notifications: value,
            })
          }
        />

      </div>

    </div>
  );
}

export default PreferencesForm;