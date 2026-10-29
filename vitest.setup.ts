// The Node environment has no localStorage, which the persisted user store needs
const data = new Map<string, string>();

globalThis.localStorage = {
  get length() {
    return data.size;
  },
  clear: () => data.clear(),
  getItem: (key) => data.get(key) ?? null,
  key: (index) => [...data.keys()][index] ?? null,
  removeItem: (key) => void data.delete(key),
  setItem: (key, value) => void data.set(key, String(value)),
};
