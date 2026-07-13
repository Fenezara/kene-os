# Kènè — Plateforme Beauté & Bien-être Mélanoderme pour l'Afrique

> Document de conception préliminaire — à valider avant construction

---

## 1. Vision & Positionnement

**Kènè** (du bambara *kènè* = santé, bien-être) est une plateforme **bi-face (B2C + B2B)**, **mobile-first**, **Africa-first**, qui unifie en un seul produit :

1. Le **diagnostic de peau par IA** entraînée sur peaux mélanodermes
2. La **mise en relation cliente ↔ entreprise** (instituts, spas, dermo-conseillères, esthéticiennes)
3. La **gestion complète de l'entreprise** (RDV, caisse, stock, employés, paie CNPS/IGR, comptabilité SYSCOHADA, marketing)
4. La **boutique cosmétique** intégrée

**Tagline :** « La beauté mélanoderme, de A à Z. »

**Promesse :** Une cliente scanne sa peau, reçoit un diagnostic adapté à sa carnation, réserve un soin chez l'institut partenaire le plus proche, achète les produits recommandés, paie par Wave — et l'institut gère tout le reste (caisse, stock, paie, compta) dans la même plateforme, en conformité avec la loi ivoirienne.

---

## 2. Les 3 faces du produit

| Face | Plateforme | Utilisateur |
|---|---|---|
| **App Cliente** | iOS, Android, Web | La cliente / le client |
| **App Pro** | Web (tablette/desktop) + mobile compagnon | Gérante, esthéticiennes, dermo-conseillère, comptable, RH |
| **Console Kènè** | Web (super-admin) | L'équipe Kènè (multi-entreprises, marketplace, modération) |

---

## 3. Personas cibles

- **Mariam, 28 ans, Abidjan** — la cliente : veut comprendre sa peau (mélanodermie, taches), réserver un soin, acheter de bons produits, payer en Mobile Money.
- **Awa, 40 ans, gérante d'institut à Cocody** — veut un outil tout-en-un : RDV, caisse, stock, paie de ses 6 employées, compta pour son expert-comptable.
- **Fatou, 32 ans, dermo-conseillère** — veut un assistant IA pour ses consultations, des fiches clients enrichies, des recommandations produits fiables.
- **Konan, comptable** — veut exporter la liasse fiscale SYSCOHADA et les déclarations CNPS sans ressaisie.
- **Super-admin Kènè** — gère le réseau d'entreprises partenaires, la marketplace, la qualité du modèle IA.

---

## 4. APP CLIENTE — Fonctionnalités détaillées

### 4.1 Onboarding & profil
- Inscription par **téléphone + OTP SMS** (pas d'email obligatoire)
- Profil peau : type, carnation (échelle Fitzpatrick V-VI prédominante), sensibilités, allergies, traitements en cours
- Photo de profil + consentement données santé (IPDCP)

### 4.2 Diagnostic IA de peau (cœur du client)
- **Scan selfie multi-zones** : visage (front, joues, zone T, menton), mais aussi dos, mains, cuir chevelu, zones spécifiques
- **Assistance capture temps réel** : alignement, luminosité, distance (évite les photos inutilisables)
- **30+ indicateurs** adaptés peau mélanoderme :
  - Hyperpigmentation, mélasma, taches post-inflammatoires
  - Acné, points noirs, kystes
  - Séborrhée, sécheresse, desquamation
  - Pseudofolliculite de barbe, dermite séborrhéique, pityriasis versicolor
  - Ridules, élasticité, pores, texture
  - Cernes, poches, vergetures, kéloïdes
  - Nævi / grains de beauté (cartographie + alerte orientation dermato)
- **Score de peau 0-100** + sous-scores par dimension
- **Suivi temporel** : galerie avant/après, courbe d'évolution
- **Recommandations** : routine soins + produits disponibles chez l'institut partenaire + conseils lifestyle
- **Orientation dermato** si lésion suspecte (pas de diagnostic médical — conformité)
- Mode **hors-ligne** : le scan peut être fait offline puis synchronisé

### 4.3 Recherche & réservation
- Géolocalisation des instituts partenaires (carte + liste)
- Filtres : type de soin, prix, disponibilité, notes, spécialité (dermo, spa, massage, ongles, cheveux)
- Agenda en temps réel, réservation instantanée
- Paiement **acompte / total** en Mobile Money à la réservation
- Rappels SMS/WhatsApp/notifications push
- Reprogrammation / annulation avec politique claire

### 4.4 Téléconsultation dermo-conseil
- Chat / appel vidéo avec la dermo-conseillère de l'institut
- Partage du dernier diagnostic IA
- Prescription de soins & produits

### 4.5 Boutique cosmétique
- Catalogue produits (vendus par l'institut partenaire + marketplace Kènè)
- Recommandations personnalisées post-diagnostic
- Panier, liste de souhaits, abonnements (livraison mensuelle routine)
- Paiement Mobile Money (Orange / MTN / Moov / Wave) + wallet Kènè
- Suivi commande, livraison ou retrait en institut

### 4.6 Fidélité & communauté
- Programme fidélité (points, paliers, récompenses)
- **Wallet Kènè** : cashback, parrainage, cagnottes
- Carte de fidélité numérique (QR code)
- Avis & notes sur soins, produits, instituts
- Partage de progression peau (opt-in) sur réseaux

### 4.7 Messagerie & notifications
- Chat direct avec l'institut
- Notifications RDV, promotions personnalisées, rappels routine

### 4.8 Espace personnel
- Historique de soins, factures, diagnostics, ordonnances de soins
- Carnet de routine (matin/soir)
- Rappels produits (à racheter)

---

## 5. APP PRO / ENTREPRISE — ERP Beauté complet

### 5.1 Tableau de bord
- KPIs temps réel : CA du jour, RDV du jour, taux d'occupation, no-shows, top soins, stock critique
- Graphiques évolution, alertes

### 5.2 Agenda & RDV
- Vue multi-praticiennes, multi-salles, multi-zones
- Soins à durées variables, enchaînements, ressources (cabine, appareil)
- Réservation online (synchronisée app cliente)
- File d'attente, overlaps, sur-réservation
- Rappels automatiques SMS/WhatsApp (réduction no-shows)
- Gestion dépôts/acomptes

### 5.3 Caisse / POS
- Encaissement Mobile Money (Orange/MTN/Moov/Wave) **natif** + espèces + carte + chèque + wallet
- **Réconciliation automatique** Mobile Money ↔ caisse (via API opérateurs + matching)
- Ventes produits + prestations + forfaits + cartes cadeaux
- Remises, offres, codes promo
- Impression ticket (imprimante thermique Bluetooth)
- Brouillard de caisse, clôture journalière, z de caisse
- Multi-caisses, multi-sites

### 5.4 CRM clients
- Fiche client enrichie : historique diagnostics IA, photos avant/après, soins, achats, préférences, allergies
- Segmentation (carnation, type de peau, fréquence, panier moyen)
- Scoring client (RFM)
- Notes privées praticienne
- Consentement RGPD/IPDCP, droit à l'oubli

### 5.5 Catalogue soins & tarifs
- Bibliothèque de soins (durée, prix, ressources, commissions)
- Tarification dynamique (heures creuses, promotions)
- Forfaits, abonnements, packs

### 5.6 Stock & produits cosmétiques
- Gestion articles (SKU, lot, DLC, fournisseur, prix d'achat/vente)
- Inventaire, alertes seuil, ruptures
- Mouvements (achats, ventes, pertes, transferts inter-sites)
- Recommandations de réapprovisionnement
- Traçabilité lots (cosmétique réglementé)
- Valorisation stock (CUMP, FIFO)

### 5.7 Employés & RH
- Contrats (CDI, CDD, essai), avenants
- Fiches employés (documents, RIB Mobile Money)
- **Pointage** (mobile/biométrie) — présences, retards, absences
- Congés & permissions (Code du travail CI)
- Primes, indemnités (transport, logement, fonction, ancienneté)
- Avances & prêts salariés
- ATS (autorisation de travail salariés étrangers)

### 5.8 Paie conforme Côte d'Ivoire
- **Barème IGR** ivoirien (mensuel + annuel, tranche par tranche)
- **Cotisations CNPS** : pension vieillesse, prestations sociales, accidents du travail / maladies professionnelles (taux employeur + salarié)
- **Congés payés** (indemnité 8%)
- **Préavis, licenciement, indemnités de départ**
- Calcul net à payer
- **Bulletin de paie PDF** conforme
- **Export déclaration e-CNPS** (format attendu)
- Génération des éléments pour DGI (IRL)
- Archivage légal

### 5.9 Comptabilité SYSCOHADA
- **Plan comptable OHADA** pré-chargé
- Journaux : ventes, achats, banque, caisse, OD
- Saisie automatique depuis la caisse (encaissements) et les achats
- Grand livre, balance, journal centralisateur
- **Bilan, compte de résultat, annexe** (états financiers annuels OHADA)
- **TVA 18% CI** : collectée, déductible, déclaration mensuelle
- **Retenues à la source** (prestations)
- **Patente**, contribution des patentes, IBS, minimum de perception
- **Liasse fiscale** annuelle exportable (pour expert-comptable)
- Rapprochement bancaire
- Trésorerie prévisionnelle

### 5.10 Achats & fournisseurs
- Bons de commande, réception, factures fournisseurs
- Échéancier, paiements Mobile Money/virement
- Comparaison prix fournisseurs

### 5.11 Marketing & fidélité
- Campagnes **SMS / WhatsApp** (segmentation clients)
- Emailings, push notifications
- Promotions, codes promo, ventes flash
- Programme fidélité paramétrable
- Cartes cadeaux
- Parrainage

### 5.12 Reporting & KPIs
- CA par jour/semaine/mois/site/praticienne
- Taux d'occupation, no-show, panier moyen
- Top soins, top produits
- Rentabilité par prestation
- Stock turnover
- Tableaux exportables (PDF, Excel)

### 5.13 Multi-sites & rôles
- Gestion multi-branches (chaîne d'instituts)
- Rôles & permissions fins : gérant, comptable, RH, praticienne, caissier, magasinier
- Audit trail (qui a fait quoi, quand)

### 5.14 Marketplace Kènè
- Visibilité de l'institut sur la marketplace grand public
- Gestion des avis, réputation
- Commission Kènè sur RDV marketplace

---

## 6. CONSOLE KÈNÈ (Super-admin)
- Gestion multi-entreprises (onboarding, abonnements, facturation)
- Modération marketplace & avis
- Supervision modèle IA (drift, qualité, ré-entraînement)
- Métriques plateforme, support, tickets
- Gestion partenaires Mobile Money & taux
- Conformité, RGPD/IPDCP, journaux d'audit

---

## 7. MOTEUR IA DIAGNOSTIC — Spécificités mélanodermes

### Dataset & éthique
- Dataset constitué en **partenariat avec dermatologues d'Abidjan, Dakar, Lagos, Yaoundé**
- Concentration sur **peaux Fitzpatrick IV-VI** (sous-représentées mondialement)
- Validation clinique par un comité scientifique africain
- Anonymisation + consentement éclairé + droit de retrait

### Indicateurs couverts (focus afro-spécifiques)
- Hyperpigmentation post-inflammatoire (PIH)
- Mélasma, chloasma
- Pseudofolliculite de barbe (fréquente sur peaux noires)
- Dermite séborrhéique
- Pityriasis versicolor
- Acné kystique, nodulaire
- Kéloïdes & cicatrices hypertrophiques
- Acanthosis nigricans
- Taches de rousseur mélanodermes
- Nævi (cartographie + règle ABCDE → orientation dermato)

### Architecture
- Modèle vision (PyTorch) entraîné + fine-tuning continu
- Inférence **cloud** (qualité) + **edge léger** (offline)
- Explicabilité : heatmap des zones détectées (transparence)
- **Pas de diagnostic médical** : orientation vers dermato si suspicion

---

## 8. PAIEMENTS & MOBILE MONEY

| Moyen | Intégration |
|---|---|
| Orange Money CI | API marchand officielle |
| MTN MoMo CI | API marchand officielle |
| Moov Money CI | API marchand officielle |
| Wave CI | API marchand officielle |
| Carte Visa/Mastercard | Acquéreur local |
| Espèces, chèque | Saisie manuelle caisse |
| Wallet Kènè | Porte-monnaie interne (cashback, parrainage) |

- Paiement **acompte, total, échelonné, abonnement**
- Réconciliation auto (matching transaction Mobile Money ↔ vente caisse)
- Reçus & factures **normés DGI**
- Sécurité : 2FA, journalisation, anti-fraude

---

## 9. CONFORMITÉ CÔTE D'IVOIRE

- **IPDCP** (Commission Informatique et Libertés) : déclaration, consentement, droit d'accès/rectification/oubli
- **Données de santé** : consentement explicite, chiffrement fort, hébergement sécurisé, accès tracé
- **Code du travail CI** : contrats, congés, préavis, indemnités
- **CNPS** : déclarations e-CNPS, cotisations
- **DGI** : IGR, TVA, retenues à la source, patente, IBS
- **OHADA** : comptabilité SYSCOHADA, états financiers
- **Hébergement** : cloud régional Afrique de l'Ouest (souveraineté des données)
- **Chiffrement** bout-en-bout, au repos, en transit
- **Audit trail** complet (toute action tracée)

---

## 10. STACK TECHNIQUE

| Couche | Technologie |
|---|---|
| Mobile client | React Native (Expo) — iOS + Android + web |
| App Pro web | Next.js + TypeScript |
| Console admin | Next.js |
| Backend | API REST + WebSocket, microservices, Node/TypeScript |
| Base de données | PostgreSQL multi-tenant (row-level security) |
| IA | PyTorch, inférence serveur + edge |
| Files/Cache | Redis |
| Stockage médias | Object storage (S3-compatible) |
| Temps réel | Socket.io |
| Infra | Conteneurs Docker, scalable, cloud régional |
| Offline | Sync différée mobile (zones à connectivité faible) |

---

## 11. DIFFÉRENCIATEURS vs MARCHÉ

| Critère | Kènè | Neutrogena/Vichy | Planity/Fresha | Odoo | Sage/PayFit |
|---|---|---|---|---|---|
| IA entraînée peaux mélanodermes | ✅ | ❌ | ❌ | ❌ | ❌ |
| Mobile Money natif (Orange/MTN/Wave) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Paie CNPS + IGR ivoirien | ✅ | ❌ | ❌ | ❌ (dev) | ❌ |
| Comptabilité SYSCOHADA | ✅ | ❌ | ❌ | ❌ (module) | ❌ |
| Métier beauté/spa/dermo | ✅ | ❌ | ✅ | ❌ | ❌ |
| Met en relation client ↔ entreprise | ✅ | ❌ | partiel | ❌ | ❌ |
| Boutique cosmétique intégrée | ✅ | partiel | ❌ | ❌ | ❌ |
| Prix adapté Afrique (XOF) | ✅ | ❌ | ❌ | partiel | ❌ |
| Mobile-first offline | ✅ | partiel | ✅ | ❌ | ❌ |
| Français + langues locales | ✅ | partiel | ✅ | ✅ | ❌ |

---

## 12. PRINCIPES DE DESIGN (pourquoi meilleur)

1. **Africa-first** — pas une traduction d'un produit occidental
2. **Mélanoderme by design** — l'IA est juste pour les peaux noires/métissées
3. **Mobile Money first** — payer avec Wave/Orange est l'expérience par défaut, pas une option
4. **Conformité CI out-of-the-box** — la paie et la compta marchent le jour 1, sans intégrateur
5. **Offline-first** — l'app fonctionne même avec une connexion instable
6. **Léger & rapide** — optimisé pour smartphones d'entrée de gamme (Android Go)
7. **UX locale** — couleurs, icônes, micro-copy adaptés ; nouchi et langues locales à venir
8. **Sécurité banque** — chiffrement, 2FA, audit trail
9. **Un seul produit, pas 5** — remplace agenda + caisse + CRM + paie + compta
10. **Évolutif multi-pays** — CI d'abord, puis Sénégal, Mali, Burkina, Guinée, Cameroun

---

## 13. PHASAGE MVP

**Phase 1 — Cœur (3 mois)**
- App cliente : onboarding, diagnostic IA (10 indicateurs), RDV, boutique, paiement Mobile Money
- App Pro : agenda, caisse Mobile Money, CRM clients, catalogue soins

**Phase 2 — Opérations (2 mois)**
- Stock produits, marketing SMS/WhatsApp, fidélité, wallet, multi-sites

**Phase 3 — Finance & RH (2 mois)**
- Paie CNPS/IGR, comptabilité SYSCOHADA, reporting

**Phase 4 — Échelle (continu)**
- Marketplace multi-pays, téléconsultation, IA étendue, langues locales

---

## 14. MODÈLE ÉCONOMIQUE

- **SaaS Pro** (3 paliers en XOF) : Essentiel / Pro / Chaîne
- **Commission marketplace** sur RDV apportés par Kènè
- **Commission transaction** Mobile Money (part avec opérateur)
- **Premium client** : diagnostic avancé, dermo-conseil illimité
- **Publicité produits** cosmétiques sur la marketplace
- **Marketplace cosmétique** : commission sur ventes produits

---

## 15. À VALIDER AVANT CONSTRUCTION

1. Nom définitif (Kènè ? alternatives : Ndamé, Sira, Éburny, Mwasi)
2. Périmètre MVP exact (Phase 1)
3. Partenariats Mobile Money à prioriser (Wave + Orange en premier ?)
4. Sources dataset peau mélanoderme (partenaires dermato)
5. Hébergement (cloud régional : lequel ?)
6. Identité visuelle & charte (couleurs, logo)
7. Langues Phase 1 (français seul ? + nouchi ?)
