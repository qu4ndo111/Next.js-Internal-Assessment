import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'vi'],
 
  // Used when no locale matches
  defaultLocale: 'en',
  localePrefix: 'never' // Set to 'never' if you don't want /en or /vi in the URL
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(vi|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};
