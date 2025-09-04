export async function getCurrentUser(): Promise<User> {
  // TODO: remove the delay in production
  await new Promise((resolve) => setTimeout(resolve, 3000));
  
  // TODO: fetch from backend
  return { name: "Wei Zhou" };
}

export interface User {
  name: string;
  email?: string;
  avatarUrl?: string;
}
