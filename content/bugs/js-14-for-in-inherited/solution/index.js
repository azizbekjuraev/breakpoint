const defaults = {
  language: 'en',
  notifications: true,
};

const userSettings = Object.create(defaults);
userSettings.theme = 'dark';
userSettings.fontSize = 16;

function listKeys(obj) {
  return Object.keys(obj);
}

console.log('keys:', JSON.stringify(listKeys(userSettings)));
