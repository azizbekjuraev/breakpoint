export interface User {
  id: number;
  name: string;
}

export function getName(users: User[], id: number): string {
  const found = users.find((u) => u.id === id);
  return found.name;
}
