# Partie 3 — Spécifications Écran par Écran

> Wireframes textuels + états + règles de validation
> Périmètre : MVP Phase 1A (🔴) + 1B (🟡)

---

## CONVENTIONS DE DESIGN

### Layout global
- **Mobile-first** : largeur cible 375-414px (Android moyen)
- **Safe areas** iOS (notch, home indicator)
- **Bottom navigation** : 4-5 onglets max + FAB central si pertinent
- **Header sticky** : titre + action contextuelle (retour, menu)
- **Padding** : 16px horizontal, 24px entre sections
- **Touch target** : min 44×44px
- **Footer sticky** : sur pages avec action principale (payer, réserver)

### États standards (tous écrans avec données)
1. **Chargement** : skeleton (gris animé) reprenant la structure
2. **Vide** : illustration + texte + CTA (ex : « Aucun RDV pour l'instant »)
3. **Erreur** : message clair + bouton « Réessayer »
4. **Succès** : toast/snackbar validation
5. **Hors-ligne** : bannière « Hors-ligne — sync en attente »

### Couleurs (rappel palette)
- Primaire Or : `#C8951E` (CTA principaux)
- Secondaire Bogolan : `#A0522D`
- Mélanine (texte) : `#1A1410`
- Vert Baobab : `#3F7D3F` (succès)
- Bordeaux Bissap : `#8B1A3B` (alerte/erreur)
- Crème Karité : `#F8F1E4` (fond)
- Bleu Indigo : `#1B3A6B` (info/finance)

### Typographie
- Titres : Ojuju
- Corps : Questrial
- Chiffres : IBM Plex Mono

---

# SECTION A — APP CLIENTE

## A. Écrans d'onboarding

### A1. Splash screen 🔴
**Description :** Logo Kènè (Duafe+Goutte or sur fond crème) animé 2s, puis redirection.

**Éléments :**
- Logo centré (120×120px)
- Tagline en dessous : « La beauté mélanoderme, de A à Z. »
- Animation : logo se dessine en une ligne (Lottie)
- Fond : Crème Karité dégradé subtil

**États :** Pas d'erreur (si pas de connexion, passe quand même à l'écran suivant)

### A2. Choix langue / pays 🔴
**Description :** Sélection langue + pays (par géoloc ou manuel).

**Éléments :**
- Titre : « Bienvenue »
- Bouton « Détecter ma position » (icône Nea Onnim simplifiée)
- Liste pays (CI, SN Phase 1)
- Sélection langue (français — autres grisées « Bientôt »)
- Bouton « Continuer » (Or)

### A3. Inscription / Connexion OTP 🔴
**Description :** Saisie téléphone + OTP.

**Étape 1 - Téléphone :**
- Titre : « Votre numéro »
- Input téléphone (avec indicatif pays auto)
- Bouton « Envoyer le code » (Or, disabled si invalide)
- Lien « J'ai déjà un compte » → étape 2 directe
- Texte légal court + lien CGU

**Étape 2 - OTP :**
- Titre : « Code de confirmation »
- « Code envoyé au +225 07 00 00 00 00 »
- 6 inputs OTP (auto-focus suivant)
- Compteur « Renvoyer dans 0:42 » puis « Renvoyer le code »
- Bouton « Valider » (Or)
- Lien « Modifier le numéro »

**Règles validation :**
- Téléphone : format E.164 valide pour CI/SN
- OTP : 6 chiffres
- 3 essais max → blocage 15 min

### A4. Profil peau initial 🔴
**Description :** Configuration carnet peau.

**Éléments (sur 1 écran scrollable) :**
- Titre : « Parlons de votre peau »
- Carnation Fitzpatrick : 6 swatches visuels (I-VI) sélection unique
- Type de peau : 5 cartes (Grasse, Sèche, Mixte, Normale, Sensible)
- Tranche d'âge : 4 boutons (18-24, 25-34, 35-44, 45+)
- Genre : Femme / Homme / Autre
- Allergies (optionnel) : champ libre + chips suggestions (parfum, alcool, etc.)
- Bouton « Continuer »

### A5. Consentement données santé 🔴
**Description :** Écran obligatoire avant diagnostic.

**Éléments :**
- Titre : « Vos données, vos droits »
- Icône Fihankra (sécurité)
- Texte clair (cf. exigences IPDCP/Loi 2008-12)
- Cases à cocher :
  - ✅ Consentement diagnostic IA (obligatoire)
  - ☐ Consentement partage avec institut partenaire (optionnel)
  - ☐ Consentement marketing (optionnel)
- Saisie nom (signature électronique)
- Bouton « J'accepte » (disabled si case obligatoire non cochée)

---

## B. App cliente — Navigation principale

### B1. Home / Accueil 🔴
**Description :** Point d'entrée principal après connexion.

**Layout :**
- Header : logo Kènè + icône wallet (solde) + icône notifications
- Carte hero : « Diagnostiquez votre peau » → CTA principal (Or, plein)
- Section « Instituts près de vous » : 3 cartes horizontales scrollables (photo, nom, distance, note)
- Section « Soins populaires » : grille 2 colonnes
- Section « Continuer votre routine » : produits recommandés
- Bottom navigation : Accueil | Diagnostic | Instituts | Boutique | Profil

**États :**
- Vide (nouvelle utilisatrice) : bannière « Commencez par un diagnostic »
- Hors-ligne : bannière jaune

### B2. Bottom Navigation 🔴
5 onglets :
1. **Accueil** (icône maison)
2. **Diagnostic** (icône Nea Onnim — savoir)
3. **Instituts** (icône Osram Ne Nsoromma — lien)
4. **Boutique** (icône panier)
5. **Profil** (icône avatar)

---

## C. Flow Diagnostic IA

### C1. Écran de lancement diagnostic 🔴
**Description :** Préparation au scan.

**Éléments :**
- Titre : « Diagnostic de peau »
- Illustration : visage mélanoderme avec zones de scan
- Checklist pré-scan :
  - ✅ « Trouvez un endroit bien éclairé »
  - ✅ « Retirez maquillage et lunettes »
  - ✅ « Regardez droit l'appareil »
- Bouton « Commencer » (Or, plein)
- Lien « Astuces pour une bonne photo »

### C2. Écran capture caméra 🔴
**Description :** Interface caméra avec assistance.

**Layout :**
- Caméra plein écran
- Cercle de guidage visage (overlay)
- Indicateur luminosité (haut) : trop sombre / bon / trop clair
- Indicateur distance : trop près / bon / trop loin
- Bouton capture (bas, rond Or)
- Bouton switch caméra (avant/arrière)
- Texte : « Cadrez votre visage dans le cercle »

**Flow multi-zones :**
1. Visage entier (capture auto si bon)
2. « Zoom sur le front » (5 sec)
3. « Zoom sur la joue gauche »
4. « Zoom sur la joue droite »
5. « Zoom sur le menton »
- Progress bar en haut (1/5, 2/5…)

**États :**
- Trop sombre : message « Plus de lumière svp »
- Flou : message « Tenez l'appareil plus stable »
- Visage non détecté : « Placez votre visage dans le cercle »

### C3. Écran traitement 🔴
**Description :** Inférence en cours.

**Éléments :**
- Animation : logo Duafe pulsé
- Texte : « Analyse en cours… »
- Sous-texte : « Cela prend moins de 30 secondes »
- Progress bar indéterminée

### C4. Écran résultats diagnostic 🔴
**Description :** Affichage du score + indicateurs.

**Layout (scrollable) :**
- Score global en haut : jauge circulaire 0-100 (animation comptage)
- Interprétation : « Votre peau va bien / à surveiller / besoins identifiés »
- Heatmap : selfie avec overlay coloré (toggle on/off)
- Liste indicateurs (cartes) :
  - Chaque carte : icône + nom + sévérité (1-3 pastilles couleur) + flèche « Détails »
- Section « Recommandations » :
  - Routine matin/soir (cards étapes)
  - Produits conseillés (carousel horizontal)
  - Soins en institut conseillés (carousel)
- Bouton sticky « Réserver un soin » (Or)
- Bouton « Voir détail » sur chaque indicateur → C5
- Alerte dermato (si applicable) → encart bordeaux en haut

### C5. Écran détail indicateur 🔴
**Description :** Détail d'un problème détecté.

**Éléments :**
- Titre indicateur (ex : « Hyperpigmentation post-inflammatoire »)
- Photo zone concernée (avec heatmap)
- Sévérité : pastilles + texte
- Description : qu'est-ce que c'est
- Causes possibles
- Recommandations spécifiques
- Produits conseillés (bouton « Ajouter au panier »)
- Soins conseillés (bouton « Réserver »)
- Lien « En savoir plus » (article)

### C6. Écran orientation dermato 🔴 (conditionnel)
**Description :** S'affiche si l'IA détecte une lésion suspecte.

**Éléments :**
- Encart alerte bordeaux
- Icône avertissement
- Texte : « Kènè recommande une consultation dermatologique »
- Mention : « Ceci n'est pas un diagnostic médical »
- Liste dermatologues partenaires (par géoloc)
- Bouton « Prendre RDV »
- Bouton « J'ai déjà un dermatologue »

### C7. Écran historique diagnostics 🔴
**Description :** Liste chronologique.

**Layout :**
- Liste cartes : date + score global + miniature photo
- Tri : plus récent / meilleur score
- Bouton « Comparer » (sélection 2 diagnostics) → C8
- Filtre par période

### C8. Écran comparaison avant/après 🟡
**Description :** Comparaison 2 diagnostics.

**Layout :**
- 2 photos côte à côte (slider swipe)
- 2 scores côte à côte
- Delta : « +12 points en 3 mois » (vert si positif)
- Liste soins reçus entre les 2 dates
- Bouton « Partager » (opt-in)

---

## D. Flow Recherche & Réservation

### D1. Écran recherche instituts 🔴
**Description :** Liste + carte.

**Layout :**
- Header : barre de recherche + filtres
- Toggle Carte / Liste
- Carte (haut 50%) avec pins colorés par spécialité
- Liste (bas 50%) : cartes instituts
  - Photo + nom + spécialités + distance + note + prix indicatif
- Filtres (bottom sheet) :
  - Rayon (slider 1-50 km)
  - Spécialité (chips multi-sélection)
  - Notes min (1-5)
  - Prix (slider)
  - Disponibilité aujourd'hui (toggle)
- Tri (dropdown) : distance / note / prix / dispo

### D2. Écran fiche institut 🔴
**Description :** Détail établissement.

**Layout (scrollable) :**
- Carrousel photos (haut)
- Nom + spécialités (chips) + note + nb avis
- Adresse + bouton « Itinéraire »
- Bouton « Prendre RDV » (Or, sticky)
- Onglets : Présentation | Soins | Avis | Équipe
  - **Présentation** : description, horaires, équipements
  - **Soins** : liste avec prix, durée, bouton « Réserver »
  - **Avis** : note moyenne + liste avis + filtres
  - **Équipe** : cartes praticiennes (photo, nom, spécialités, note)

### D3. Écran sélection créneau 🔴
**Description :** Choix date + horaire.

**Layout :**
- Header : récap soin (nom + durée + prix)
- Calendrier (mois courant + suivant)
- Créneaux disponibles (grille horaire)
  - Par praticienne (onglets) ou « Première disponible »
  - Créneaux libres : Or cliquable
  - Occupés : grisés
- Bouton « Continuer » (Or)

### D4. Écran confirmation & paiement 🔴
**Description :** Récap + acompte.

**Layout :**
- Récap RDV : institut, soin, date, praticienne, prix
- Choix paiement :
  - Carte radio : Acompte 30% / Total / Sans acompte
  - Montants affichés
- Moyen paiement (cartes) :
  - 🟣 Wave / 🟠 Orange Money / 👛 Wallet Kènè (solde affiché)
- Bouton « Payer et réserver » (Or)
- Politique annulation (lien)
- Case « J'accepte les CGU »

**Flow paiement :**
1. Bouton cliqué → loading
2. Redirection MoMo (deep link Wave ou USSD Orange)
3. Cliente valide dans app opérateur
4. Callback → confirmation D5

### D5. Écran confirmation RDV 🔴
**Description :** Succès réservation.

**Éléments :**
- Icône succès (vert Baobab)
- « RDV confirmé ! »
- Détails RDV
- Boutons :
  - « Ajouter au calendrier »
  - « Voir mes RDV »
  - « Recevoir un SMS de rappel » (déjà activé)
- Code QR RDV (pour check-in institut)

### D6. Écran mes RDV 🔴
**Description :** Liste RDV cliente.

**Onglets :** À venir | Passés | Annulés
- Cartes RDV : institut, soin, date, statut, actions
- Actions : Reprogrammer / Annuler (si > 24h) / Voir détails

### D7. Écran reprogrammer 🔴
**Description :** Modifier un RDV.

- Sélection nouvelle date/heure
- Affiche politique (gratuit si > 24h)
- Confirmation

---

## E. Flow Boutique

### E1. Écran boutique accueil 🔴
**Layout :**
- Barre recherche
- Carrousel catégories (icônes botaniques : karité, baobab, moringa…)
- Section « Recommandé pour vous » (post-diagnostic)
- Section « Nouveautés »
- Section « Best-sellers »
- Grille produits (2 colonnes)

### E2. Écran catalogue produits 🔴
- Filtres (type peau, carnation, problème, botanique, prix)
- Tri
- Grille produits

### E3. Écran fiche produit 🔴
**Layout :**
- Carrousel photos
- Nom + prix + note
- Description
- Ingrédients INCI
- Bienfaits
- Mode d'emploi
- Avis clients
- « Produits complémentaires »
- Bouton sticky « Ajouter au panier » (Or)

### E4. Écran panier 🔴
**Layout :**
- Liste articles (quantité modifiable, supprimer)
- Sous-total + frais livraison (si applicable)
- Choix livraison / retrait institut
- Code promo (champ)
- Total
- Bouton « Commander » (Or)

### E5. Écran checkout 🔴
- Adresse livraison (ou institut retrait)
- Créneau livraison (si applicable)
- Moyen paiement (MoMo / wallet)
- Récap total
- Bouton « Payer »

### E6. Écran confirmation commande 🔴
- Succès + numéro commande
- Suivi commande (statut)
- Bouton « Continuer mes achats »

### E7. Écran mes commandes 🔴
- Liste avec statut (confirmée, expédiée, livrée)
- Détail au clic

---

## F. Profil & Wallet

### F1. Écran profil 🔴
**Layout :**
- Avatar + nom + téléphone
- Solde wallet (carte Or) → F2
- Menu :
  - Mes données peau (profil + carnet)
  - Mes RDV
  - Mes commandes
  - Mes diagnostics
  - Wallet & paiements
  - Programme fidélité 🟡
  - Parrainage 🟡
  - Mes avis 🟡
  - Notifications
  - Langue
  - Aide & support
  - CGU / Confidentialité
  - Se déconnecter

### F2. Écran wallet 🔴
- Solde (grand, Or)
- Boutons : Approvisionner / Historique
- Transactions récentes (liste)
- Cashback accumulé

### F3. Écran approvisionner wallet 🔴
- Montant (presets : 5k, 10k, 25k, 50k, custom)
- Moyen MoMo
- Confirmation

### F4. Écran « Mes données » (RGPD) 🔴
- Profil peau (modifiable)
- Consentements (révocables)
- Bouton « Exporter mes données » (JSON)
- Bouton « Supprimer mon compte » (avec confirmation double)

---

# SECTION B — APP PRO (ENTREPRISE)

## G. Onboarding entreprise

### G1. Écran landing Pro 🔴
- Hero : « Gérez votre institut de A à Z »
- Bénéfices clés (4 cartes)
- Bouton « Créer mon compte »
- Lien « J'ai déjà un compte »

### G2. Inscription entreprise 🔴
**Étapes (wizard 5 pages) :**
1. Téléphone + OTP
2. Infos entreprise (raison sociale, type, adresse, pays, ville)
3. Documents KYB (upload RCCM + pièce ID)
4. Choix abonnement (Essentiel / Pro / Chaîne) + comparatif
5. Paiement premier mois (MoMo)

### G3. Écran validation en attente 🔴
- « Votre compte est en cours de validation »
- Délai 24-48h
- Contact support

### G4. Setup initial 🔴
**Après validation, wizard de configuration :**
1. Créer praticiennes (noms, rôles)
2. Créer cabines/ressources
3. Créer catalogue soins (ou importer template par défaut)
4. Créer catalogue produits
5. Configurer horaires d'ouverture
6. Tester caisse (paiement test)

---

## H. App Pro — Navigation principale

### H1. Dashboard 🔴
**Layout :**
- Header : nom institut + sélecteur site (si multi) + notifications
- KPIs cards (4) :
  - CA du jour
  - RDV du jour
  - Taux d'occupation
  - No-shows
- Graphique CA 7 jours
- Liste « RDV du jour » (praticiennes en colonnes)
- Section « Alertes » (stock critique, écarts caisse)
- Raccourcis : Agenda, Caisse, Clients, Stock

### H2. Sidebar / Navigation Pro 🔴
**Left sidebar (desktop) / bottom nav (mobile) :**
- Dashboard
- Agenda
- Caisse
- Clients
- Catalogue (soins & produits)
- Stock
- Employés 🟡
- Paie 🟡
- Comptabilité 🟡
- Marketing 🟡
- Rapports
- Paramètres

---

## I. Module Agenda

### I1. Vue agenda 🔴
**Layout :**
- Header : sélecteur site + vue (Jour/Semaine/Mois) + date
- Filtres : praticiennes (chips), ressources
- Grille : colonnes = praticiennes, lignes = horaires
- Blocs RDV colorés par type de soin
- Drag & drop pour déplacer
- Clic bloc → détail / modifier
- Clic vide → créer RDV
- Bouton « Nouveau RDV » (FAB Or)

### I2. Modal création RDV 🔴
- Recherche cliente (autocomplète) ou « nouvelle cliente »
- Sélection soin
- Date + heure
- Praticienne + ressource
- Acompte (optionnel)
- Notes
- Boutons « Enregistrer » / « Enregistrer + payer acompte »

### I3. Modal détail RDV 🔴
- Infos complètes
- Actions : Modifier, Reprogrammer, Annuler, Check-in, Terminer, Encaisser

### I4. File d'attente 🔴
- Liste clientes en attente
- Bouton « Notifier » quand créneau libéré

---

## J. Module Caisse / POS

### J1. Écran caisse 🔴
**Layout (tablette) :**
- Gauche : grille produits + prestations (catégories onglets)
- Droite : ticket en cours (articles, quantités, remise, total)
- Boutons moyens paiement (Wave, Orange, Espèces, Carte, Chèque, Wallet)
- Bouton « Encaisser » (Or)

### J2. Modal paiement 🔴
- Montant total affiché
- Sélection moyen (cartes)
- Si MoMo : saisie numéro cliente → push → attente confirmation
- Si espèces : saisie montant reçu → calcul rendu
- Bouton « Valider »

### J3. Écran confirmation vente 🔴
- « Vente enregistrée »
- Détails
- Boutons : Imprimer ticket / Envoyer reçu / Nouvelle vente

### J4. Brouillard de caisse 🔴
- Liste transactions du jour
- Filtres (moyen, caissier, montant)
- Totaux par moyen
- Bouton « Clôturer la caisse »

### J5. Écran clôture Z 🔴
- Récapitulatif du jour
- Comptage espèces
- Écarts
- Validation 2FA
- Export PDF

### J6. Réconciliation MoMo 🔴
- Tableau transactions MoMo vs ventes
- Statuts (confirmé, en attente, litige)
- Matching auto
- Action manuelle (résoudre litige)

---

## K. Module CRM Clients

### K1. Liste clients 🔴
- Recherche + filtres (segment, RFM, carnation)
- Tableau : nom, téléphone, dernière visite, CA total, score RFM
- Tri
- Export segment

### K2. Fiche client 🔴
**Layout (scrollable, onglets) :**
- Header : photo, nom, téléphone, score RFM badge
- Onglets : Profil | Diagnostics | Soins | Achats | Notes
  - **Profil** : coordonnées, profil peau, allergies, consentements
  - **Diagnostics** : historique IA + photos avant/après
  - **Soins** : historique RDV
  - **Achats** : historique ventes produits
  - **Notes** : notes privées praticienne (+ ajout)
- Boutons : Nouveau RDV / Envoyer message / Voir factures

### K3. Modal création client rapide 🔴
- Téléphone + nom + prénom
- Bouton « Créer »

---

## L. Module Catalogue

### L1. Catalogue soins 🔴
- Liste soins (nom, durée, prix, actif)
- Bouton « Nouveau soin »
- Filtres par catégorie

### L2. Formule création/édition soin 🔴
- Nom, description, catégorie
- Durée, prix, TVA
- Ressources requises
- Commission praticienne
- Image

### L3. Catalogue produits 🔴
- Liste (SKU, nom, stock, prix, seuil)
- Bouton « Nouveau produit »

### L4. Formule produit 🔴
- SKU, nom, description, photos
- Catégorie, botanique
- Prix achat/vente, TVA
- Fournisseur
- Seuil alerte
- Lot (DLC, numéro)

---

## M. Module Stock

### M1. Vue stock 🔴
- Tableau produits + quantité par site
- Badge alerte si sous seuil
- Filtres (catégorie, alerte, site)
- Bouton « Inventaire » / « Mouvement »

### M2. Modal mouvement stock 🔴
- Type (entrée, sortie, perte, transfert)
- Produit + quantité
- Lot (si applicable)
- Motif
- Validation

### M3. Écran inventaire 🔴
- Liste produits à compter
- Quantité théorique vs comptée
- Écart auto
- Validation gérant

### M4. Alertes seuil 🔴
- Liste produits sous seuil
- Bouton « Commander » (crée bon de commande)

### M5. Achats fournisseurs 🟡
- Liste bons de commande
- Réception (quantité, lot, DLC)
- Facture fournisseur
- Rapprochement

---

## N. Module Employés & RH (MVP 1B)

### N1. Liste employés 🟡
- Tableau (nom, poste, site, statut, salaire)
- Bouton « Nouvel employé »

### N2. Fiche employé 🟡
**Onglets :** Profil | Contrats | Pointage | Congés | Paie | Documents
- **Profil** : identité, contact, adresse
- **Contrats** : historique contrats + avenants
- **Pointage** : historique présences + heures sup
- **Congés** : solde + demandes
- **Paie** : bulletins historique
- **Documents** : CNI, contrat, diplômes, RIB

### N3. Création contrat 🟡
- Template (CDI/CDD/essai)
- Champs : poste, salaire, début, fin (si CDD)
- Génération PDF

### N4. Pointage 🟡
- Bouton « Pointer entrée/sortie »
- Geofencing institut
- Historique

### N5. Demandes congés 🟡
- Liste demandes en attente
- Validation/refus

---

## O. Module Paie (MVP 1B)

### O1. Écran paie 🟡
- Sélecteur période (mois/année)
- Liste employés + statut (à payer / payé)
- Bouton « Générer la paie »

### O2. Génération paie 🟡
- Sélection employés
- Aperçu calcul (brut, cotisations, IGR, net)
- Validation
- Génération bulletins PDF

### O3. Bulletin de paie 🟡
- PDF prévisualisé
- Détails : brut, primes, cotisations CNPS/IPM, IGR, net
- Bouton « Envoyer à l'employé »

### O4. Déclarations 🟡
- Onglets : CNPS CI | IPM SN | IGR
- Export format attendu (CSV/XML)
- Échéancier rappels
- Archivage

---

## P. Module Comptabilité (MVP 1B)

### P1. Tableau de bord compta 🟡
- Exercice en cours
- Bilan rapide (CA, charges, résultat)
- Prochaines échéances (TVA, CNPS, IBS)
- Actions rapides

### P2. Journaux 🟡
- Onglets : Ventes | Achats | Banque | Caisse | OD
- Liste écritures par journal
- Bouton « Nouvelle écriture » (OD)

### P3. Saisie écriture manuelle 🟡
- Date, journal, référence
- Lignes (compte, libellé, débit, crédit)
- Vérification équilibre
- Validation

### P4. Grand livre 🟡
- Filtres (compte, période)
- Liste écritures par compte

### P5. Balance 🟡
- Balance générale (6 colonnes)
- Balance âgée
- Export

### P6. TVA 🟡
- TVA collectée / déductible / à payer
- Bouton « Générer déclaration »

### P7. États financiers 🟡
- Bilan
- Compte de résultat
- Annexe
- Tableau flux trésorerie
- Export PDF

### P8. Rapprochement bancaire 🟡
- Import relevé (CSV/PDF)
- Matching auto
- Écritures manquantes
- Validation

### P9. Liasse fiscale 🟡
- Génération ensemble états
- Export Excel + PDF

---

## Q. Module Marketing (MVP 1B)

### Q1. Campagnes 🟡
- Liste campagnes
- Bouton « Nouvelle campagne »
- Sélection segment
- Template message
- Programmation
- Coût estimé
- Statistiques

### Q2. Codes promo 🟡
- Liste + création
- Configuration (% ou montant, validité, usage)

### Q3. Cartes cadeaux 🟡
- Liste + création
- Suivi soldes

### Q4. Programme fidélité 🟡
- Configuration points/paliers/récompenses
- Statistiques adhérents

---

## R. Module Rapports

### R1. Rapports 🔴
- Onglets : CA | Praticiennes | Clients | Stock | Compta
- Sélecteurs période
- Graphiques
- Export

---

## S. Paramètres

### S1. Paramètres généraux 🔴
- Informations entreprise
- Devise, TVA
- Pays, langue
- Sites (multi-sites)

### S2. Rôles & permissions 🟡
- Liste utilisateurs + rôles
- Invitation
- Matrice permissions

### S3. Integrations 🔴
- Opérateurs MoMo (clés API)
- SMS/WhatsApp provider
- Email
- Compta export

### S4. Audit trail 🟡
- Journal actions
- Filtres

---

# SECTION C — CONSOLE ADMIN KÈNÈ

## T. Console admin

### T1. Dashboard plateforme 🔴
- Métriques globales (entreprises, clientes, transactions, MRR)
- Carte panafricaine (pays actifs)
- Top entreprises
- Alertes système

### T2. Gestion entreprises 🔴
- Liste + filtres (pays, statut, palier)
- File de validation KYB
- Fiche entreprise + actions (activer, suspendre, supprimer)

### T3. Abonnements 🔴
- Liste abonnements + statut paiement
- Facturation
- Relances

### T4. Marketplace 🟡
- Modération avis
- Mise en avant instituts

### T5. Supervision IA 🔴
- Volume diagnostics
- Performance modèle
- Drift
- File ré-entraînement

### T6. Partenaires MoMo 🔴
- Configuration opérateurs par pays
- Clés API
- Monitoring transactions

### T7. Conformité & audit 🔴
- Journal centralisé
- Demandes d'accès/effacement
- Export pour autorités

### T8. Support 🟡
- File tickets
- Base de connaissances

### T9. Configuration pays 🔴
- Barèmes fiscaux
- Cotisations sociales
- Plans comptables
- Opérateurs MoMo

---

## RÈGLES DE VALIDATION COMMUNES

### Formulaires
- Validation en temps réel (champ vert/rouge)
- Messages d'erreur clairs en français
- Champs obligatoires marqués (*)
- Boutons désactivés si formulaire invalide

### Montants
- Formatage devise locale (ex : « 15 000 FCFA »)
- Pas de décimales pour XOF/XAF
- Séparateurs milliers espace

### Dates
- Format : JJ/MM/AAAA
- Calendrier avec jours fériés pays
- Timezone du pays

### Téléphones
- Format E.164
- Indicatif pays auto selon pays sélectionné

---

*Fin de la Partie 3. Les maquettes visuelles (Figma) seront produites à partir de ces spécifications textuelles en phase de design.*
