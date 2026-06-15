function normalizeSettings(settings) {

  const byId = {};

  const allIds = [];

  settings.forEach((setting) => {

    byId[setting.id] = setting;

    allIds.push(setting.id);
  });

  return {
    byId,
    allIds,
  };
}

export default normalizeSettings;