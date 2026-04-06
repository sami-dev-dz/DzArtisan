import * as React from "react"
import { getTranslations } from "next-intl/server"
import { 
  Star, 
  MapPin, 
  Briefcase, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Award,
  CheckCircle2,
  Calendar,
  ChevronRight,
  AlertTriangle,
  Zap,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"
import { notFound } from "next/navigation"

// This is a Server Component for maximum SEO
async function getArtisan(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/artisans/slug/${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    if (!res.ok) return null
    return res.json()
  } catch (err) {
    return null
  }
}

export async function generateMetadata({ params }) {
  const { slug, locale } = await params
  const artisan = await getArtisan(slug)
  
  if (!artisan) return { title: "Artisan introuvable" }

  return {
    title: `${artisan.user.nomComplet} - ${artisan.primary_categorie?.nom} | DzArtisan`,
    description: artisan.description?.substring(0, 160) || `Trouvez ${artisan.user.nomComplet}, expert en ${artisan.primary_categorie?.nom} à ${artisan.primary_wilaya?.nom}.`,
    openGraph: {
      title: artisan.user.nomComplet,
      description: artisan.description?.substring(0, 160),
      images: [artisan.photo || "/images/og-placeholder.png"],
    }
  }
}

export default async function ArtisanProfilePage({ params }) {
  const { slug, locale } = await params
  const artisan = await getArtisan(slug)
  const t = await getTranslations("search")
  const cardT = await getTranslations("artisan_card")
  
  if (!artisan) notFound()

  const isAvailable = artisan.disponibilite === "disponible"
  const isRTL = locale === "ar"

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      
      {/* Navigation / Back */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
         <Link href={`/${locale}/artisans`}>
            <Button variant="ghost" className="gap-2 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-blue-600">
               <ArrowLeft className="w-4 h-4" /> Retour à la recherche
            </Button>
         </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* Left Column: Visuals & Fast Actions */}
           <div className="lg:col-span-5 space-y-8">
              <div className="relative group">
                 <div className="aspect-square rounded-[60px] overflow-hidden border-8 border-white dark:border-white/5 shadow-2xl bg-white dark:bg-slate-900 relative">
                     <Image 
                       src={artisan.photo || "/images/placeholders/artisan.png"} 
                       alt={artisan.user.nomComplet}
                       fill
                       className="object-cover"
                       priority
                       sizes="(max-width: 1024px) 100vw, 40vw"
                     />
                  </div>
                 
                 {/* Floating Badges */}
                 <div className={cn(
                    "absolute -bottom-4 h-16 px-8 rounded-3xl flex items-center gap-3 backdrop-blur-xl border shadow-2xl",
                    isRTL ? "-left-4" : "-right-4",
                    isAvailable ? "bg-emerald-500 text-white border-emerald-400" : "bg-slate-900 text-white border-slate-800"
                 )}>
                    <div className={cn("w-3 h-3 rounded-full animate-pulse", isAvailable ? "bg-white" : "bg-slate-500")} />
                    <span className="font-black text-xs uppercase tracking-widest">
                       {isAvailable ? "Disponible" : "Occupé"}
                    </span>
                 </div>
              </div>

              {/* Verified Badges */}
              <div className="flex flex-wrap gap-3">
                 {artisan.statutValidation === 'valide' && (
                    <div className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center text-blue-600">
                          <CheckCircle2 className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-tight">Vérification</p>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{cardT("verified_profile")}</p>
                       </div>
                    </div>
                 )}
                 {artisan.diploma_url && (
                    <div className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-600/10 flex items-center justify-center text-amber-600">
                          <Award className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-tight">Diplôme</p>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{cardT("verified_diploma")}</p>
                       </div>
                    </div>
                 )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <a href={`https://wa.me/${artisan.telephone}?text=${encodeURIComponent('Bonjour, je vous contacte via DzArtisan...')}`} target="_blank" className="block">
                    <Button className="w-full h-16 rounded-[24px] bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs uppercase tracking-widest gap-3 shadow-xl shadow-emerald-500/20">
                       <MessageCircle className="w-5 h-5" /> WhatsApp
                    </Button>
                 </a>
                 <a href={`tel:${artisan.telephone}`} className="block">
                    <Button className="w-full h-16 rounded-[24px] bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest gap-3 shadow-xl shadow-blue-500/20">
                       <Phone className="w-5 h-5" /> {t("contact_call")}
                    </Button>
                 </a>
              </div>
           </div>

           {/* Right Column: Content */}
           <div className="lg:col-span-7 space-y-12">
              
              {/* Profile Main Header */}
              <div className="space-y-4">
                 <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                          {artisan.user.nomComplet}
                       </h1>
                       <Zap className="w-8 h-8 text-blue-600 fill-blue-600" />
                    </div>
                    <p className="text-xl font-bold text-blue-600 uppercase tracking-widest opacity-80">
                       {artisan.primary_categorie?.nom}
                    </p>
                 </div>

                 <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <div className="flex items-center gap-2">
                       <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                             <Star key={i} className={cn("w-5 h-5", i < Math.floor(artisan.average_rating) ? "fill-amber-400" : "text-slate-200")} />
                          ))}
                       </div>
                       <span className="text-lg font-black text-slate-900 dark:text-white">{artisan.average_rating}</span>
                       <span className="text-sm font-bold text-slate-400">({artisan.reviews_count} avis)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs">
                       <MapPin className="w-4 h-4 text-blue-600" />
                       {artisan.primary_wilaya?.nom}, {artisan.commune?.nom}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs">
                       <Briefcase className="w-4 h-4 text-blue-600" />
                       {artisan.anneesExp} ans d&apos;expérience
                    </div>
                 </div>
              </div>

              {/* About Section */}
              <div className="space-y-6">
                 <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 dark:border-white/5 pb-2">
                    À PROPOS DE L&apos;ARTISAN
                 </h2>
                 <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-lg leading-relaxed font-medium text-slate-700 dark:text-slate-300">
                       {artisan.description || "Aucune description fournie par l'artisan."}
                    </p>
                 </div>
                 
                 <div className="flex flex-wrap gap-2">
                    {artisan.categories?.map((cat) => (
                       <Badge key={cat.id} variant="outline" className="h-10 px-6 rounded-full border-slate-200 dark:border-white/10 text-xs font-black uppercase tracking-tight">
                          {cat.nom}
                       </Badge>
                    ))}
                 </div>
              </div>

              {/* Reviews Section */}
              <div className="space-y-8">
                 <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                       AVIS CLIENTS
                    </h2>
                    <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                       Tous les avis ({artisan.reviews_count})
                    </Button>
                 </div>

                 <div className="space-y-6">
                    {artisan.avis && artisan.avis.length > 0 ? (
                       artisan.avis.map((rev) => (
                          <div key={rev.id} className="bg-white dark:bg-slate-900/50 p-6 rounded-[32px] border border-slate-100 dark:border-white/5 space-y-4">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center font-black text-slate-500 uppercase">
                                      {rev.user?.nomComplet?.charAt(0)}
                                   </div>
                                   <div>
                                      <p className="text-sm font-black uppercase tracking-tight">{rev.user?.nomComplet}</p>
                                      <div className="flex text-amber-400 scale-75 origin-left">
                                         {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={cn("w-4 h-4", i < rev.note ? "fill-amber-400" : "text-slate-200")} />
                                         ))}
                                      </div>
                                   </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">
                                   {new Date(rev.created_at).toLocaleDateString()}
                                </span>
                             </div>
                             <p className="text-slate-600 dark:text-slate-400 font-medium">
                                {rev.commentaire}
                             </p>
                          </div>
                       ))
                    ) : (
                       <div className="bg-slate-100/50 dark:bg-white/5 rounded-[40px] p-12 text-center space-y-4 border-2 border-dashed border-slate-200 dark:border-white/10">
                          <p className="text-lg font-black text-slate-400 uppercase tracking-widest italic">Aucun avis pour le moment</p>
                          <p className="text-sm font-bold text-slate-400">Soyez le premier à laisser un commentaire après une intervention !</p>
                       </div>
                    )}
                 </div>
              </div>

              {/* Report Link */}
              <div className="pt-10 border-t border-slate-100 dark:border-white/5">
                 <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 flex items-center gap-2 transition-colors">
                    <AlertTriangle className="w-4 h-4" /> Signaler cet artisan
                 </button>
              </div>

           </div>
        </div>
      </div>
    </div>
  )
}
