# Kènè — Product Requirements Document (PRD)

> **Version** : 1.0 — MVP Vibe Coding
> **Périmètre** : 4 sprints (Sprint 1 à 4)
> **Référence** : Cahier des charges complet (286 pages, 11 parties)
> **Stack** : Next.js 16 + TypeScript + Prisma + SQLite + VLM (z-ai-web-dev-sdk)

---

## 1. VISION

### 1.1 Énoncé
**Kènè** est la première plateforme beauté et bien-être panafricaine qui combine, en un seul produit :
- Diagnostic de peau par IA calibrée peaux mélanodermes (Fitzpatrick IV-VI)
- Mise en relation cliente ↔ entreprise (instituts, spas, dermo-conseillères)
- Gestion complète de l'entreprise (RDV, caisse, stock, paie CNPS/IGR, compta SYSCOHADA)
- Boutique cosmétique avec botaniques africains

### 1.2 Tagline
*« La beauté mélanoderme, de A à Z. »*

### 1.3 Promesse
> Une cliente scanne sa peau → reçoit un diagnostic adapté à sa carnation → réserve un soin chez l'institut partenaire le plus proche → paie par Wave/Orange Money → l'institut gère tout le reste (caisse, stock, paie, compta) dans la même plateforme, en conformité avec la loi ivoirienne/sénégalaise.

---

## 2. PROBLÈME → SOLUTION

### 2.1 Problèmes actuels (Afrique, peaux mélanodermes)

| Problème | Impact |
|---|---|
| Apps IA peau occidentales biaisées sur peaux noires | Diagnostics erronés, exclusion |
| Aucune solution spa/beauté n'intègre Mobile Money natif | Inutilisable en CI/SN |
| Paie CNPS/IGR et compta SYSCOHADA absentes des ERP génériques | Conformité impossible sans intégrateur |
| Solutions pro (VISIA) à 30 000€ | Inaccessibles |
| Aucune app ne couvre le corps (visage uniquement) | Pathologies invisibles (AKN, mélanome acral) |

### 2.2 Solution Kènè

| Pillier | Différenciation |
|---|---|
| **IA mélanoderme** | Dataset panafricain, focus Fitzpatrick IV-VI |
| **Mobile Money first** | Wave + Orange Money natifs |
| **Conformité out-of-the-box** | CNPS CI, IPM SN, IGR, TVA, SYSCOHADA |
| **Multi-zones corps** | Visage + dos + cuir chevelu + mains + barbe + nævi |
| **ERP métier beauté** | RDV variables, commissions, fiches photo avant/après |
| **Prix en XOF** | Adapté au pouvoir d'achat |

---

## 3. PERSONAS

### 3.1 Cliente — « Mariam, 28 ans, Abidjan »
- Citadine, smartphone Android milieu de gamme
- Veut comprendre sa peau (mélanoderme, PIH post-acné)
- Réserve soins, achète produits
- Paie en Wave par défaut

### 3.2 Gérante institut — « Ndeye, 35 ans, Dakar »
- 4-6 employées (esthéticiennes, caissière)
- Veut agenda + caisse + CRM + paie IPM en 1 outil
- Comptable externe pour liasse SYSCOHADA

### 3.3 Dermo-conseillère — « Aïssata, 30 ans, Bamako »
- Conseil dermatologique personnalisé
- Veut assistant IA + fiches clients enrichies

### 3.4 Comptable — « Chen, 38 ans, Douala »
- Export liasse fiscale + déclaration CNPS
- Pas de ressaisie

---

## 4. PÉRIMÈTRE MVP — 4 Sprints de Vibe Coding

### Sprint 1 — « Magique » (App Cliente : Diagnostic IA) ⭐
**Objectif** : effet wow, valide l'IA mélanoderme

| Module | User Stories clés |
|---|---|
| Onboarding | OTP téléphone, profil peau (Fitzpatrick, allergies), consentement santé |
| Diagnostic IA | Capture multi-zones assistée, inférence VLM, 14 indicateurs visage |
| Résultats | Écran VISIA-like (grille 2×4 + heatmaps + scores + pourcentages) |
| Vues spectrales | Standard / Pigmentation profonde / Inflammation / Acné (simulées) |
| Multi-zones | Visage + dos + cuir chevelu + mains + barbe + nævi corps |
| Recommandations | Routine matin/soir + produits + soins |
| Orientation dermato | Si ABCDE nævi suspect |
| Historique | Liste diagnostics + comparaison avant/après |

### Sprint 2 — « Business » (App Pro : Agenda + Caisse + CRM)
**Objectif** : valide la valeur ERP métier

| Module | User Stories clés |
|---|---|
| Onboarding entreprise | KYB, config pays (CI/SN), wizard setup |
| Agenda Pro | Vue multi-praticiennes, drag & drop, rappels auto |
| Caisse POS | Encaissement Wave/Orange (simulé), espèces, ticket thermique |
| CRM clients | Fiches enrichies (diagnostics, photos avant/après, historique) |
| Catalogue | Soins + produits (avec botaniques africains) |
| Stock | Articles, lots, DLC, alertes seuil, mouvements |

### Sprint 3 — « Argent » (Boutique + Wallet + RDV end-to-end)
**Objectif** : boucle cliente complète

| Module | User Stories clés |
|---|---|
| Boutique | Catalogue cosmétique, recommandations post-diagnostic |
| Panier + checkout | Paiement MoMo simulé, wallet Kènè |
| Wallet | Cashback, parrainage, approvisionnement |
| Réservation RDV | Recherche instituts, créneaux, acompte MoMo |
| Rappels | SMS/WhatsApp (logs simulés) |
| Avis post-RDV | Notes + commentaires |

### Sprint 4 — « Conformité » (Paie + Compta)
**Objectif** : différenciant vs Odoo/PayFit

| Module | User Stories clés |
|---|---|
| Employés & RH | Contrats CDI/CDD, pointage, congés |
| Paie CI | CNPS (pension 14%, prestations 5%, AT 2%), IGR barème, CN 1,5% |
| Paie SN | IPM, IPRES retraite 14%, IR Sénégal |
| Bulletin paie | PDF conforme, distribution employé |
| Déclarations | Export e-CNPS CI, IPM SN |
| Compta SYSCOHADA | Plan comptable, journaux auto, grand livre, balance |
| TVA 18% | Collectée/déductible, déclaration mensuelle |
| Liasse fiscale | Bilan + compte résultat + annexe |

---

## 5. ARCHITECTURE PRODUIT (3 FACES)

| Face | Plateforme | Routes |
|---|---|---|
| 📱 App Cliente | PWA mobile-first (Next.js) | `/` (client) |
| 💻 App Pro | Web desktop/tablette | `/pro/*` |
| 🛡️ Console Admin | Web | `/admin/*` |

**Note** : Une seule app Next.js, 3 espaces via route groups `(client)`, `(pro)`, `(admin)`.

---

## 6. DESIGN SYSTEM PANAFRICAIN

### 6.1 Typographie
- **Titres & logo** : `Ojuju` (Ụdị Foundry, Google Fonts — 1ère fonderie africaine)
- **Corps** : `Questrial` (Google Fonts, supporte diacritiques langues africaines)
- **Chiffres financiers** : `IBM Plex Mono`

### 6.2 Palette

| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Primaire | Or Kènè | `#C8951E` | CTA, accents |
| Secondaire | Terre Bogolan | `#A0522D` | Touches premium |
| Mélanine | Noir profond | `#1A1410` | Texte, élégance |
| Croissance | Vert Baobab | `#3F7D3F` | Succès, botaniques |
| Confiance | Bleu Indigo | `#1B3A6B` | Finance (en touches) |
| Pureté | Crème Karité | `#F8F1E4` | Fonds |
| Accent | Bordeaux Bissap | `#8B1A3B` | Alertes |
| Vibrance | Orange Sunset | `#E07A2B` | CTA secondaires |

### 6.3 Icônes (linear 2px stroke, dérivées Adinkra)

| Module | Icône source |
|---|---|
| RDV | Sankofa (retour sources) |
| Caisse/POS | Aban (forteresse) |
| Beauté/Soin | Duafe (peigne) ⭐ logo |
| IA Diagnostic | Nea Onnim (savoir) |
| Relation client | Osram Ne Nsoromma (lune & étoile) |
| Stock | Motif Kente géométrisé |
| Paie | Fihankra (sécurité) |
| Comptabilité | Motif tissé Baoulé |
| Botaniques | Silhouettes karité/baobab/moringa |

### 6.4 Patterns
- **Kente** : bandes fines en arrière-plan headers
- **Bogolan** : micro-points en filigrane fonds
- **Règle** : patterns couvrent max 5-10% surface (éviter surcharge)

### 6.5 Principes UX
- Mobile-first absolu
- Onboarding téléphone + OTP
- Boutons larges contrastés (Android milieu de gamme, luminosité forte)
- Iconographie explicite + texte
- Bottom navigation + FAB
- États offline gérés
- Dark mode
- Pas d'emoji (icônes cohérentes Adinkra)

---

## 7. ARCHITECTURE TECHNIQUE

### 7.1 Stack
| Couche | Technologie |
|---|---|
| Framework | Next.js 16 App Router |
| Langage | TypeScript strict |
| Styling | Tailwind CSS 4 + shadcn/ui (custom panafricain) |
| DB | Prisma + SQLite (dev) |
| IA | z-ai-web-dev-sdk (VLM glm-4.6v) |
| Animations | Framer Motion |
| Thème | next-themes (dark mode) |
| Icons | Lucide + SVG Adinkra custom |

### 7.2 Structure projet
```
src/
├── app/
│   ├── (client)/        # App Cliente (mobile-first)
│   ├── (pro)/           # App Pro (desktop)
│   └── (admin)/         # Console admin
├── components/
│   ├── ui/              # shadcn/ui
│   └── kene/            # Composants Kènè (Adinkra icons, etc.)
├── lib/
│   ├── db/              # Prisma client + queries
│   ├── ai/              # VLM diagnostic service
│   ├── payroll/         # Calculs CNPS/IPM/IGR
│   ├── accounting/      # SYSCOHADA engine
│   └── utils/
└── api/                 # Routes API (REST)
```

### 7.3 Base de données (Prisma)

**Tables principales** (multi-tenant via `tenant_id`) :
- Globales : `countries`, `currencies`, `momo_operators`, `users`
- Tenant : `tenants`, `sites`, `employees`, `clients`, `services`, `resources`
- Opérations : `appointments`, `sales`, `payments`, `diagnoses`
- Produits : `products`, `inventory_items`, `inventory_movements`
- Wallet : `wallets`, `wallet_transactions`
- Paie (Sprint 4) : `pay_periods`, `payslips`
- Compta (Sprint 4) : `accounting_entries`, `chart_of_accounts`
- Sécurité : `audit_logs`, `consents`

### 7.4 API REST (sélection)
- `POST /api/auth/otp/request` + `verify`
- `POST /api/diagnoses` (async, webhook completion)
- `GET /api/institutes` + `availability` + `appointments`
- `POST /api/payments/initiate` (Wave/Orange simulés)
- `GET/POST /api/pro/sales` (caisse)
- `GET/POST /api/pro/clients` (CRM)
- `POST /api/pro/payroll/run` (Sprint 4)
- `GET /api/pro/accounting/*` (Sprint 4)

### 7.5 IA Diagnostic (VLM)

**Approche** :
- Cliente upload photo multi-zones (visage, dos, mains…)
- Backend appelle `zai.chat.completions.createVision()` avec prompt structuré
- Le VLM (glm-4.6v) analyse et renvoie JSON :
  - Score global 0-100
  - 14 indicateurs visage avec sévérité 0-3
  - Indicateurs spécifiques par zone (dos, mains, etc.)
  - Marquages zones (coordonnées bbox)
  - Recommandations routine/produits/soins
  - Flag orientation dermatologique (ABCDE)

**Prompt IA** (extrait) :
```
Analyse cette photo de peau mélanoderme. Retourne JSON :
{
  "score_global": 0-100,
  "indicateurs": [
    { "nom": "PIH", "severite": 0-3, "zones": [...] },
    ...
  ],
  "recommandations": {...},
  "orientation_dermato": bool,
  "raison_orientation": "..."
}
```

### 7.6 Dermatologue IA Conversationnel (Multi-modal)

**Concept** : Un assistant d'éducation cutanée et de triage clinique (non-prescripteur) disponible sur 5 canaux d'interaction.

- **💬 Tchat (Texte/Message)** : UI conversationnelle inspirée de WhatsApp pour poser des questions courantes sur les ingrédients botaniques, les routines, et analyser les symptômes.
- **🎙️ Audio (Notes vocales - Entrée/Sortie)** : Support d'entrée et de sortie vocale dans les langues locales (Français, Nouchi, Wolof, Bambara) pour garantir l'inclusivité des utilisateurs peu lettrés ou préférant le vocal.
- **📸 Photo (Visualisation & Triage)** : Upload d'une photo de lésion ou de nævus pour analyse immédiate (Grad-CAM, ABCDE, etc.) avec triage par niveau d'urgence :
  - *Vert* : Soin de routine / Botanique conseillé.
  - *Jaune* : Avis requis par une dermo-conseillère via l'app.
  - *Rouge* : Alerte - Prise de RDV immédiate en institut ou chez un médecin partenaire.
- **📹 Vidéo (Avatar Interactif)** : Un avatar 3D en WebGL représentant un dermatologue virtuel ou un "Skin Twin", animé en temps réel avec synchronisation des lèvres (lip-sync) lors de l'énonciation des conseils.
- **📲 Suivi WhatsApp (Proactif)** : Des messages asynchrones envoyés à la cliente pour suivre son rituel (ex : "Bonjour Mariam, comment se porte ta peau après 3 jours de sérum Moringa ? Envoie-moi un message ou une photo !").

### 7.6 Simulations (POC)
| Élément | Simulation |
|---|---|
| Wave / Orange Money | Page paiement simulée (succès auto après 3s) |
| SMS / WhatsApp | Log dans console + table notifications |
| Envoi email | Log |
| Impression ticket | Vue HTML format ticket |

---

## 8. RÈGLES MÉTIER CRITIQUES (à coder)

### 8.1 Barème IGR CI (mensuel)
```
0 - 75 000 : 0%
75 001 - 240 000 : 16%
240 001 - 800 000 : 21%
800 001 - 2 400 000 : 24%
2 400 001 - 8 000 000 : 28%
> 8 000 000 : 36%
```

### 8.2 Cotisations CNPS CI
- Pension vieillesse : employeur 7,7% + salarié 6,3% (plafond 3 375 000 FCFA)
- Prestations familiales : employeur 5% (plafond 70 000)
- Maternité : employeur 0,75% (plafond 70 000)
- AT/MP : employeur 2% services (plafond 70 000)
- Congés payés : 8% (employeur)
- CN : 1,5% (salarié)

### 8.3 Cotisations IPM/IPRES SN
- Prestations familiales : employeur 7% (plafond 63 000)
- IPRES retraite : employeur 8,4% + salarié 5,6% (plafond 432 000)
- IPRES cadres : employeur 3,6% + salarié 2,4%

### 8.4 TVA
- CI : 18%
- SN : 18%

### 8.5 SYSCOHADA — Plan comptable
9 classes (1 à 9), pré-chargé. Journaux auto depuis caisse/achats. Génération bilan + compte de résultat.

### 8.6 Politique annulation RDV
| Délai avant RDV | Remboursement acompte |
|---|---|
| > 72h | 100% |
| 24-72h | 80% |
| 2-24h | 30% |
| < 2h | 0% (no-show) |

### 8.7 Scoring RFM
- Récence (jours depuis dernière visite) : 1-5
- Fréquence (12 mois) : 1-5
- Montant (12 mois) : 1-5
- Segments : Champions, Fidèles, Potentiels, À risque, Perdus, Nouveaux

### 8.8 Score diagnostic multi-zones
```
Score Global = moyenne pondérée :
  - Visage : 40%
  - Dos : 15%
  - Cuir chevelu : 10%
  - Mains : 10%
  - Barbe : 5%
  - Nævi corps : 20% (sécurité patient)
```

---

## 9. CRITÈRES DE SUCCÈS PAR SPRINT

### Sprint 1 — Succès
- [ ] Cliente peut s'inscrire par OTP
- [ ] Capture photo visage fonctionne avec assistance
- [ ] VLM renvoie un diagnostic structuré en < 30s
- [ ] Écran résultats VISIA-like s'affiche (grille 2×4 + heatmaps)
- [ ] Multi-zones (visage + 2 autres) fonctionnel
- [ ] Recommandations affichées
- [ ] Historique consultable
- [ ] Orientation dermato si ABCDE

### Sprint 2 — Succès
- [ ] Gérant peut créer compte entreprise + wizard setup
- [ ] Agenda multi-praticiennes fonctionnel (créer/déplacer RDV)
- [ ] Caisse encaisse (Wave/Orange simulés + espèces)
- [ ] CRM affiche fiches clients enrichies
- [ ] Catalogue soins/produits CRUD
- [ ] Stock décrémente à la vente

### Sprint 3 — Succès
- [ ] Boutique catalogue consultable
- [ ] Panier + checkout (MoMo simulé)
- [ ] Wallet Kènè crédité (cashback)
- [ ] Réservation RDV end-to-end (recherche → acompte → confirmation)
- [ ] Rappels SMS simulés (logs)
- [ ] Avis post-RDV

### Sprint 4 — Succès
- [ ] Employés créés avec contrats
- [ ] Pointage fonctionne
- [ ] Génération paie mensuelle CI (CNPS + IGR + CN)
- [ ] Génération paie mensuelle SN (IPRES + IR)
- [ ] Bulletin PDF conforme
- [ ] Export déclaration e-CNPS (format XML)
- [ ] Compta SYSCOHADA (journaux auto depuis caisse)
- [ ] Liasse fiscale (bilan + compte résultat)

---

## 10. MÉTRIQUES DE SUCCÈS POST-MVP

### 10.1 Adoption
- 10 instituts pilotes onboardés en 1 mois
- 500 clientes inscrites en 2 mois
- 50 diagnostics/jour en moyenne

### 10.2 Engagement
- DAU/MAU > 30% (clientes actives)
- 70% des clientes font un 2e diagnostic dans le mois
- Taux de conversion diagnostic → RDV > 15%

### 10.3 Business
- 5 instituts payants après 2 mois d'essai
- MRR > 500 000 FCFA/mois (10 clients Pro)
- NPS > 40

---

## 11. RISQUES & MITIGATION (vibe coding)

| Risque | Mitigation |
|---|---|
| VLM biaisé sur peaux mélanodermes | Prompt spécialisé + disclaimer clair « estimation IA » |
| Mobile Money non disponible en sandbox | Simulation réaliste + page paiement mock |
| Volume de dev (4 sprints ambitieux) | Prioriser Sprint 1 (effet wow) puis ajuster |
| Pas de dataset réel | VLM suffit pour POC, dataset CHU en parallèle |
| Performance mobile (PWA) | Lazy loading, compression images, offline-first |

---

## 12. NON-COVERED (out scope MVP vibe coding)

- App mobile native (React Native) → PWA à la place
- Paiements réels (clés API marchand MoMo) → simulés
- Entraînement modèle IA propriétaire → VLM existant
- Déploiement cloud régional AWS af-south-1 → local
- Marketplace cosmétique panafricaine → Phase 2
- Langues locales (nouchi, wolof, bambara) → français seul
- Multi-pays au-delà CI/SN → Phase 2+
- Téléconsultation vidéo → Phase 1B (post-vibe)
- Edge inference offline → Phase 1B

---

## 13. ORDRE DE CONSTRUCTION RECOMMANDÉ

### Phase préliminaire (avant Sprint 1)
1. Setup design system (Ojuju, palette, shadcn custom)
2. Setup Prisma + schéma DB initial
3. Authentification OTP (base)
4. Layouts 3 faces (client mobile, pro desktop, admin)

### Sprint 1 — Diagnostic IA (priorité max)
### Sprint 2 — App Pro ERP
### Sprint 3 — Boutique + RDV end-to-end
### Sprint 4 — Paie + Compta

---

## 14. DÉCISIONS TECHNIQUES FINALES

| Décision | Choix |
|---|---|
| Framework | Next.js 16 App Router |
| Langage | TypeScript strict |
| Styling | Tailwind 4 + shadcn/ui |
| DB | Prisma + SQLite |
| IA | z-ai-web-dev-sdk VLM (glm-4.6v) + LLM / Web Speech |
| Auth | OTP SMS (simulé) + JWT |
| Multi-tenant | Row-Level Security Prisma (`tenant_id`) |
| Animations / 3D | Framer Motion + R3F / Drei + GSAP ScrollTrigger + Lenis |
| Thème | next-themes (dark mode) |
| State | Zustand (client) + TanStack Query (server) |
| Validation | Zod |
| Icons | Lucide + SVG Adinkra custom |
| Face Tracking / Audio | MediaPipe Face Mesh + Web Audio API (balafon/kora effects) |

---

## 15. PROCHAINES ÉTAPES IMMÉDIATES

1. ✅ PRD validée (ce document)
2. 🚧 Setup design system + DB + auth
3. 🚧 Sprint 1 : Diagnostic IA
4. 🚧 Sprint 2 : App Pro
5. 🚧 Sprint 3 : Boutique + RDV
6. 🚧 Sprint 4 : Paie + Compta

---

*PRD Kènè v1.0 — Prêt pour vibe coding.*
