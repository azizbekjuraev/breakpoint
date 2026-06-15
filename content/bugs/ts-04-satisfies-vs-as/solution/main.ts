export type Config = {
  theme: 'dark' | 'light';
  retries: number;
};

export const config = {
  theme: 'dark',
  retries: 3,
} satisfies Config;
