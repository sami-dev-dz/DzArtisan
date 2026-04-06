import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// On utilise l''export par défaut pour la compatibilité avec next-intl
export default createMiddleware(routing);

export const config = {
  // Garder le matcher large pour forcer la locale partout
  matcher: [
    '/', 
    '/(fr|en|ar)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
