"use client"

import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { 
  X, 
  Search, 
  UserPlus, 
  Check, 
  ChevronRight,
  Info 
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Modal } from "@/components/ui/Modal"
import { Avatar } from "@/components/ui/Avatar"
import { cn } from "@/lib/utils"

export function ManualActivationModal({ isOpen, onClose, onActivate, artisans }) {
  const t = useTranslations("admin.subscription_management.manual_activation")
  const locale = useLocale()
  const [search, setSearch] = React.useState("")
  const [selectedArtisan, setSelectedArtisan] = React.useState(null)
  const [formData, setFormData] = React.useState({
    plan: "mensuel",
    amount: 1000,
    notes: ""
  })

  const filteredArtisans = search?.length > 1 
    ? artisans.filter(a => a.user?.nomComplet?.toLowerCase().includes(search.toLowerCase()))
    : []

  const handleActivate = () => {
    if (!selectedArtisan) return
    onActivate({
      artisan_id: selectedArtisan.id,
      ...formData
    })
  }

  const plans = [
    { id: "mensuel", label: "Pro Mensuel (1 mois)", price: 1000 },
    { id: "trimestriel", label: "Pro Trimestriel (3 mois)", price: 3000 },
    { id: "annuel", label: "Elite Annuel (12 mois)", price: 10000 }
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("title")}>
      <div className="space-y-6">
        {/* Step 1: Artisan Selection */}
        {!selectedArtisan ? (
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {t("search_artisan")}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Ex: Mohamed..."
                className="pl-10"
              />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {filteredArtisans.map(artisan => (
                <button
                  key={artisan.id}
                  onClick={() => setSelectedArtisan(artisan)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar 
                      src={artisan.photo} 
                      className="w-10 h-10 rounded-xl"
                      initials={artisan.user?.nomComplet?.charAt(0)}
                    />
                    <div className="flex flex-col text-left rtl:text-right">
                      <span className="font-bold text-slate-900 dark:text-white leading-tight">
                        {artisan.user?.nomComplet}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                         {artisan.telephone}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              ))}
              {search.length > 2 && filteredArtisans.length === 0 && (
                <p className="text-center text-sm text-slate-500 py-4">
                   Aucun artisan correspondant trouvé.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step 2: Plan & Payment Details */}
            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-500/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center gap-3">
                <Avatar 
                  src={selectedArtisan.photo} 
                  className="w-12 h-12 rounded-2xl"
                  initials={selectedArtisan.user?.nomComplet?.charAt(0)}
                />
                <div className="flex flex-col">
                   <span className="font-black text-blue-700 dark:text-blue-400">
                     {selectedArtisan.user?.nomComplet}
                   </span>
                   <span className="text-xs text-blue-600 dark:text-blue-500 font-medium tracking-tight">
                      {selectedArtisan.telephone}
                   </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedArtisan(null)}
                className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline"
              >
                Changer
              </button>
            </div>

            <div className="space-y-4">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("select_plan")}</label>
                 <select
                   className="w-full h-12 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 focus:ring-2 focus:ring-blue-500"
                   value={formData.plan}
                   onChange={e => {
                     const plan = plans.find(p => p.id === e.target.value)
                     setFormData({ ...formData, plan: e.target.value, amount: plan.price })
                   }}
                 >
                   {plans.map(p => (
                     <option key={p.id} value={p.id}>{p.label}</option>
                   ))}
                 </select>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("amount_label")}</label>
                    <Input 
                       type="number" 
                       value={formData.amount} 
                       onChange={e => setFormData({ ...formData, amount: e.target.value })}
                     />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("method_label")}</label>
                    <Select defaultValue="espéces">
                       <option value="espéces">Espèces</option>
                       <option value="virement">Virement (CCP/CCP)</option>
                       <option value="autre">Autre</option>
                    </Select>
                  </div>
               </div>

               <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Notes d&apos;administration</label>
                 <textarea 
                   className="w-full h-24 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 resize-none focus:ring-2 focus:ring-blue-500"
                   placeholder="Ex: Paiement reçu en agence..."
                   value={formData.notes}
                   onChange={e => setFormData({ ...formData, notes: e.target.value })}
                 />
               </div>
            </div>

            <div className="flex gap-3 pt-4">
               <Button variant="outline" className="grow rounded-xl h-12" onClick={onClose}>
                 {t("modals.cancel_btn")}
               </Button>
               <Button className="grow rounded-xl h-12 shadow-xl shadow-blue-500/20" onClick={handleActivate}>
                 <Check className="w-5 h-5 mr-2" />
                 {t("btn")}
               </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
