import { notFound } from 'next/navigation';

async function getPage(slug, locale) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/pages/${slug}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const page = await getPage(slug, locale);
  if (!page) return { title: 'Page introuvable | DzArtisan' };
  return {
    title: `${locale === 'ar' ? page.title_ar : page.title_fr} | DzArtisan`,
  };
}

export default async function StaticPage({ params }) {
  const { slug, locale } = await params;
  const page = await getPage(slug, locale);

  if (!page) notFound();

  const title = locale === 'ar' ? page.title_ar : page.title_fr;
  const content = locale === 'ar' ? page.content_ar : page.content_fr;
  const isRTL = locale === 'ar';

  // Simple markdown-like rendering (newlines → paragraphs, ## → h2, # → h1)
  const renderContent = (text) => {
    if (!text) return null;
    return text.split('\n\n').map((block, i) => {
      if (block.startsWith('## '))
        return <h2 key={i} className="text-xl font-black text-slate-900 dark:text-white mt-8 mb-3">{block.replace('## ', '')}</h2>;
      if (block.startsWith('# '))
        return <h1 key={i} className="text-2xl font-black text-slate-900 dark:text-white mt-8 mb-3">{block.replace('# ', '')}</h1>;
      if (block.startsWith('- '))
        return (
          <ul key={i} className="list-disc list-inside space-y-1 mb-4">
            {block.split('\n').map((li, j) => (
              <li key={j} className="text-slate-600 dark:text-slate-400 font-medium">{li.replace('- ', '')}</li>
            ))}
          </ul>
        );
      return <p key={i} className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-4">{block}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3">DzArtisan</p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">{title}</h1>
          <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto" />
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-8 md:p-12 shadow-sm">
          {content ? renderContent(content) : (
            <p className="text-slate-400 italic text-center py-8">Aucun contenu pour cette page.</p>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 font-medium mt-8">
          Dernière mise à jour : {new Date(page.updated_at).toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
