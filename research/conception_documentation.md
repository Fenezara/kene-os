# 📖 Kènè — Documentation de Conception Panafricaine

> **Document maître consolidant toutes les enquêtes menées** (diagnostic peau, gestion spa/salon, ERP, contexte CI, design africain, marchés panafricains, dermatologie mélanoderme, data protection Afrique)
>
> Statut : **Enquêtes terminées — conception documentée — en attente de validation finale avant construction**
>
> Dernière mise à jour : consolidation panafricaine

---

## TABLE DES MATIÈRES

1. Vision & Positionnement panafricain
2. Périmètre géographique & rollout multi-pays
3. Marché cible & opportunité
4. Architecture produit (3 faces)
5. APP CLIENTE — Spécifications fonctionnelles
6. APP PRO / ERP Beauté — Spécifications fonctionnelles
7. CONSOLE ADMIN Kènè
8. Moteur IA Diagnostic peau mélanoderme
9. Paiements & Mobile Money panafricains
10. Conformité réglementaire multi-pays
11. Identité visuelle & Design system panafricain
12. Architecture technique
13. Roadmap & phasage
14. Modèle économique
15. Métriques & KPIs
16. Risques & mitigation
17. Glossaire
18. Annexes : sources des enquêtes

---

# 1. VISION & POSITIONNEMENT PANAFRICAIN

## 1.1 Énoncé de vision

**Kènè** (du bambara *kènè* = santé, bien-être — mot compris de l'Afrique de l'Ouest) est la **première plateforme beauté & bien-être panafricaine** qui unifie en un seul produit :

1. Le **diagnostic de peau par IA** entraînée sur peaux mélanodermes (Fitzpatrick IV-VI)
2. La **mise en relation cliente ↔ entreprise** (instituts, spas, dermo-conseillères, esthéticiennes)
3. La **gestion complète de l'entreprise** (RDV, caisse, stock, employés, paie, comptabilité, marketing) conforme aux lois de **chaque pays africain**
4. La **boutique cosmétique** avec ingrédients botaniques africains

## 1.2 Tagline
**« La beauté mélanoderme, de A à Z. »**

## 1.3 Promesse
> Une cliente scanne sa peau, reçoit un diagnostic adapté à sa carnation, réserve un soin chez l'institut partenaire le plus proche à Dakar, Abidjan, Douala ou Lagos, achète les produits recommandés, paie par Wave ou Orange Money — et l'institut gère tout le reste (caisse, stock, paie conforme au pays, compta SYSCOHADA ou locale) dans la même plateforme.

## 1.4 Principes directeurs (panafricains dès la conception)

| # | Principe | Implication |
|---|---|---|
| 1 | **Panafricain by design** | Architecture multi-pays, multi-devises, multi-langues, multi-régimes fiscaux/sociaux dès le jour 1 |
| 2 | **Mélanoderme by design** | IA entraînée et validée sur peaux Fitzpatrick IV-VI |
| 3 | **Mobile Money first** | Wave, Orange Money, MTN MoMo, Moov, Airtel, M-Pesa = moyens de paiement par défaut |
| 4 | **Conformité out-of-the-box** | Paie + compta + fiscalité + data protection par pays, prêts à l'emploi |
| 5 | **Offline-first** | Fonctionne par connectivité intermittente |
| 6 | **Léger & rapide** | Optimisé smartphones d'entrée de gamme (Android Go) |
| 7 | **Design panafricain** | Symboles Adinkra réinterprétés, palette Kente+Bogolan, typo Ojuju |
| 8 | **Sécurité banque** | Chiffrement bout-en-bout, 2FA, audit trail |
| 9 | **Un produit, pas 5** | Remplace agenda + caisse + CRM + paie + compta |
| 10 | **Évolutif multi-pays** | CI d'abord, puis UEMOA, puis CEMAC, puis anglophones |

## 1.5 Différenciateurs vs marché global

| Critère | Kènè | Concurrents mondiaux |
|---|---|---|
| IA entraînée peaux mélanodermes | ✅ | ❌ tous |
| Mobile Money panafricain natif | ✅ (Wave, Orange, MTN, Moov, Airtel, M-Pesa) | ❌ |
| Paie + fiscalité par pays africain | ✅ (CNPS CI, IPM Mali, CNPS Cameroun, PENCOM Nigeria…) | ❌ |
| Comptabilité SYSCOHADA + alternatives | ✅ (17 pays OHADA + Nigeria, Kenya, GH) | ❌ |
| Métier beauté/spa/dermo | ✅ | partiel (Planity/Fresha) |
| Met client ↔ entreprise en relation | ✅ panafricain | ❌ / partiel |
| Boutique cosmétique africains intégrée | ✅ | ❌ |
| Prix en devise locale (XOF, XAF, NGN, KES, GHS, ZAR) | ✅ | ❌ ($/€) |
| Mobile-first offline | ✅ | partiel |
| Multi-pays Afrique | ✅ | ❌ |

---

# 2. PÉRIMÈTRE GÉOGRAPHIQUE & ROLLOUT MULTI-PAYS

## 2.1 Phasage géographique

### Phase 1 — Marché primaire (UEMOA francophone, XOF)
| Pays | Capitale | Devise | MoMo dominant | Régime social | Comptabilité |
|---|---|---|---|---|---|
| 🇨🇮 Côte d'Ivoire | Yamoussoukro | XOF | Orange, MTN, Moov, Wave | CNPS | SYSCOHADA |
| 🇸🇳 Sénégal | Dakar | XOF | Wave, Orange, Free | IPM | SYSCOHADA |
| 🇲🇱 Mali | Bamako | XOF | Orange, Moov, Wave | INPS | SYSCOHADA |
| 🇧🇫 Burkina Faso | Ouagadougou | XOF | Orange, Moov, Wave | CNSS | SYSCOHADA |
| 🇧🇯 Bénin | Porto-Novo | XOF | MTN, Moov, Orange | CNSS | SYSCOHADA |
| 🇹🇬 Togo | Lomé | XOF | Moov, Orange | CNSS | SYSCOHADA |

### Phase 2 — CEMAC (XAF)
| Pays | Capitale | Devise | MoMo | Régime social | Comptabilité |
|---|---|---|---|---|---|
| 🇨🇲 Cameroun | Yaoundé | XAF | MTN, Orange | CNPS | SYSCOHADA |
| 🇬🇦 Gabon | Libreville | XAF | Airtel, Moov | CNSS | SYSCOHADA |
| 🇨🇩 Congo | Brazzaville | XAF | Airtel, MTN | CNSS | SYSCOHADA |
| 🇹🇩 Tchad | N'Djamena | XAF | Airtel | CNSS | SYSCOHADA |
| 🇬🇶 Guinée-Éq. | Malabo | XAF | Orange | INPS | SYSCOHADA |
| 🇨🇫 Centrafrique | Bangui | XAF | Orange, Telecel | CNSS | SYSCOHADA |

### Phase 3 — Afrique de l'Ouest anglophone & autres
| Pays | Capitale | Devise | MoMo | Régime social | Comptabilité |
|---|---|---|---|---|---|
| 🇳🇬 Nigeria | Abuja | NGN | OPay, MTN, Airtel, Paga | PENCOM, NSITF | IFRS / SAS |
| 🇬🇭 Ghana | Accra | GHS | MTN, AirtelTigo, Vodafone | SSNIT | IFRS |
| 🇬🇳 Guinée | Conakry | GNF | Orange, MTN | CNSS | SYSCOHADA (associé) |
| 🇱🇷 Libéria | Monrovia | LRD | Lonestar, MTN | NASSCORP | IFRS |

### Phase 4 — Afrique de l'Est & Australe
| Pays | Capitale | Devise | MoMo | Régime social | Comptabilité |
|---|---|---|---|---|---|
| 🇰🇪 Kenya | Nairobi | KES | M-Pesa, Airtel | NSSF, NHIF | IFRS |
| 🇺🇬 Ouganda | Kampala | UGX | MTN, Airtel | NSSF | IFRS |
| 🇹🇿 Tanzanie | Dodoma | TZS | Vodacom M-Pesa, Airtel | NSSF | IFRS |
| 🇷🇼 Rwanda | Kigali | RWF | MTN, Airtel | RSSB | IFRS |
| 🇿🇦 Afrique du Sud | Pretoria | ZAR | SnapScan, Zapper | UIF, SARS | IFRS |

## 2.2 Architecture multi-pays (principes)

- **1 codebase, N configurations pays** (module par pays activable)
- Chaque pays = un **configurateur** contenant :
  - Devise & format
  - Opérateurs Mobile Money supportés + APIs
  - Barème fiscal (TVA, IGR/IRPP, retenues, patente, IBS)
  - Barème cotisations sociales (taux employeur/salarié, plafonds)
  - Plan comptable (SYSCOHADA ou IFRS local)
  - Langues officielles + langues locales
  - Autorité de protection des données
  - Jours fériés & calendrier administratif
- **Tenant multi-pays** : une entreprise peut opérer dans plusieurs pays (chaîne panafricaine)

---

# 3. MARCHÉ CIBLE & OPPORTUNITÉ

## 3.1 Taille du marché beauté Afrique

| Indicateur | Valeur (sources enquêtées) |
|---|---|
| Marché cosmétiques Afrique 2026 (estimé) | **4,42 milliards $** |
| Projection 2034 | **7,51 milliards $** |
| Croissance | double de la moyenne mondiale |
| Afrique subsaharienne | 3% du marché global beauté → en forte croissance |
| Top marchés | Afrique du Sud ($4,5B), Nigeria ($477M+), Kenya ($320M+) |

## 3.2 Mobile Money Afrique (GSMA 2025)
- Le mobile money a **propulsé la croissance économique** dans plusieurs pays africains
- ~70% d'inclusion financière digitale en Afrique subsaharienne
- **M-Pesa, MTN MoMo, Orange Money, Wave, Airtel, OPay** = acteurs dominants
- Transactions transfrontalières en expansion (interoperabilité)

## 3.3 Dermatologie peaux mélanodermes (sources PubMed/PMC/AAFP)

### Conditions fréquentes/spécifiques peaux noires (à couvrir par l'IA)
| Condition | Spécificité |
|---|---|
| **Hyperpigmentation post-inflammatoire (PIH)** | 3ᵉ problème le plus fréquent peaux noires |
| **Mélasma** | fréquent, souvent mal évalué par IA occidentale |
| **Pseudofolliculite de barbe (PFB)** | quasi-spécifique poils crépus |
| **Acné keloidalis nuchae** | nuque, peaux noires |
| **Kéloïdes & cicatrices hypertrophiques** | fréquentes peau mélanoderme |
| **Dermatosis papulosa nigra** | petits nævi faciaux |
| **Acanthosis nigricans** | plis, souvent associé insulinorésistance |
| **Dermite séborrhéique** | fréquente |
| **Pityriasis versicolor** | fréquent |
| **Vitiligo** | plus visible sur peau noire |
| **Acral lentiginous melanoma** | le melanoma le plus fréquent peau noire (paumes, plantes, ongles) — **orientation dermato critique** |

### Insight clé de l'enquête
Les modèles IA occidentaux sont **entraînés sur peaux caucasiennes**, ce qui produit des **diagnostics biaisés** sur peaux mélanodermes. C'est le **gap stratégique** que Kènè comble.

---

# 4. ARCHITECTURE PRODUIT (3 FACES)

| Face | Plateforme | Utilisateurs |
|---|---|---|
| 📱 **App Cliente** | iOS + Android + Web PWA | Clientes/clients |
| 💻 **App Pro** | Web (tablette/desktop) + mobile compagnon | Gérantes, esthéticiennes, dermo-conseillères, comptables, RH |
| 🛡️ **Console Kènè** | Web super-admin | Équipe Kènè (multi-entreprises, marketplace, modération, IA) |

### Personas types (panafricains)
- **Mariam, 28 ans, Abidjan** : cliente citadine, veut comprendre sa peau, réserver, payer en Mobile Money
- **Ndeye, 35 ans, Dakar** : gérante d'institut, veut un outil tout-en-un, paie IPM Sénégal
- **Aïssata, 30 ans, Bamako** : dermo-conseillère, veut assistant IA + fiches clients
- **Amina, 40 ans, Lagos** : entrepreneuse anglophone, veut paie PENCOM Nigeria + NGN
- **Chen, 38 ans, Douala** : comptable, veut liasse SYSCOHADA + déclaration CNPS Cameroun
- **Super-admin Kènè** : orchestre marketplace panafricaine

---

# 5. APP CLIENTE — Spécifications fonctionnelles

## 5.1 Onboarding & profil
- Inscription **téléphone + OTP SMS** (pas d'email obligatoire — adaptation Afrique)
- Sélection pays / ville
- Profil peau : type, carnation (échelle Fitzpatrick I-VI), sensibilités, allergies, traitements en cours
- Photo de profil + **consentement données santé** (conforme loi data protection du pays)
- Langue : français Phase 1, + anglais/locales Phase 2-3

## 5.2 Diagnostic IA de peau (cœur du client)
### Capture
- **Scan selfie multi-zones** : visage (front, joues, zone T, menton), dos, mains, cuir chevelu, zones spécifiques
- **Assistance capture temps réel** : alignement, luminosité, distance
- **Mode hors-ligne** : scan offline, synchro différée

### Indicateurs (focus mélanoderme panafricain)
| Catégorie | Indicateurs |
|---|---|
| **Pigmentation** | PIH, mélasma, taches solaires, vitiligo, hypo-pigmentation |
| **Acné & folliculites** | Acné (comédonienne, papuleuse, kystique), pseudofolliculite barbe, acné keloidalis nuchae |
| **Cicatrices & reliefs** | Kéloïdes, cicatrices hypertrophiques, dermatosis papulosa nigra |
| **Texture & pores** | Texture, pores dilatés, ridules, élasticité, séborrhée, desquamation |
| **Inflammation** | Rougeurs (visibles malgré mélanine), dermite séborrhéique, eczéma |
| **Spécifiques** | Acanthosis nigricans, pityriasis versicolor |
| **Orientation dermato** | Nævi cartographiés (règle ABCDE), suspicion mélanome acral |

### Sortie
- **Score de peau 0-100** + sous-scores par dimension
- **Heatmap** des zones détectées (explicabilité)
- **Suivi temporel** : galerie avant/après, courbe d'évolution
- **Recommandations** : routine + produits disponibles chez institut partenaire + conseils lifestyle
- **Orientation dermato** si lésion suspecte (pas de diagnostic médical → conformité)

## 5.3 Recherche & réservation
- Géolocalisation instituts partenaires (carte + liste)
- Filtres : type de soin, prix, dispo, notes, spécialité (dermo, spa, massage, ongles, cheveux, barbe)
- Agenda temps réel, réservation instantanée
- **Acompte / total** en Mobile Money à la réservation
- Rappels SMS / WhatsApp / push
- Reprogrammation / annulation (politique claire par institut)

## 5.4 Téléconsultation dermo-conseil
- Chat + appel vidéo avec la dermo-conseillère
- Partage du dernier diagnostic IA
- Prescription de soins & produits

## 5.5 Boutique cosmétique
- Catalogue produits (vendus par institut partenaire + marketplace Kènè)
- **Recommandations personnalisées post-diagnostic**
- Panier, liste de souhaits, abonnements (livraison mensuelle routine)
- Paiement Mobile Money + wallet Kènè
- Suivi commande, livraison ou retrait en institut
- Mise en avant **botaniques africains** (karité, baobab, moringa, kinkeliba, savon noir, bissap, aloe, nigelle)

## 5.6 Fidélité & communauté
- Programme fidélité (points, paliers, récompenses)
- **Wallet Kènè** : cashback, parrainage, cagnottes
- Carte de fidélité numérique (QR)
- Avis & notes (soins, produits, instituts)
- Partage de progression peau (opt-in)

## 5.7 Messagerie & notifications
- Chat direct avec l'institut
- Notifications RDV, promotions personnalisées, rappels routine
- Support multi-canal (push, SMS, WhatsApp)

## 5.8 Espace personnel
- Historique soins, factures, diagnostics, ordonnances de soins
- Carnet de routine (matin/soir)
- Rappels produits (à racheter)
- Gestion consentement & droit à l'oubli (conformité data protection)

---

# 6. APP PRO / ERP BEAUTÉ — Spécifications fonctionnelles

## 6.1 Tableau de bord
- KPIs temps réel : CA jour, RDV jour, taux d'occupation, no-shows, top soins, stock critique
- Graphiques évolution, alertes
- Vue multi-sites (chaîne)

## 6.2 Agenda & RDV
- Vue multi-praticiennes, multi-salles, multi-zones
- Soins à durées variables, enchaînements, ressources (cabine, appareil)
- Réservation online (synchronisée app cliente)
- File d'attente, overlaps, sur-réservation
- Rappels automatiques SMS/WhatsApp (réduction no-shows)
- Gestion dépôts/acomptes

## 6.3 Caisse / POS
- Encaissement **Mobile Money natif multi-pays** (Orange, MTN, Moov, Wave, Airtel, M-Pesa, OPay…) + espèces + carte + chèque + wallet Kènè
- **Réconciliation automatique** Mobile Money ↔ caisse (via APIs opérateurs + matching)
- Ventes produits + prestations + forfaits + cartes cadeaux
- Remises, offres, codes promo
- Impression ticket thermique Bluetooth
- Brouillard de caisse, clôture journalière, z de caisse
- Multi-caisses, multi-sites
- **Devise du pays** automatique

## 6.4 CRM clients
- Fiche client enrichie : historique diagnostics IA, photos avant/après, soins, achats, préférences, allergies
- Segmentation (carnation, type de peau, fréquence, panier moyen)
- Scoring client (RFM)
- Notes privées praticienne
- Consentement data protection, droit à l'oubli

## 6.5 Catalogue soins & tarifs
- Bibliothèque de soins (durée, prix, ressources, commissions)
- Tarification dynamique (heures creuses, promotions)
- Forfaits, abonnements, packs

## 6.6 Stock & produits cosmétiques
- Gestion articles (SKU, lot, DLC, fournisseur, prix achat/vente)
- Inventaire, alertes seuil, ruptures
- Mouvements (achats, ventes, pertes, transferts inter-sites)
- Recommandations réapprovisionnement
- Traçabilité lots (cosmétique réglementé)
- Valorisation stock (CUMP, FIFO)

## 6.7 Employés & RH
- Contrats (CDI, CDD, essai), avenants
- Fiches employés (documents, RIB Mobile Money)
- **Pointage** (mobile/biométrie) — présences, retards, absences
- Congés & permissions (Code du travail du pays)
- Primes, indemnités (transport, logement, fonction, ancienneté) — **paramétrables par pays**
- Avances & prêts salariés
- ATS (autorisation de travail salariés étrangers)

## 6.8 Paie conforme par pays (panafricaine)
### Architecture
- **Moteur de paie paramétrable** : règles par pays, par statut, par convention collective
- Barèmes versionnés (mise à jour annuelle réglementaire)

### Couverture Phase 1 (UEMOA)
| Pays | Régime social | Barème IGR | Cotisations |
|---|---|---|---|
| 🇨🇮 CI | CNPS (e-CNPS) | IGR ivoirien | Pension (employeur 7,7% / salarié 6,3%), prestations, AT/MP |
| 🇸🇳 SN | IPM | IR Sénégal | IPM : vieillesse, prestations |
| 🇲🇱 ML | INPS | IRC Mali | INPS : 5,4% (3,4% vieillesse + 2% invalidité/décès) |
| 🇧🇫 BF | CNSS | IUTS Burkina | CNSS Burkina |
| 🇧🇯 BJ | CNSS | IR Bénin | CNSS Bénin |
| 🇹🇬 TG | CNSS | IR Togo | CNSS Togo |

### Couverture Phase 2 (CEMAC)
| Pays | Régime social | Comptabilité |
|---|---|---|
| 🇨🇲 Cameroun | CNPS Cameroun | SYSCOHADA |
| 🇬🇦 Gabon | CNSS Gabon | SYSCOHADA |
| 🇨🇩 Congo | CNSS Congo | SYSCOHADA |

### Couverture Phase 3 (anglophones)
| Pays | Régime social | Comptabilité |
|---|---|---|
| 🇳🇬 Nigeria | PENCOM (pension) + NSITF | IFRS / SAS |
| 🇬🇭 Ghana | SSNIT | IFRS |
| 🇰🇪 Kenya | NSSF + NHIF | IFRS |

### Fonctionnalités paie
- **Bulletin de paie PDF** conforme au pays
- **Congés payés** (taux par pays : 8% en CI par ex.)
- **Préavis, licenciement, indemnités de départ**
- Calcul net à payer
- **Export déclaration sociale** (format attendu par organisme)
- Génération éléments pour administration fiscale
- Archivage légal

## 6.9 Comptabilité multi-référentiels
### Plans comptables supportés
- **SYSCOHADA** (17 pays OHADA — UEMOA + CEMAC + Comores) — Phase 1-2
- **IFRS** (Nigeria, Ghana, Kenya, Afrique du Sud) — Phase 3-4

### Fonctionnalités
- Plan comptable pré-chargé par pays
- Journaux : ventes, achats, banque, caisse, OD
- Saisie automatique depuis caisse + achats
- Grand livre, balance, journal centralisateur
- **Bilan, compte de résultat, annexe** (états financiers annuels)
- **TVA par pays** (18% CI, 18% SN, taux variables CEMAC)
- **Retenues à la source** (spécifiques par pays)
- **Patente, IBS/IRVM, minimum de perception** (OHADA)
- **Liasse fiscale** annuelle exportable
- Rapprochement bancaire
- Trésorerie prévisionnelle

## 6.10 Achats & fournisseurs
- Bons de commande, réception, factures fournisseurs
- Échéancier, paiements Mobile Money/virement
- Comparaison prix fournisseurs

## 6.11 Marketing & fidélité
- Campagnes **SMS / WhatsApp** segmentées
- Emailings, push notifications
- Promotions, codes promo, ventes flash
- Programme fidélité paramétrable
- Cartes cadeaux
- Parrainage

## 6.12 Reporting & KPIs
- CA par jour/semaine/mois/site/praticienne
- Taux d'occupation, no-show, panier moyen
- Top soins, top produits
- Rentabilité par prestation
- Stock turnover
- Export PDF, Excel

## 6.13 Multi-sites & rôles
- Gestion multi-branches (chaîne panafricaine)
- Rôles & permissions fins : gérant, comptable, RH, praticienne, caissier, magasinier
- Audit trail complet

## 6.14 Marketplace Kènè
- Visibilité de l'institut sur la marketplace grand public
- Gestion des avis, réputation
- Commission Kènè sur RDV marketplace

---

# 7. CONSOLE ADMIN KÈNÈ (Super-admin)

## 7.1 Gestion multi-entreprises
- Onboarding entreprises (KYB), abonnements, facturation
- Configuration pays / devise / régime
- Support, tickets

## 7.2 Marketplace panafricaine
- Modération avis & contenu
- Mise en avant instituts
- Commission plateforme

## 7.3 Supervision IA
- Monitoring modèle (drift, qualité, biais)
- Pipeline ré-entraînement
- Validation dataset
- Comité scientifique africain

## 7.4 Conformité & sécurité
- Journaux d'audit centralisés
- Gestion consentements données santé
- Déclarations autorités data protection par pays
- Gestion partenaires Mobile Money & taux

## 7.5 Métriques plateforme
- KPIs par pays, par institut, par cliente
- Croissance, churn, rétention
- Volume transactions Mobile Money

---

# 8. MOTEUR IA DIAGNOSTIC PEAU MÉLANODERME

## 8.1 Dataset & éthique
- Dataset constitué en **partenariat avec dermatologues africains** (Abidjan, Dakar, Bamako, Douala, Lagos, Nairobi)
- Concentration **peaux Fitzpatrick IV-VI** (sous-représentées mondialement)
- **Diversité panafricaine** : peuples d'Afrique de l'Ouest, Centrale, Est, Australe
- Validation clinique par **comité scientifique africain**
- Anonymisation + consentement éclairé + droit de retrait

## 8.2 Couverture clinique (sources PubMed/AAFP)
| Catégorie | Détail |
|---|---|
| Pigmentation | PIH, mélasma, taches, vitiligo |
| Acné & folliculites | Acné, PFB, acné keloidalis nuchae |
| Cicatrices | Kéloïdes, hypertrophiques, dermatosis papulosa nigra |
| Inflammation | Dermites, eczéma |
| Spécifiques | Acanthosis nigricans, pityriasis versicolor |
| Orientation dermato | Nævi (ABCDE), mélanome acral (paumes/plantes/ongles) |

## 8.3 Architecture technique IA
- Modèle vision (PyTorch) entraîné + fine-tuning continu
- Inférence **cloud** (qualité) + **edge léger** (offline)
- **Explicabilité** : heatmap zones détectées (transparence)
- **Pas de diagnostic médical** : orientation dermato si suspicion

## 8.4 Biais & équité
- Tests d'équité par sous-groupe (carnation, âge, genre, pays)
- Surveillance continue des faux positifs/négatifs par carnation
- Documentation publique des performances & limites

---

# 9. PAIEMENTS & MOBILE MONEY PANAFRICAINS

## 9.1 Opérateurs supportés (par pays)

### UEMOA (XOF) — BCEAO régulé
| Opérateur | Pays | API |
|---|---|---|
| 🟠 Orange Money | CI, SN, ML, BF, BJ, TG | API marchand |
| 🟡 MTN MoMo | CI, BJ | API marchand |
| 🔵 Moov Money | CI, ML, BF, BJ, TG | API marchand |
| 🟣 Wave | CI, SN, ML, BF | API marchand |
| 🟢 Free Money | SN | API marchand |

### CEMAC (XAF) — BEAC régulé
| Opérateur | Pays | API |
|---|---|---|
| 🟡 MTN MoMo | Cameroun, Congo | API marchand |
| 🟠 Orange Money | Cameroun, CI | API marchand |
| 🔵 Airtel Money | Gabon, Tchad, Congo | API marchand |

### Afrique de l'Ouest anglophone
| Opérateur | Pays | API |
|---|---|---|
| 🟡 MTN MoMo | Ghana, Nigeria | API marchand |
| 🟠 Airtel Money | Ghana, Nigeria | API marchand |
| 🔵 OPay | Nigeria | API marchand |
| 🟠 Paga | Nigeria | API marchand |
| 🟢 Vodafone Cash | Ghana | API marchand |

### Afrique de l'Est & Australe
| Opérateur | Pays | API |
|---|---|---|
| 🟢 M-Pesa | Kenya, Tanzanie | API marchand (Daraja) |
| 🟡 MTN MoMo | Ouganda, Rwanda | API marchand |
| 🟠 Airtel Money | Ouganda, Tanzanie, Rwanda | API marchand |

## 9.2 Fonctionnalités paiement
- **Acompte, total, échelonné, abonnement**
- **Réconciliation automatique** (matching transaction MoMo ↔ vente caisse)
- **Reçus & factures normés** (TVA/fiscalité du pays)
- **Wallet Kènè** interne (cashback, parrainage, cagnottes)
- Cartes Visa/Mastercard via acquéreur local
- Espèces, chèque (saisie manuelle)
- Sécurité : 2FA, journalisation, anti-fraude, détection anomalies

## 9.3 Interopérabilité
- Support **transferts transfrontaliers** UEMOA (BCEAO)
- Conversion de devises (XOF ↔ XAF = 1:1 fixe ; XOF → NGN/GHS/KES/ZAR variable)
- Wallet Kènè multi-devises

---

# 10. CONFORMITÉ RÉGLEMENTAIRE MULTI-PAYS

## 10.1 Protection des données (par pays)

### Cadre continental
- **Convention de Malabo** (Union africaine, 2014) — cadre continental

### Par pays (sources Baker McKenzie, gdprlocal)
| Pays | Loi | Autorité |
|---|---|---|
| 🇨🇮 CI | Loi n°2013-450 | IPDCP |
| 🇸🇳 SN | Loi 2008-12 | PDP |
| 🇲🇱 ML | Loi n°2016-059 | APDP |
| 🇧🇫 BF | Loi 010-2004 | INPDC |
| 🇧🇯 BJ | Loi 2009-09 | APDP |
| 🇨🇲 Cameroun | Loi 2010/012 | ANPD |
| 🇳🇬 Nigeria | NDPA 2023 (ex-NDPR) | NDP Commission |
| 🇬🇭 Ghana | Data Protection Act 2012 | DPC |
| 🇰🇪 Kenya | Data Protection Act 2019 | ODPC |
| 🇿🇦 Afrique du Sud | POPIA | Information Regulator |
| 🇷🇼 Rwanda | Loi n°058/2021 | NCSA |

### Principes applicables (toutes lois confondues)
- Consentement explicite (surtout données santé)
- Droit d'accès, rectification, oubli
- Notification de breach (72h-1 mois selon pays)
- Minimisation des données
- Chiffrement fort au repos & en transit
- Hébergement : priorité cloud régional Afrique
- Registre des traitements
- DPO désigné

## 10.2 Fiscalité par pays
| Pays | TVA | Impôt société | Retenue source | Patente |
|---|---|---|---|---|
| 🇨🇮 CI | 18% | IBS 25% | variable | oui |
| 🇸🇳 SN | 18% | IS 30% | variable | oui |
| 🇲🇱 ML | 18% | IS 30% | variable | oui |
| 🇧🇫 BF | 18% | IS 27,5% | variable | oui |
| 🇨🇲 Cameroun | 19,25% | IS 30%+ | variable | oui |
| 🇳🇬 Nigeria | 7,5% | CIT 30% | variable | non |
| 🇬🇭 Ghana | 15% (std) | CIT 25% | variable | non |
| 🇰🇪 Kenya | 16% | CIT 30% | variable | non |

## 10.3 Réglementation cosmétiques
- ICVC (Commission ivoirienne) en CI
- NAFDAC au Nigeria
- FDA au Ghana
- KEBS au Kenya
- Traçabilité produits, étiquetage conformes

## 10.4 Sécurité & audit
- Chiffrement bout-en-bout (TLS 1.3)
- Chiffrement au repos (AES-256)
- 2FA obligatoire (app pro + wallet)
- Audit trail complet (toute action tracée)
- Tests de pénétration annuels
- Conformité PCI-DSS pour paiements carte
- Sauvegardes chiffrées géo-redondantes

---

# 11. IDENTITÉ VISUELLE & DESIGN SYSTEM PANAFRICAIN

## 11.1 Principe directeur (issu de l'enquête design)
> Le design africain moderne le plus abouti **ne copie pas** les motifs traditionnels : il les **réinterprète de façon abstraite et minimaliste**. Les meilleures marques (Wave, Flutterwave, Asaya, African Botanics) associent minimalisme + ancrage culturel abstrait.

**Règle Kènè** : pas de folklore décoratif. Symboles culturels **simplifiés à l'extrême**, intégrés à un système graphique épuré.

## 11.2 Symboles culturels panafricains

### Adinkra (Akan — Ghana + Côte d'Ivoire +扩散 ouest-africaine)
| Symbole | Signification | Module Kènè |
|---|---|---|
| 🪮 Duafe | Beauté, féminité, hygiène | Beauté / Soins ⭐ |
| 🐦 Sankofa | Retour aux sources | Suivi temporel peau |
| 📚 Nea Onnim | Savoir | Module IA Diagnostic |
| 🌙 Osram Ne Nsoromma | Lien, complémentarité | Relation client ↔ entreprise |
| 🦷 Ese Ne Tekrema | Interdépendance | Fidélité |
| 🏠 Fihankra | Sécurité | Données, conformité |
| 🏰 Aban | Force | Module ERP |
| 🌿 Aya | Résilience | Peau mélanoderme |
| ☮️ Bi Nka Bi | Paix | Communauté, avis |

### Symboles par région (panafricain)
| Région | Symbole | Usage |
|---|---|---|
| Afrique de l'Ouest | Adinkra (Akan) | Système icônes principal |
| Mali | Bogolan (motifs terre) | Textures, filigrane |
| Nigeria | Uli (Igbo), Adire (Yoruba) | Illustrations |
| Cameroun | Bamileke patterns | Ornementations |
| Afrique de l'Est | Kanga (Tanzanie), Kente est-africain | Patterns alternatifs |
| Afrique du Sud | Ndebele geometry | Touches géométriques |

## 11.3 Palette couleur (panafricaine)

| Rôle | Nom | Hex | Inspiration |
|---|---|---|---|
| Primaire | **Or Kènè** | `#C8951E` | Soleil africain |
| Secondaire | **Terre de Bogolan** | `#A0522D` | Terre cuite |
| Mélanine | **Noir profond** | `#1A1410` | Texte, élégance |
| Croissance | **Vert Baobab** | `#3F7D3F` | Botaniques |
| Confiance | **Bleu Indigo** | `#1B3A6B` | Finance, données |
| Pureté | **Crème Karité** | `#F8F1E4` | Fonds |
| Accent | **Bordeaux Bissap** | `#8B1A3B` | Alerte |
| Vibrance | **Orange Sunset** | `#E07A2B` | CTA |

> **Note** : pas d'indigo saturé en gros blocs (rappel colonial). En touches uniquement.

## 11.4 Typographie
| Usage | Police | Origine | Statut |
|---|---|---|---|
| Logo / Titres | **Ojuju** | Ụdị Foundry (Nigérian-American) | Google Fonts (gratuit, 2024) ⭐ |
| Texte UI / Corps | **Questrial** | Google Design | Google Fonts (gratuit) |
| Chiffres financiers | IBM Plex Mono | — | Gratuit |
| Alternative premium | Gida Type / Elms Sans | Fonderies africaines | Commercial |

### Support linguistique prévu
- Français Phase 1 (UEMOA)
- Anglais Phase 3 (Nigeria, Ghana, Kenya…)
- Langues locales : Nouchi, Wolof, Bambara, Dioula, Swahili, Yoruba, Igbo, Hausa, Lingala (Phase 4+)
- Ojuju & Questrial supportent les diacritiques africaines

## 11.5 Patterns & textures
| Source | Usage Kènè |
|---|---|
| Kente (Akan) | Bandes fines arrière-plan, séparateurs, loading |
| Bogolan (Mali) | Pattern micro-dotted en filigrane |
| Ankara / Wax | Motifs uniques en illustration (jamais en fond) |
| Scarifications Akan/Baoulé | Trait fin ornemental avatars |
| Uli / Adire (Nigeria) | Illustrations alternatives |
| Ndebele (Afrique du Sud) | Touches géométriques |

> **Règle** : patterns couvrent **max 5-10%** de l'écran.

## 11.6 Système d'icônes
Set **linear / 2px stroke** dérivé des Adinkra :

| Fonction | Icône |
|---|---|
| RDV | Sankofa simplifié |
| Caisse / POS | Aban (forteresse) |
| Beauté / Soin | Duafe (peigne) |
| IA Diagnostic | Nea Onnim |
| Relation client | Osram Ne Nsoromma |
| Stock | Motif Kente géométrisé |
| Paie | Fihankra |
| Comptabilité | Motif tissé |
| Botaniques | Silhouettes karité/baobab/moringa |

> **Pas d'emoji** dans l'app. Icônes cohérentes culturellement.

## 11.7 Photographie & illustration
- **Peaux mélanodermes majoritaires** (90%+)
- Lumière naturelle dorée
- Plans macro de peau (texture, éclat)
- Instituts réels africains (Abidjan, Dakar, Lagos, Douala, Nairobi…)
- Diversité d'âge, genre, carnation, pays
- Style illustration **plat + texture terre cuite**
- Figures stylisées inspirées masques africains
- Pas d'illustrations « Disney » occidentales

## 11.8 Logo — 4 pistes (à valider)
1. **Duafe + Goutte** : peigne Duafe stylisé en goutte/feuille, une seule ligne
2. **Sankofa + Cœur** : oiseau Sankofa réduit en courbe cœur/spirale
3. **Aya + Pore** : fougère Aya stylisée en empreinte de peau
4. **Hexagone + Point** : géométrie pure (rappel masque Baoulé) + point doré

## 11.9 UX/UI — principes (Wave, Orange Money, Flutterwave)
- **Mobile-first absolu**
- Onboarding téléphone + OTP
- Boutons larges, contrastés (smartphones entrée de gamme, luminosité forte)
- Iconographie explicite + texte (literacy variable)
- Bottom navigation + FAB
- États offline gérés explicitement
- Micro-interactions discrètes (data)
- **Dark mode** (économie batterie)

---

# 12. ARCHITECTURE TECHNIQUE

## 12.1 Stack

| Couche | Technologie |
|---|---|
| Mobile client | React Native (Expo) — iOS + Android + Web PWA |
| App Pro web | Next.js 16 + TypeScript |
| Console admin | Next.js 16 |
| Backend | API REST + WebSocket, microservices, Node/TypeScript |
| Base de données | PostgreSQL multi-tenant (row-level security) |
| IA vision | PyTorch, inférence cloud + edge |
| Files/Cache | Redis |
| Stockage médias | Object storage (S3-compatible) |
| Temps réel | Socket.io |
| Infra | Conteneurs Docker, cloud régional Afrique |
| Offline | Sync différée mobile |

## 12.2 Architecture multi-tenant
- 1 tenant = 1 entreprise
- Isolation données par tenant (RLS PostgreSQL)
- Tenant peut opérer multi-pays, multi-sites
- Configurateur pays activable par tenant

## 12.3 Services backend (microservices)
| Service | Rôle |
|---|---|
| Auth | OTP, 2FA, JWT |
| Identity & Tenants | Entreprises, utilisateurs, rôles |
| Client App API | App cliente (catalogue, RDV, boutique) |
| Pro App API | App pro (agenda, caisse, stock, RH) |
| Payments | Mobile Money adapters, wallet, réconciliation |
| Payroll Engine | Moteur paie multi-pays |
| Accounting Engine | SYSCOHADA / IFRS, journaux, liasse |
| AI Diagnostic | Inférence + suivi temporel |
| CRM | Fiches clients, segmentation |
| Marketplace | Listing, avis, matching |
| Notifications | SMS, WhatsApp, push, email |
| Media | Stockage photos, anonymisation |
| Audit | Journal centralisé |
| Config | Barèmes par pays, fiscalité |

## 12.4 Hébergement & souveraineté
- **Cloud régional Afrique de l'Ouest** prioritaire (données santé)
- Géo-redondance
- Sauvegardes chiffrées
- Conformité data protection par pays

## 12.5 Performance & offline
- API cache (Redis)
- Sync mobile différée (offline-first)
- Compression images (diagnostic peau)
- Edge inference (modèle IA léger offline)

---

# 13. ROADMAP & PHASAGE

## Phase 1 — Cœur UEMOA (mois 1-6)
### Périmètre
- Pays : 🇨🇮 CI + 🇸🇳 SN (lancement), puis 🇲🇱 ML, 🇧🇫 BF
- Devise : XOF
- MoMo : Orange, MTN, Moov, Wave

### Livrables
- App Cliente : onboarding OTP, diagnostic IA (10 indicateurs), RDV, boutique, paiement MoMo
- App Pro : agenda, caisse MoMo, CRM, catalogue soins, stock
- Console : onboarding entreprise
- Paie : CNPS CI + IPM SN
- Compta : SYSCOHADA

## Phase 2 — Consolidation UEMOA + CEMAC (mois 7-12)
- 🇧🇯 BJ, 🇹🇬 TG, 🇨🇲 Cameroun, 🇬🇦 Gabon
- Stock complet, marketing SMS/WhatsApp, fidélité, wallet
- Multi-sites, rôles fins
- IA étendue (25+ indicateurs)
- Téléconsultation dermo

## Phase 3 — Afrique anglophone (mois 13-20)
- 🇳🇬 Nigeria, 🇬🇭 Ghana
- Anglais UI
- MoMo : OPay, MTN, Airtel, Paga, Vodafone
- Paie : PENCOM/SSNIT
- Compta : IFRS / SAS

## Phase 4 — Afrique de l'Est & Australe (mois 21-30)
- 🇰🇪 Kenya, 🇺🇬 Ouganda, 🇹🇿 Tanzanie, 🇷🇼 Rwanda, 🇿🇦 Afrique du Sud
- M-Pesa integration (Daraja API)
- Langues locales (Swahili, etc.)
- IA dataset étendu (peaux est-africaines, australes)

## Phase 5 — Échelle & enrichissement (continu)
- Marketplace cosmétiques panafricaine
- IA : nouvelles indications, suivi pathologies chroniques
- Partenariats télémédecine
- API ouverte (intégrations tierces)
- Langues locales étendues

---

# 14. MODÈLE ÉCONOMIQUE

## 14.1 SaaS Pro (abonnement mensuel en devise locale)
| Palier | Cible | Prix indicatif (XOF) | Inclus |
|---|---|---|---|
| **Essentiel** | TPE / solo | 15 000 / mois | Agenda, caisse, CRM, catalogue, 1 site, 2 utilisateurs |
| **Pro** | Institut | 35 000 / mois | + Stock, marketing, fidélité, paie, compta, 2 sites, 10 utilisateurs |
| **Chaîne** | Multi-sites | 75 000 / mois | + Multi-pays, rôles avancés, API, support prioritaire, illimité |

> Prix ajustés par pays (parité pouvoir d'achat)

## 14.2 Commissions
- **Commission marketplace** sur RDV apportés par Kènè (8-12%)
- **Commission transaction** Mobile Money (part avec opérateur, ~0,5-1%)
- **Commission marketplace cosmétique** sur ventes produits (10-15%)

## 14.3 Premium client (B2C)
- Diagnostic avancé illimité : 2 000 XOF / mois
- Derma-conseil illimité : 10 000 XOF / mois

## 14.4 Publicité & partenaires
- Mise en avant produits cosmétiques (CPC/CPM)
- Partenariats marques beauté africaines

## 14.5 Services additionnels
- Formation instituts
- Certification dermo-conseillères Kènè
- API entreprise (intégration ERP tiers)

---

# 15. MÉTRIQUES & KPIs

## 15.1 Acquisition & croissance
- Nombre de entreprises actives par pays
- Nombre de clientes par pays
- Croissance mensuelle (MoM)
- CAC par pays

## 15.2 Engagement
- DAU/MAU client
- Diagnostics IA / mois
- RDV réservés / mois
- Panier moyen
- Taux de rétention client (D30, D90)

## 15.3 Monétisation
- MRR par pays
- ARPU entreprise
- Volume transactions Mobile Money
- Commission marketplace
- Churn entreprise

## 15.4 IA & qualité
- Précision modèle par carnation
- Faux positifs / négatifs
- Taux d'orientation dermato
- Satisfaction diagnostic (NPS)

## 15.5 Opérationnel
- Taux no-show (réduction)
- Taux d'occupation instituts
- Uptime plateforme
- Temps de réponse API

---

# 16. RISQUES & MITIGATION

| Risque | Impact | Mitigation |
|---|---|---|
| **Biais IA peaux mélanodermes** | Élevé | Dataset diversifié panafricain, comité scientifique, surveillance continue par sous-groupe |
| **Non-conformité réglementaire** | Élevé | Veille juridique par pays, barèmes versionnés, audits annuels |
| **Dépendance APIs Mobile Money** | Moyen | Multi-opérateur, fallback, mode offline caisse |
| **Sécurité données santé** | Élevé | Chiffrement fort, hébergement régional, audit, 2FA |
| **Adoption faible** | Moyen | Freemium client, onboarding entreprise accompagné, formation |
| **Connectivité intermittente** | Moyen | Offline-first, sync différée, compression |
| **Concurrence (Planity/Fresha/Odoo)** | Moyen | Différenciation mélanoderme + MoMo + conformité multi-pays |
| **Pouvoir d'achat** | Moyen | Tarifs adaptés par pays, freemium, paiement à l'usage |
| **Change de devises** | Faible | Wallet multi-devises, XOF/XAF fixe |
| **Cyberattaque** | Élevé | WAF, tests de pénétration, SOC, plan de réponse à incident |

---

# 17. GLOSSAIRE

| Terme | Définition |
|---|---|
| **Adinkra** | Symboles Akan (Ghana/CI) exprimant concepts/proverbes |
| **Bogolan** | Tissu teint à la boue (Mali), motifs terre |
| **Kente** | Tissage géométrique Akan |
| **OHADA** | Organisation pour l'Harmonisation en Afrique du Droit des Affaires (17 pays) |
| **SYSCOHADA** | Système Comptable OHADA |
| **UEMOA** | Union Économique et Monétaire Ouest-Africaine (8 pays, XOF) |
| **CEMAC** | Communauté Économique et Monétaire de l'Afrique Centrale (6 pays, XAF) |
| **CNPS** | Caisse Nationale de Prévoyance Sociale (CI, Cameroun) |
| **IPM** | Institution de Prévoyance Maladie (Sénégal) |
| **INPS** | Institut National de Prévoyance Sociale (Mali) |
| **CNSS** | Caisse Nationale de Sécurité Sociale (BF, BJ, TG, Gabon, Congo) |
| **PENCOM** | Pension Commission (Nigeria) |
| **SSNIT** | Social Security & National Insurance Trust (Ghana) |
| **NSSF** | National Social Security Fund (Kenya, Ouganda) |
| **IGR** | Impôt Général sur le Revenu (CI) |
| **IBS** | Impôt sur les Bénéfices Sociétés (OHADA) |
| **IRVM** | Impôt sur le Revenu des Valeurs Mobilières |
| **Patente** | Impôt sur le chiffre d'affaires (OHADA) |
| **NDPA** | Nigeria Data Protection Act 2023 |
| **POPIA** | Protection of Personal Information Act (Afrique du Sud) |
| **IPDCP** | Commission Informatique et Libertés (CI) |
| **PIH** | Post-Inflammatory Hyperpigmentation |
| **PFB** | Pseudofolliculitis Barbae |
| **Fitzpatrick IV-VI** | Échelle de carnation, peaux mélanodermes |

---

# 18. ANNEXES — SOURCES DES ENQUÊTES

## 18.1 Recherches menées (fichiers JSON dans /research)
1. `skin_diagnosis_fr.json` — apps diagnostic peau FR
2. `skin_diagnosis_en.json` — apps diagnostic peau EN
3. `spa_management_fr.json` — logiciels spa/salon FR
4. `spa_management_en.json` — logiciels spa/salon EN
5. `business_all_in_one_fr.json` — ERP tout-en-un FR
6. `business_all_in_one_en.json` — ERP tout-en-un EN
7. `skin_apps_detail.json` — détail apps peau (Skinive, Neutrogena…)
8. `spa_apps_detail.json` — détail apps spa (Planity, Fresha, Mangomint…)
9. `erp_detail.json` — Odoo vs ERPNext
10. `ci_mobile_money.json` — Mobile Money CI
11. `ci_paie_regl.json` — réglementation paie CI (CNPS, IGR)
12. `ci_local_software.json` — logiciels locaux CI
13. `ci_digital.json` — adoption digitale CI
14. `design_african_ui.json` — UI fintech Afrique (Wave, Orange Money…)
15. `design_adinkra.json` — symboles Adinkra
16. `design_colors.json` — palettes Kente/Bogolan/Ankara
17. `design_beauty.json` — branding beauté mélanoderme (Asaya…)
18. `design_typography.json` — typos africaines (Ojuju, Gida Type…)
19. `design_patterns.json` — patterns africains modernes
20. `design_ci_symbols.json` — symboles culturels CI
21. `design_botanicals.json` — botaniques africaines (karité, baobab…)
22. `design_logos.json` — logos africains modernes
23. `panafrican_mobile_money.json` — MoMo panafricain (GSMA, BCEAO)
24. `panafrican_ohada.json` — OHADA 17 pays
25. `panafrican_payroll.json` — régimes sociaux Afrique de l'Ouest
26. `panafrican_data.json` — lois data protection Afrique (NDPA, POPIA…)
27. `panafrican_beauty_market.json` — marché beauté Afrique (4,4 Md$)
28. `panafrican_dermatology.json` — dermatologie peaux noires (PubMed, AAFP)

## 18.2 Documents de synthèse
- `app_design_proposal.md` — proposition initiale (CI)
- `design_investigation.md` — enquête design africain
- **`conception_documentation.md`** — ce document (consolidation panafricaine)

---

## ✅ DÉCISIONS À VALIDER AVANT CONSTRUCTION

1. **Nom définitif** : Kènè ? (alternatives : Ndamé, Sira, Éburny, Mwasi)
2. **Direction logo** : piste 1 (Duafe+Goutte), 2 (Sankofa+Cœur), 3 (Aya+Pore) ou 4 (Hexagone+Point) ?
3. **Palette dominante** : or+bogolan ? ou or+indigo ? ou bissap+or ?
4. **Typo titres** : Ojuju confirmée ?
5. **Pays de lancement Phase 1** : CI + SN simultanés ? CI seul d'abord ?
6. **Priorité opérateurs MoMo Phase 1** : Wave + Orange d'abord ?
7. **Sources dataset peau mélanoderme** : partenaires dermato à engager
8. **Hébergement** : cloud régional précis (AWS Cape Town? Azure? local?)
9. **Mascotte** : aucune (panafricain) ?
10. **Photographie** : shooting réel multi-pays ? stock mélanoderme premium ?
11. **Niveau d'ancrage culturel** : subtil (Wave-like) ou affirmé (Flutterwave-like) ?
12. **Périmètre MVP exact Phase 1** (modules prioritaires)

---

*Fin du document de conception. En attente de validation finale avant passage en construction.*
