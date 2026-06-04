const defaults = {
  language: 'en',
  notifications: true,
};

const userSettings = Object.create(defaults);
userSettings.theme = 'dark';
userSettings.fontSize = 16;

function listKeys(obj) {
  const keys = [];
  for (const k in obj) {
    keys.push(k);
  }
  return keys;
}

console.log('keys:', JSON.stringify(listKeys(userSettings)));
