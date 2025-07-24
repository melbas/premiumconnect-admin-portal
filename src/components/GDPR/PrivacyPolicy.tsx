import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, FileText, Users, Database, MapPin, Phone, Mail, Globe, Download, Trash2 } from 'lucide-react';

interface PrivacyPolicyProps {
  companyName?: string;
  contactEmail?: string;
  lastUpdated?: string;
  trigger?: React.ReactNode;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  companyName = "WiFi Sénégal",
  contactEmail = "privacy@wifisenegal.com",
  lastUpdated = new Date().toLocaleDateString('fr-FR'),
  trigger
}) => {
  const [language, setLanguage] = useState<'fr' | 'wo' | 'en'>('fr');

  const sections = {
    fr: [
      {
        id: 'introduction',
        title: 'Introduction',
        icon: Shield,
        content: `${companyName} s'engage à protéger votre vie privée et vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez nos services de WiFi gratuit.`
      },
      {
        id: 'data-collection',
        title: 'Données collectées',
        icon: Database,
        content: `Nous collectons les informations suivantes :
        
**Données d'identification :**
• Numéro de téléphone (pour l'authentification SMS)
• Adresse email (optionnelle)
• Nom ou pseudonyme (optionnel)

**Données techniques :**
• Adresse MAC de votre appareil
• Type d'appareil et système d'exploitation
• Adresse IP assignée
• Données de géolocalisation approximative

**Données d'utilisation :**
• Durée de connexion
• Sites web visités (anonymisés)
• Bande passante utilisée
• Préférences de navigation`
      },
      {
        id: 'data-usage',
        title: 'Utilisation des données',
        icon: Users,
        content: `Vos données sont utilisées pour :

**Services essentiels :**
• Vous fournir l'accès WiFi gratuit
• Gérer votre session de connexion
• Assurer la sécurité du réseau

**Amélioration des services :**
• Analyser les performances du réseau
• Identifier les problèmes techniques
• Optimiser la qualité de service

**Communication :**
• Vous informer des mises à jour importantes
• Répondre à vos questions et demandes
• Vous proposer des services adaptés (avec votre consentement)`
      },
      {
        id: 'data-sharing',
        title: 'Partage des données',
        icon: Globe,
        content: `Nous ne vendons jamais vos données personnelles. Le partage est limité aux cas suivants :

**Prestataires de services :**
• Opérateurs téléphoniques (pour l'authentification SMS)
• Services d'analyse anonymisés
• Partenaires techniques certifiés

**Obligations légales :**
• Sur demande des autorités compétentes
• Pour protéger nos droits légaux
• En cas d'urgence de sécurité publique

Tous nos partenaires sont soumis à des accords stricts de confidentialité.`
      },
      {
        id: 'data-retention',
        title: 'Durée de conservation',
        icon: FileText,
        content: `Nous conservons vos données selon les principes suivants :

**Données de connexion :** 12 mois maximum
**Données marketing :** Jusqu'à révocation de votre consentement
**Données techniques :** 6 mois pour la maintenance
**Données de sécurité :** 24 mois pour la protection du réseau

Vous pouvez demander la suppression anticipée à tout moment.`
      },
      {
        id: 'your-rights',
        title: 'Vos droits',
        icon: Users,
        content: `Conformément au RGPD et à la loi sénégalaise sur les données personnelles, vous disposez des droits suivants :

**Droit d'accès :** Connaître quelles données nous avons sur vous
**Droit de rectification :** Corriger vos informations
**Droit à l'effacement :** Supprimer vos données ("droit à l'oubli")
**Droit à la portabilité :** Récupérer vos données
**Droit d'opposition :** Refuser certains traitements
**Droit de limitation :** Restreindre l'utilisation de vos données

Pour exercer vos droits, contactez-nous à ${contactEmail}`
      },
      {
        id: 'security',
        title: 'Sécurité des données',
        icon: Shield,
        content: `Nous mettons en place des mesures de sécurité robustes :

**Chiffrement :** Toutes les données sensibles sont chiffrées
**Accès contrôlé :** Seul le personnel autorisé peut accéder aux données
**Surveillance :** Monitoring continu de la sécurité
**Audits :** Contrôles réguliers de nos systèmes
**Formation :** Notre équipe est formée aux bonnes pratiques

En cas de violation de données, nous vous informerons dans les 72 heures.`
      },
      {
        id: 'cookies',
        title: 'Cookies et technologies similaires',
        icon: Database,
        content: `Nous utilisons des cookies pour améliorer votre expérience :

**Cookies essentiels :** Nécessaires au fonctionnement du service
**Cookies analytiques :** Pour comprendre l'utilisation du service
**Cookies de préférence :** Pour mémoriser vos choix

Vous pouvez gérer vos préférences de cookies à tout moment via notre gestionnaire de consentement.`
      },
      {
        id: 'contact',
        title: 'Nous contacter',
        icon: Mail,
        content: `Pour toute question concernant cette politique de confidentialité ou vos données personnelles :

**Email :** ${contactEmail}
**Téléphone :** +221 XX XXX XX XX
**Adresse :** Dakar, Sénégal

**Délégué à la protection des données :**
Disponible aux mêmes coordonnées pour toute question spécifique au RGPD.`
      }
    ],
    wo: [
      // Version Wolof simplifiée
      {
        id: 'introduction',
        title: 'Njëkku ak sutura',
        icon: Shield,
        content: `${companyName} dafa bëgg na digal sa ndigël ak sa ruy xalaat. Bii ñu di ko def ci COVID-19 yi, ñu nangoo def ni ñoo xam ne sa WiFi gratuit bi.`
      }
    ],
    en: [
      // Version anglaise complète
      {
        id: 'introduction',
        title: 'Introduction',
        icon: Shield,
        content: `${companyName} is committed to protecting your privacy and personal data. This privacy policy explains how we collect, use and protect your information when you use our free WiFi services.`
      }
    ]
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <FileText className="h-4 w-4 mr-2" />
      Politique de confidentialité
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Politique de confidentialité
            </div>
            <div className="flex gap-1">
              {(['fr', 'wo', 'en'] as const).map((lang) => (
                <Button
                  key={lang}
                  variant={language === lang ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLanguage(lang)}
                >
                  {lang.toUpperCase()}
                </Button>
              ))}
            </div>
          </DialogTitle>
          <DialogDescription>
            Dernière mise à jour : {lastUpdated}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Résumé */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Résumé exécutif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <Database className="h-8 w-8 mx-auto text-primary" />
                  <div>
                    <div className="font-semibold text-sm">Données minimales</div>
                    <div className="text-xs text-muted-foreground">Seulement nécessaires</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Shield className="h-8 w-8 mx-auto text-primary" />
                  <div>
                    <div className="font-semibold text-sm">Sécurité renforcée</div>
                    <div className="text-xs text-muted-foreground">Chiffrement complet</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Users className="h-8 w-8 mx-auto text-primary" />
                  <div>
                    <div className="font-semibold text-sm">Vos droits</div>
                    <div className="text-xs text-muted-foreground">RGPD complet</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Trash2 className="h-8 w-8 mx-auto text-primary" />
                  <div>
                    <div className="font-semibold text-sm">Suppression</div>
                    <div className="text-xs text-muted-foreground">À tout moment</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contenu principal */}
          <Accordion type="multiple" defaultValue={['introduction', 'your-rights']}>
            {sections[language].map((section) => {
              const Icon = section.icon;
              return (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {section.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                      {section.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button variant="outline" className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger mes données
                </Button>
                <Button variant="outline" className="justify-start">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer mon compte
                </Button>
                <Button variant="outline" className="justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Nous contacter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Conformité */}
          <div className="flex flex-wrap gap-2 justify-center pt-4">
            <Badge variant="outline">RGPD Conforme</Badge>
            <Badge variant="outline">Loi Sénégalaise</Badge>
            <Badge variant="outline">ISO 27001</Badge>
            <Badge variant="outline">Certifié Sécurité</Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicy;