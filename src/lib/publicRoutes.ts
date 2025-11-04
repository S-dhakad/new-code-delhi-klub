// src/lib/publicRoutes.ts
export const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/mobile/*',
  '/callback',
  '/profile/*',
  '/klub-profile/*',
  '/creator-signup',
];

function patternToRegex(pattern: string): RegExp {
  const withDynamics = pattern.replace(/\[.*?\]/g, '([^/]+)');
  const withWild = withDynamics.replace(/\*/g, '.*');
  const escapedSlashes = withWild.replace(/\//g, '\\/');
  return new RegExp('^' + escapedSlashes + '$');
}

export function isPublicRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return true;
  return publicRoutes.some((p) => patternToRegex(p).test(pathname));
}
