const groupedSettings = {
  Appearance: [
    "Dark Mode",
    "Font Size",
    "Theme",
  ],

  Notifications: [
    "Email Alerts",
    "Push Notifications",
  ],

  Security: [
    "2FA",
    "Password Reset",
  ],
};

function GroupedSettings() {
  return (
    <div className="space-y-6">

      {Object.entries(groupedSettings).map(
        ([group, settings]) => (
          <div
            key={group}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >

            <h2 className="text-2xl font-bold mb-4 text-slate-800">
              {group}
            </h2>

            <div className="flex flex-wrap gap-3">

              {settings.map((setting, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl"
                >
                  {setting}
                </div>
              ))}

            </div>

          </div>
        )
      )}

    </div>
  );
}

export default GroupedSettings;