export function getFromStorage<T>(key: string): T | null {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) as T : null;
}

export function setToStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}
