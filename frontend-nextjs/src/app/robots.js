export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dzartisan.dz';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/admin/', '/onboarding/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
