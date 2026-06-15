export function pluck(obj: object, key: string): unknown {
  return (obj as Record<string, unknown>)[key];
}
