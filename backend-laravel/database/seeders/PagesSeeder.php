<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;

class PagesSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'slug' => 'faq',
                'title_fr' => 'Questions Fréquentes (FAQ)',
                'title_ar' => 'الأسئلة الشائعة',
                'content_fr' => "## Qu'est-ce que DzArtisan ?\n\nDzArtisan est la plateforme de référence en Algérie pour mettre en relation les clients avec des artisans qualifiés et vérifiés dans tous les corps de métiers.\n\n## Comment trouver un artisan ?\n\nUtilisez notre moteur de recherche en sélectionnant votre wilaya et votre catégorie de besoin. Vous verrez la liste des artisans disponibles avec leurs évaluations et coordonnées.\n\n## Comment publier une demande ?\n\nCréez un compte client gratuitement, puis rendez-vous dans votre espace personnel pour publier une demande d'intervention avec toutes les informations nécessaires.\n\n## Les artisans sont-ils vérifiés ?\n\nOui, chaque artisan passe par un processus de validation par notre équipe avant d'apparaître sur la plateforme. Certains artisans disposent d'un badge de vérification supplémentaire.\n\n## Est-ce que la plateforme est gratuite pour les clients ?\n\nOui, l'utilisation de DzArtisan est entièrement gratuite pour les clients. Seuls les artisans souscrivent à des abonnements.",
                'content_ar' => "## ما هو DzArtisan؟\n\nDzArtisan هي منصة مرجعية في الجزائر لربط العملاء بالحرفيين المؤهلين والمعتمدين في جميع المهن.\n\n## كيف يمكنني إيجاد حرفي؟\n\nاستخدم محرك البحث لدينا عن طريق اختيار ولايتك وفئة احتياجك. ستجد قائمة بالحرفيين المتاحين مع تقييماتهم وبياناتهم.\n\n## كيف يمكنني نشر طلب؟\n\nأنشئ حسابًا مجانيًا للعميل، ثم انتقل إلى مساحتك الشخصية لنشر طلب تدخل بجميع المعلومات اللازمة.",
                'is_published' => true,
            ],
            [
                'slug' => 'terms',
                'title_fr' => "Conditions Générales d'Utilisation",
                'title_ar' => 'شروط الاستخدام العامة',
                'content_fr' => "## 1. Acceptation des conditions\n\nEn utilisant DzArtisan, vous acceptez les présentes conditions d'utilisation dans leur intégralité.\n\n## 2. Description du service\n\nDzArtisan est une plateforme de mise en relation entre clients et artisans. Nous ne sommes pas partie prenante dans les contrats conclus entre les utilisateurs.\n\n## 3. Inscription et compte\n\nVous devez fournir des informations exactes lors de votre inscription. Vous êtes responsable de la confidentialité de vos identifiants de connexion.\n\n## 4. Obligations des artisans\n\nLes artisans s'engagent à fournir des informations exactes sur leurs compétences et à réaliser les prestations conformément aux accords établis avec les clients.\n\n## 5. Responsabilité\n\nDzArtisan ne peut être tenu responsable des litiges entre artisans et clients. Nous fournissons une plateforme de mise en relation uniquement.",
                'content_ar' => "## 1. قبول الشروط\n\nباستخدام DzArtisan، فإنك توافق على شروط الاستخدام هذه بالكامل.\n\n## 2. وصف الخدمة\n\nDzArtisan هي منصة للتواصل بين العملاء والحرفيين. نحن لسنا طرفًا في العقود المبرمة بين المستخدمين.",
                'is_published' => true,
            ],
            [
                'slug' => 'privacy',
                'title_fr' => 'Politique de Confidentialité',
                'title_ar' => 'سياسة الخصوصية',
                'content_fr' => "## 1. Collecte des données\n\nNous collectons les informations que vous nous fournissez lors de l'inscription (nom, email, téléphone) ainsi que les données d'utilisation de la plateforme.\n\n## 2. Utilisation des données\n\nVos données sont utilisées pour :\n- Fournir et améliorer nos services\n- Vous mettre en relation avec des artisans ou clients\n- Vous envoyer des notifications relatives à votre compte\n\n## 3. Partage des données\n\nNous ne vendons pas vos données personnelles à des tiers. Certaines informations peuvent être partagées avec nos partenaires techniques uniquement dans le cadre de la fourniture du service.\n\n## 4. Vos droits\n\nConformément à la loi 18-07 relative à la protection des personnes physiques dans le traitement des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.\n\n## 5. Contact\n\nPour toute question relative à vos données : contact@dzartisan.dz",
                'content_ar' => "## 1. جمع البيانات\n\nنجمع المعلومات التي تزودنا بها عند التسجيل (الاسم والبريد الإلكتروني ورقم الهاتف) بالإضافة إلى بيانات استخدام المنصة.\n\n## 2. استخدام البيانات\n\nيتم استخدام بياناتك لتقديم وتحسين خدماتنا وربطك بالحرفيين أو العملاء.",
                'is_published' => true,
            ],
            [
                'slug' => 'help',
                'title_fr' => "Centre d'Aide",
                'title_ar' => 'مركز المساعدة',
                'content_fr' => "## Comment contacter le support ?\n\nPour toute question ou problème, vous pouvez nous contacter par email à contact@dzartisan.dz ou par téléphone au +213 555 55 55 55.\n\n## Signaler un problème\n\nSi vous rencontrez un problème technique, utilisez le bouton \"Signaler\" disponible dans votre espace personnel ou contactez-nous directement.\n\n## Résoudre un litige\n\nEn cas de litige avec un artisan ou un client, utilisez le système de réclamation intégré à la plateforme. Notre équipe traitera votre demande dans les 48 heures.",
                'content_ar' => "## كيفية الاتصال بالدعم؟\n\nلأي استفسار أو مشكلة، يمكنك التواصل معنا عبر البريد الإلكتروني على contact@dzartisan.dz أو عبر الهاتف.",
                'is_published' => true,
            ],
        ];

        foreach ($pages as $page) {
            Page::updateOrCreate(['slug' => $page['slug']], $page);
        }

        $this->command->info('✅ ' . count($pages) . ' pages statiques créées/mises à jour.');
    }
}
