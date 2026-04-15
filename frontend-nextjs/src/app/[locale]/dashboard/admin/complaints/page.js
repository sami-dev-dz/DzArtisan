import React from "react"
import { getTranslations } from "next-intl/server"
import ComplaintManagement from "@/components/admin/complaints/ComplaintManagement"

export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.complaints_management" })

  return {
    title: `${t("title")} | DzArtisan Admin`,
    description: t("subtitle")
  }
}

export default async function AdminComplaintsPage() {
  return (
    <div className="max-w-[1600px] mx-auto">
      <ComplaintManagement />
    </div>
  )
}
