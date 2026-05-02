export const revalidate = 3600; // revalidate every hour

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dzartisan.dz';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const locales = ['ar', 'en', 'fr'];

  // Base static routes
  const basePaths = [
    '',
    '/artisans',
    '/pricing',
    '/about',
  ];

  const routes = basePaths.flatMap((route) => 
    locales.map(locale => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: route === '' ? 1 : 0.8,
    }))
  );

  try {
    const res = await fetch(`${apiUrl}/v1/sitemap-data`);
    if (res.ok) {
      const data = await res.json();
      
      // Dynamic Artisans
      if (data.artisans) {
        const artisanRoutes = data.artisans.flatMap((artisan) => {
          if (!artisan.slug) return [];
          return locales.map(locale => ({
            url: `${baseUrl}/${locale}/artisans/${artisan.slug}`,
            lastModified: new Date(artisan.updated_at || new Date()),
            changeFrequency: 'weekly',
            priority: 0.9,
          }));
        });
        routes.push(...artisanRoutes);
      }

      // Dynamic CMS Pages
      if (data.pages) {
        const pageRoutes = data.pages.flatMap((page) => {
          if (!page.slug) return [];
          return locales.map(locale => ({
            url: `${baseUrl}/${locale}/pages/${page.slug}`,
            lastModified: new Date(page.updated_at || new Date()),
            changeFrequency: 'monthly',
            priority: 0.7,
          }));
        });
        routes.push(...pageRoutes);
      }
    }
  } catch (error) {
    console.error("Error generating sitemap from API:", error);
  }

  return routes;
}
