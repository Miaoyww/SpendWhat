import type { LayoutServerLoad } from "./$types";
import { browser } from '$app/environment';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const session = cookies.get('session') ?? '';
  if (browser) {
    localStorage.setItem("session", session);
  }
  return {
    session
  };
};