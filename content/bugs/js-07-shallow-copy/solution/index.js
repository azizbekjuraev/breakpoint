const original = {
  name: 'Alice',
  settings: { theme: 'dark', fontSize: 14 },
};

const copy = { ...original, settings: { ...original.settings } };
copy.settings.theme = 'light';

console.log('original theme:', original.settings.theme);
console.log('copy theme:', copy.settings.theme);
console.log('same settings:', original.settings === copy.settings);
