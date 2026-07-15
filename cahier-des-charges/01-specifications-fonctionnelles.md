# Partie 1 — Spécifications Fonctionnelles Détaillées

> User stories + critères d'acceptation par epic fonctionnel
> Périmètre : MVP Phase 1A (🔴) + 1B (🟡) + Phase 2 (🟢)

---

## EPIC 1 — ONBOARDING & AUTHENTIFICATION

### US-001 — Inscription cliente par OTP 🔴
**En tant que** cliente, **je veux** m'inscrire avec mon numéro de téléphone et un code OTP **afin de** créer mon compte sans email.

**Critères d'acceptation :**
- Étant donné une nouvelle cliente avec un numéro CI/SN valide
- Quand elle saisit son numéro et demande un OTP
- Alors un SMS avec code à 6 chiffres est envoyé (validité 5 min, 3 essais max)
- Quand elle saisit le bon OTP
- Alors son compte est créé, elle est connectée, un profil peau vide est initialisé
- Si l'OTP est erroné 3 fois → blocage 15 min + proposition rappel support

### US-002 — Connexion cliente par OTP 🔴
**En tant que** cliente existante, **je veux** me connecter par OTP **afin d'**accéder à mon compte sans mot de passe.

**Critères :**
- OTP à chaque connexion (pas de session permanente par défaut)
- Option « garder ma session » (cochée par défaut sur appareil personnel)
- Durée de session : 30 jours si « garder », 24h sinon

### US-003 — Configuration profil peau initiale 🔴
**En tant que** cliente, **je veux** renseigner mon profil peau (carnation, allergies) **afin de** personnaliser mes diagnostics.

**Champs obligatoires :**
- Carnation : échelle Fitzpatrick (I-VI) — aide visuelle
- Type de peau : grasse / sèche / mixte / normale / sensible
- Âge (tranche)
- Genre

**Champs optionnels :**
- Allergies connues (sélection multiple + libre)
- Traitements en cours
- Produits utilisés actuellement

### US-004 — Sélection pays / ville 🔴
**En tant que** cliente, **je veux** sélectionner mon pays et ma ville **afin de** voir les instituts partenaires près de moi.

- Détection auto par géolocalisation (si autorisée)
- Sinon : sélection manuelle (pays → ville)
- Pays Phase 1 : Côte d'Ivoire (Abidjan, Bouaké, Yamoussoukro, San-Pédro), Sénégal (Dakar, Thiès, Saint-Louis)

### US-005 — Consentement données santé 🔴
**En tant que** cliente, **je veux** donner mon consentement explicite pour le traitement de mes données de santé **afin de** respecter la loi (IPDCP CI / Loi 2008-12 SN).

- Écran de consentement dédié avant tout diagnostic
- Texte clair : finalité, destinataires, durée conservation, droit d'accès/oubli
- Case à cocher obligatoire + signature (saisie nom)
- Consentement révocable à tout moment (efface diagnostics + photos)

### US-006 — Onboarding entreprise (Pro) 🔴
**En tant que** gérant d'institut, **je veux** créer le compte de mon entreprise **afin de** commencer à utiliser Kènè.

**Étapes :**
1. Saisie numéro téléphone + OTP
2. Informations entreprise : raison sociale, type (institut/spa/dermo/massage/esthétique), adresse, pays, ville
3. Documents KYB : RCCM ou certificat d'existence, pièce ID gérant
4. Choix palier abonnement (Essentiel / Pro / Chaîne)
5. Moyen de paiement abonnement (MoMo ou carte)
6. Validation par ADMIN Kènè (SLA 24-48h)

### US-007 — Configuration multi-utilisateurs Pro 🔴
**En tant que** gérant, **je veux** inviter des utilisateurs (praticiennes, caissier, comptable) avec rôles **afin de** gérer les accès.

- Invitation par téléphone/email
- Rôles : Gérant, Praticienne, Caissier, Comptable, RH, Magasinier
- Permissions par rôle (matrice RBAC)
- 2FA obligatoire pour Gérant et Comptable

### US-008 — Authentification Pro 2FA 🔴
**En tant qu'** utilisateur Pro, **je veux** me connecter avec mot de passe + 2FA **afin de** sécuriser l'accès entreprise.

- Mot de passe (min 12 caractères, complexité)
- 2FA : OTP SMS ou app authenticator (TOTP)
- Détection connexion suspecte (nouvel appareil, geo inhabituel)

---

## EPIC 2 — DIAGNOSTIC IA PEAU

### US-010 — Lancer un diagnostic IA 🔴
**En tant que** cliente, **je veux** scanner mon visage pour obtenir un diagnostic de peau **afin de** comprendre mes besoins.

**Critères :**
- Accès depuis l'onglet « Diagnostic »
- Demande autorisation caméra
- Assistance capture temps réel :
  - Cercle de guidage visage
  - Indicateur luminosité (trop sombre / trop clair)
  - Indicateur distance
  - Détecteur flou
- Capture multi-zones : visage entier + zoom zones (front, joues, menton)
- Upload vers cloud + inférence
- Durée : < 30 secondes en 4G

### US-011 — Affichage score de peau 🔴
**En tant que** cliente, **je veux** voir mon score de peau global et par dimension **afin d'**identifier mes priorités.

- Score global 0-100 (jauge circulaire)
- Sous-scores : Hydratation, Éclat, Texture, Pigmentation, Acné, Pores, Rides, Sensibilité
- Code couleur : vert (>75), orange (50-75), rouge (<50)
- Interprétation textuelle simple

### US-012 — Heatmap zones détectées 🔴
**En tant que** cliente, **je veux** voir les zones de préoccupation détectées par l'IA **afin de** visualiser mes problèmes.

- Superposition heatmap sur selfie
- Zones colorées par type (PIH, acné, pores…)
- Légende interactive
- Transparence réglable

### US-013 — Détail par indicateur 🔴
**En tant que** cliente, **je veux** cliquer sur un indicateur pour avoir son explication **afin de** comprendre.

- 10 indicateurs MVP 1A :
  1. Hyperpigmentation post-inflammatoire (PIH)
  2. Mélasma / taches
  3. Acné (comédonienne + papuleuse)
  4. Pseudofolliculite barbe
  5. Pores dilatés
  6. Texture
  7. Séborrhée
  8. Ridules
  9. Taches solaires
  10. Nævi (cartographie + ABCDE)
- Pour chaque : gravité (0-3), description, causes, recommandations

### US-014 — Recommandations routine personnalisée 🔴
**En tant que** cliente, **je veux** recevoir une routine de soins recommandée **afin d'**améliorer ma peau.

- Routine matin + soir
- Étapes : nettoyage, tonique, sérum, hydratant, SPF
- Produits recommandés (depuis catalogue institut partenaire le plus proche + marketplace)
- Bouton « Réserver un soin » pour prestation ciblée
- Bouton « Acheter les produits » (panier pré-rempli)

### US-015 — Orientation dermatologique 🔴
**En tant que** cliente, **je veux** être orientée vers un dermatologue si lésion suspecte **afin de** sécuriser ma santé.

- Si l'IA détecte : nævi à risque (ABCDE), suspicion mélanome acral, lésion non-classable
- Alerte claire : « Kènè recommande une consultation dermatologique »
- Liste de dermatologues partenaires (par géolocalisation)
- Bouton « Prendre RDV »
- Mention légale : « Ceci n'est pas un diagnostic médical »

### US-016 — Sauvegarde et historique des diagnostics 🔴
**En tant que** cliente, **je veux** retrouver tous mes diagnostics passés **afin de** suivre mon évolution.

- Liste chronologique des diagnostics
- Comparaison avant/après (côte à côte)
- Courbe d'évolution du score global
- Export PDF d'un diagnostic

### US-017 — Mode offline diagnostic 🟡
**En tant que** cliente avec connexion instable, **je veux** faire un diagnostic hors-ligne **afin de** ne pas être bloquée.

- Capture offline possible
- Mise en file d'attente
- Inférence différée dès connexion
- Notification push quand résultat prêt

### US-018 — Suivi temporel avant/après 🟡
**En tant que** cliente, **je veux** comparer mes photos et scores dans le temps **afin de** mesurer ma progression.

- Galerie photos par date
- Slider avant/après
- Annotation des soins reçus entre 2 dates
- Partage (opt-in) sur réseaux

---

## EPIC 3 — RECHERCHE & RÉSERVATION

### US-020 — Géolocalisation instituts 🔴
**En tant que** cliente, **je veux** voir les instituts partenaires autour de moi **afin de** choisir le plus proche.

- Carte interactive + liste
- Pins colorés par spécialité
- Filtres : rayon (1, 5, 10, 25 km), spécialité, notes, prix
- Tri : distance, notes, prix, disponibilité

### US-021 — Fiche institut 🔴
**En tant que** cliente, **je veux** consulter la fiche d'un institut **afin de** décider de réserver.

**Contenu fiche :**
- Photos (intérieur, extérieur, équipe)
- Description, spécialités
- Liste des soins + prix + durée
- Note moyenne + avis
- Horaires
- Localisation + itinéraire
- Bouton « Prendre RDV »

### US-022 — Créneaux disponibles 🔴
**En tant que** cliente, **je veux** voir les créneaux disponibles en temps réel **afin de** réserver instantanément.

- Sélection date (calendrier)
- Grille horaire par praticienne
- Créneaux occupés = grisés
- Créneau libre = cliquable
- Sélection praticienne (ou « première disponible »)

### US-023 — Confirmation RDV avec acompte 🔴
**En tant que** cliente, **je veux** réserver en payant un acompte Mobile Money **afin de** sécuriser mon RDV.

- Récapitulatif RDV (soin, date, praticienne, prix)
- Choix paiement : acompte (30% défaut) / total / aucun (si institut l'autorise)
- Moyen : Wave / Orange Money / wallet Kènè
- Flux paiement MoMo (push notification opérateur)
- Confirmation : RDV créé, ticket SMS/WhatsApp/push
- Ajout au calendrier téléphone

### US-024 — Rappels automatiques 🔴
**En tant que** cliente, **je veux** recevoir des rappels avant mon RDV **afin de** ne pas l'oublier.

- J-1 : SMS + WhatsApp
- H-2 : push notification
- Action « Reprogrammer » ou « Annuler » dans le message

### US-025 — Reprogrammer / Annuler RDV 🔴
**En tant que** cliente, **je veux** reprogrammer ou annuler mon RDV **afin de** gérer mon emploi du temps.

- Délai gratuit : 24h avant (remboursement acompte)
- < 24h : acompte conservé (politique configurable par institut)
- Limite : 1 reprogrammation gratuite
- Historique des annulations visible Pro

### US-026 — Avis post-RDV 🟡
**En tant que** cliente, **je veux** laisser un avis après mon soin **afin de** partager mon expérience.

- Notification H+24 post-RDV
- Note 1-5 étoiles (soin, accueil, propreté, valeur)
- Commentaire textuel
- Photos (opt-in)
- Modération avant publication

---

## EPIC 4 — PAIEMENT MOBILE MONEY

### US-030 — Paiement Wave 🔴
**En tant que** cliente, **je veux** payer par Wave **afin de** régler mon achat/RDV.

- Bouton « Payer avec Wave »
- Redirection vers API Wave (deep link app Wave ou web)
- Cliente valide dans app Wave
- Callback Kènè → transaction confirmée
- Réception auto dans caisse institut
- Reçu PDF envoyé

### US-031 — Paiement Orange Money 🔴
**En tant que** cliente, **je veux** payer par Orange Money **afin de** régler mon achat/RDV.

- Bouton « Payer avec Orange Money »
- Saisie numéro Orange Money
- Push USSD/OTP sur téléphone cliente
- Cliente valide avec code secret
- Confirmation temps réel
- Reçu PDF

### US-032 — Wallet Kènè 🔴
**En tant que** cliente, **je veux** avoir un wallet Kènè **afin de** stocker mon cashback et parrainages.

- Solde visible dans profil
- Approvisionnement par MoMo
- Utilisation pour RDV/achats
- Historique transactions
- Cashback auto (1% des achats → wallet)

### US-033 — Réconciliation caisse Pro 🔴
**En tant que** caissier, **je veux** que les paiements MoMo soient réconciliés automatiquement **afin de** éviter les écarts de caisse.

- Matching automatique transaction MoMo ↔ vente
- Statut : en attente / confirmée / échouée / litige
- Tableau de réconciliation temps réel
- Alerte écart > 0
- Export journalier

### US-034 — Remboursement 🟡
**En tant que** gérant, **je veux** rembourser une cliente **afin de** gérer les litiges.

- Remboursement partiel ou total
- Sur même moyen de paiement (MoMo → MoMo)
- Motif obligatoire
- Validation 2FA gérant
- Traçabilité audit

### US-035 — Facturation normée 🟡
**En tant que** gérant, **je veux** émettre des factures conformes **afin de** respecter la fiscalité.

- Facture avec : numéro séquentiel, RCCM, N° contribuable, TVA (18% CI / 18% SN)
- Format PDF conforme DGI
- Envoi auto à la cliente
- Archivage légal 10 ans

---

## EPIC 5 — BOUTIQUE COSMÉTIQUE

### US-040 — Catalogue produits 🔴
**En tant que** cliente, **je veux** parcourir le catalogue cosmétique **afin de** découvrir des produits.

- Catégories : nettoyants, sérums, hydratants, SPF, masques, soins cheveux, soins corps
- Filtres : type de peau, carnation, problème ciblé, botanique (karité, baobab, moringa…)
- Fiche produit : photos, description, ingrédients, prix, stock, institut vendeur
- Mise en avant produits recommandés suite diagnostic

### US-041 — Fiche produit 🔴
**En tant que** cliente, **je veux** voir le détail d'un produit **afin de** décider d'acheter.

- Photos multiples
- Description, ingrédients INCI
- Bienfaits, mode d'emploi
- Avis clients
- Produits complémentaires
- Bouton « Ajouter au panier »

### US-042 — Panier & commande 🔴
**En tant que** cliente, **je veux** gérer mon panier et commander **afin d'**acheter des produits.

- Ajout / suppression / quantité
- Livraison (zone) ou retrait en institut
- Frais de livraison calculés
- Paiement MoMo / wallet
- Confirmation + suivi commande

### US-043 — Abonnement routine 🟡
**En tant que** cliente, **je veux** m'abonner à ma routine mensuelle **afin de** ne jamais être en rupture.

- Paiement récurrent MoMo
- Composition personnalisée (post-diagnostic)
- Modification / pause / annulation
- Rappel avant prélèvement

### US-044 — Suivi commande 🔴
**En tant que** cliente, **je veux** suivre ma commande **afin de** savoir quand la recevoir.

- Statuts : confirmée, en préparation, expédiée, livrée / prête retrait
- Notification à chaque étape
- Numéro de suivi livraison

---

## EPIC 6 — AGENDA PRO

### US-050 — Vue agenda multi-praticiennes 🔴
**En tant que** gérant/praticienne, **je veux** voir l'agenda de toutes les praticiennes **afin de** gérer les RDV.

- Vue jour / semaine / mois
- Colonnes : une par praticienne
- Drag & drop RDV
- Codes couleur par type de soin
- Filtres par praticienne, par salle

### US-051 — Création RDV manuel 🔴
**En tant que** praticienne, **je veux** créer un RDV manuellement **afin de** gérer les clientes en walk-in ou téléphone.

- Sélection cliente (existante ou quick-create)
- Soin, date, durée, praticienne, salle
- Acompte (optionnel)
- Rappels auto activés

### US-052 — Gestion ressources (salles, appareils) 🔴
**En tant que** gérant, **je veux** affecter des ressources aux RDV **afin d'**éviter les conflits.

- Ressources : cabines, appareils (laser, etc.)
- Détection conflit (même ressource même horaire)
- Proposition d'alternative

### US-053 — Rappels automatiques Pro 🔴
**En tant que** gérant, **je veux** que les rappels soient envoyés auto **afin de** réduire les no-shows.

- Configuration canaux (SMS/WhatsApp/push)
- Templates personnalisables
- Statistiques no-show
- Liste des RDV du jour

### US-054 — File d'attente 🔴
**En tant que** praticienne, **je veux** gérer une file d'attente **afin de** combler les annulations.

- Liste clientes en attente (tri priorité)
- Notification auto en cas de libération de créneau

### US-055 — Gestion dépôts/acomptes 🔴
**En tant que** gérant, **je veux** configurer la politique d'acompte **afin de** sécuriser mes RDV.

- % acompte par soin (défaut 30%)
- Délai d'annulation gratuit (défaut 24h)
- Conservation acompte si no-show
- Exception par cliente (VIP)

---

## EPIC 7 — CAISSE / POS

### US-060 — Encaissement vente 🔴
**En tant que** caissier, **je veux** encaisser une vente **afin de** finaliser la transaction.

- Sélection prestation + produits
- Remise / code promo
- Choix moyen paiement : Wave, Orange Money, espèces, carte, chèque, wallet
- Calcul TVA auto
- Impression ticket (Bluetooth thermique)
- Mise à jour stock auto

### US-061 — Caisse mobile (tablette/smartphone) 🔴
**En tant que** caissier, **je veux** utiliser la caisse sur tablette **afin d'**être mobile.

- Interface tactile optimisée
- Mode offline (sync différée)
- Multi-caisses simultanées

### US-062 — Clôture de caisse 🔴
**En tant que** gérant, **je veux** clôturer la caisse quotidiennement **afin de** contrôler les recettes.

- Z de caisse : total par moyen de paiement
- Comptage espèces
- Écarts signalés
- Validation 2FA
- Export PDF / Excel

### US-063 — Brouillard de caisse 🔴
**En tant que** gérant, **je veux** consulter le brouillard de caisse **afin de** suivre les transactions.

- Liste transactions du jour
- Filtres (moyen, montant, caissier)
- Détail transaction au clic
- Recherche par numéro facture

### US-064 — Multi-caisses & multi-sites 🔴
**En tant que** gérant multi-sites, **je veux** gérer plusieurs caisses **afin de** consolider.

- Une caisse par poste
- Consolidation par site
- Rapport consolidé multi-sites

### US-065 — Cartes cadeaux & forfaits 🟡
**En tant que** gérant, **je veux** vendre des cartes cadeaux et forfaits **afin de** fidéliser.

- Création carte cadeau (montant / prestation)
- Vente + paiement
- Suivi solde carte
- Forfaits (X séances, validité)

---

## EPIC 8 — CRM CLIENTS

### US-070 — Fiche client enrichie 🔴
**En tant que** praticienne, **je veux** consulter la fiche client enrichie **afin de** personnaliser mon accueil.

**Contenu :**
- Coordonnées
- Profil peau (carnation, allergies)
- Historique diagnostics IA
- Photos avant/après
- Historique soins + achats
- Notes privées praticienne
- Préférences

### US-071 — Création client rapide 🔴
**En tant que** praticienne, **je veux** créer rapidement une cliente **afin de** ne pas perdre de temps.

- Création par téléphone (+ OTP optionnel)
- Champs minimaux (nom, téléphone)
- Complétion progressive

### US-072 — Segmentation clients 🟡
**En tant que** gérant, **je veux** segmenter mes clientes **afin de** cibler mes campagnes.

- Segments : RFM (Récence, Fréquence, Montant), carnation, type peau, fréquence
- Création segments personnalisés
- Export segment pour campagne marketing

### US-073 — Scoring RFM 🟡
**En tant que** gérant, **je veux** voir le score RFM de chaque cliente **afin d'**identifier mes VIP et inactives.

- Note 1-5 par dimension (Récence, Fréquence, Montant)
- Score global + segment auto
- Liste VIP / à réactiver / perdues

### US-074 — Consentement & droit à l'oubli 🔴
**En tant que** cliente, **je veux** exercer mes droits RGPD/IPDCP **afin de** maîtriser mes données.

- Écran « Mes données » : voir, exporter (JSON), supprimer
- Suppression = anonymisation + conservation minimale légale (factures fiscales 10 ans)
- Traitement demande < 30 jours

---

## EPIC 9 — STOCK & PRODUITS

### US-080 — Catalogue produits Pro 🔴
**En tant que** gérant, **je veux** gérer mon catalogue produits **afin de** vendre en boutique et en ligne.

- Création produit : SKU, nom, description, photos, prix achat/vente, TVA, catégorie, botanique
- Lots (DLC, numéro lot)
- Fournisseur
- Seuil d'alerte

### US-081 — Inventaire 🔴
**En tant que** magasinier, **je veux** réaliser un inventaire **afin de** vérifier le stock réel.

- Inventaire complet / partiel
- Comptage avec écarts
- Validation gérant
- Ajustement stock avec motif

### US-082 — Mouvements de stock 🔴
**En tant que** système, **je veux** tracer tous les mouvements de stock **afin d'**assurer la traçabilité.

- Types : entrée (achat), sortie (vente), perte, cassé, transfert inter-sites
- Traçabilité lot (cosmétique réglementé)
- Historique consultable

### US-083 — Alertes seuil 🔴
**En tant que** gérant, **je veux** être alerté quand un produit est en rupture **afin de** réapprovisionner.

- Notification push/email seuil atteint
- Liste produits à réappro
- Suggestion quantité (basée historique ventes)

### US-084 — Valorisation stock 🟡
**En tant que** comptable, **je veux** valoriser le stock **afin de** produire la comptabilité.

- Méthode CUMP ou FIFO (configurable)
- Valorisation au coût d'achat
- État stock mensuel pour compta

### US-085 — Achats fournisseurs 🟡
**En tant que** gérant, **je veux** gérer mes achats fournisseurs **afin de** réapprovisionner.

- Bon de commande
- Réception (quantité, lot, DLC)
- Facture fournisseur
- Rapprochement commande/réception/facture
- Échéancier paiement

---

## EPIC 10 — RH & PAIE

### US-090 — Gestion employés 🔴
**En tant que** RH, **je veux** gérer les dossiers employés **afin de** respecter les obligations légales.

**Dossier employé :**
- Identité (nom, prénom, date naissance, photo)
- Contact (téléphone, email, adresse)
- Documents (CNI, contrat, diplômes, RIB)
- Contrat (type CDI/CDD, date début, essai, salaire de base)
- Statut (actif, congé, suspendu, parti)

### US-091 — Contrats & avenants 🔴
**En tant que** RH, **je veux** gérer les contrats et avenants **afin de** tracer les modifications.

- Templates contrat par type (CDI, CDD, essai)
- Génération PDF
- Avenants (modification salaire, fonction)
- Historique

### US-092 — Pointage 🔴
**En tant qu'** employé, **je veux** pointer mes heures **afin de** justifier mon temps de travail.

- Pointage mobile (geofencing institut) ou biométrie
- Heures arrivée/départ
- Retards signalés
- Heures supplémentaires calculées

### US-093 — Congés & permissions 🟡
**En tant qu'** employé, **je veux** poser des congés **afin de** planifier mes absences.

- Solde congés (acquis, pris, restant)
- Demande congé (dates, type : annuel, maladie, exceptionnel)
- Validation hiérarchique
- Calendrier équipe

### US-094 — Primes & indemnités 🟡
**En tant que** RH, **je veux** configurer primes et indemnités **afin de** calculer la paie.

- Primes : transport, logement, fonction, ancienneté, rendement
- Indemnités par pays (configurateur)
- Avances & prêts salariés
- Saisie arrêts

### US-095 — Génération paie CNPS CI / IPM SN 🟡
**En tant que** RH/comptable, **je veux** générer les bulletins de paie conformes **afin de** respecter la loi.

- Sélection période + employés
- Calcul auto : salaire brut, cotisations (CNPS CI ou IPM SN), IGR/IR, net à payer
- Génération bulletin PDF conforme
- Validation gérant
- Distribution (email + app employé)

### US-096 — Déclaration CNPS e-CNPS 🟡
**En tant que** comptable, **je veux** exporter la déclaration CNPS **afin de** transmettre avant le 15.

- Format attendu e-CNPS CI
- Export CSV/XML
- Liste des cotisations par employé
- Archivage

### US-097 — Déclaration IPM Sénégal 🟡
**En tant que** comptable CI/SN, **je veux** exporter la déclaration IPM SN **afin de** respecter la loi.

- Format IPM SN
- Export structuré
- Échéancier rappels

### US-098 — Comptes employés (app) 🟡
**En tant qu'** employé, **je veux** consulter mes bulletins **afin de** suivre ma paie.

- Espace employé dans app Pro
- Bulletins PDF historique
- Solde congés
- Demandes de congé/avance

---

## EPIC 11 — COMPTABILITÉ SYSCOHADA

### US-100 — Plan comptable pré-chargé 🟡
**En tant que** comptable, **je veux** le plan comptable SYSCOHADA pré-chargé **afin de** démarrer rapidement.

- Plan OHADA complet (classes 1-8)
- Comptes pré-configurés par défaut
- Personnalisation possible (ajout sous-comptes)

### US-101 — Journaux automatiques 🟡
**En tant que** système, **je veux** générer automatiquement les écritures **afin de** réduire la saisie.

- Journal ventes : depuis caisse (automatique)
- Journal achats : depuis réceptions fournisseurs
- Journal banque : depuis rapprochement
- Journal caisse : depuis encaissements
- Journal OD : manuel

### US-102 — Saisie manuelle écriture 🟡
**En tant que** comptable, **je veux** saisir des écritures manuelles **afin de** gérer les opérations diverses.

- Saisie partie double
- Compte débit / crédit
- Libellé, pièce justificative
- Validation équilibrée

### US-103 — Grand livre & balance 🟡
**En tant que** comptable, **je veux** éditer le grand livre et la balance **afin de** contrôler.

- Grand livre par compte
- Balance générale (6 colonnes)
- Balance âgée
- Filtres période

### US-104 — États financiers annuels 🟡
**En tant que** comptable, **je veux** générer le bilan et le compte de résultat **afin de** clôturer l'exercice.

- Bilan SYSCOHADA
- Compte de résultat
- Annexe
- Tableau de flux de trésorerie
- Export PDF pour expert-comptable

### US-105 — TVA 18% 🟡
**En tant que** comptable, **je veux** calculer et déclarer la TVA **afin de** respecter la fiscalité.

- TVA collectée (ventes)
- TVA déductible (achats)
- TVA à payer / crédit
- Déclaration mensuelle (format DGI)
- Par pays (18% CI, 18% SN)

### US-106 — Retenues à la source 🟡
**En tant que** comptable, **je veux** calculer les retenues à la source **afin de** respecter la fiscalité.

- Configuration taux par prestation
- Application auto sur factures concernées
- Déclaration trimestrielle

### US-107 — Liasse fiscale annuelle 🟡
**En tant que** comptable, **je veux** produire la liasse fiscale **afin de** transmettre à l'expert-comptable.

- Ensemble états fiscaux
- Export Excel + PDF
- Archivage 10 ans

### US-108 — Rapprochement bancaire 🟡
**En tant que** comptable, **je veux** rapprocher mes relevés bancaires **afin de** vérifier la trésorerie.

- Import relevé (CSV, PDF)
- Matching auto avec écritures
- Écritures manquantes signalées
- Validation rapprochement

---

## EPIC 12 — MARKETING & FIDÉLITÉ

### US-110 — Campagnes SMS/WhatsApp 🟡
**En tant que** gérant, **je veux** envoyer des campagnes SMS segmentées **afin de** réactiver mes clientes.

- Sélection segment
- Template message
- Programmation envoi
- Coût estimé
- Statistiques envoi/lecture

### US-111 — Programme fidélité 🟡
**En tant que** gérant, **je veux** configurer un programme fidélité **afin de** récompenser mes clientes.

- Points par euro dépensé (configurable)
- Paliers (Bronze, Argent, Or)
- Récompenses (réductions, soins offerts)
- Carte fidélité numérique QR

### US-112 — Codes promo & promotions 🟡
**En tant que** gérant, **je veux** créer des promotions **afin de** booster les ventes.

- Code promo (% ou montant fixe)
- Validité, usage limit
- Applicabilité (soins, produits, tout)
- Suivi utilisation

### US-113 — Cartes cadeaux 🟡
**En tant que** gérant, **je veux** vendre des cartes cadeaux **afin de** toucher de nouvelles clientes.

- Création carte (montant / prestation)
- Vente + paiement
- Code QR unique
- Suivi solde
- Validité configurable

### US-114 — Parrainage 🟡
**En tant que** cliente, **je veux** parrainer mes amies **afin de** gagner des récompenses.

- Code parrainage unique
- Partage (WhatsApp, SMS, lien)
- Bonus parrain + filleul (dans wallet)
- Suivi filleuls

### US-115 — Push notifications ciblées 🟡
**En tant que** gérant, **je veux** envoyer des push ciblées **afin de** réengager.

- Sélection segment
- Template
- Programmation
- Statistiques ouverture

---

## EPIC 13 — REPORTING & KPIs

### US-120 — Tableau de bord temps réel 🔴
**En tant que** gérant, **je veux** voir mes KPIs en temps réel **afin de** piloter mon activité.

- CA du jour / vs hier / vs même jour an dernier
- RDV du jour / à venir / terminés
- Taux d'occupation par praticienne
- No-shows du jour
- Top soins du jour
- Stock critique

### US-121 — Rapport CA 🔴
**En tant que** gérant, **je veux** analyser mon CA par période **afin de** identifier les tendances.

- CA par jour/semaine/mois/année
- Par site, par praticienne, par type de soin
- Comparaison périodes
- Export Excel/PDF

### US-122 — Rapport praticiennes 🟡
**En tant que** gérant, **je veux** analyser la performance des praticiennes **afin de** gérer mon équipe.

- CA par praticienne
- Taux d'occupation
- Note moyenne
- Commissions calculées

### US-123 — Rapport clients 🟡
**En tant que** gérant, **je veux** analyser ma clientèle **afin de** cibler mes actions.

- Nouvelles clientes / récurrentes
- Panier moyen
- Fréquence
- Top clientes

### US-124 — Rapport stock 🟡
**En tant que** gérant, **je veux** analyser mon stock **afin d'**optimiser.

- Rotation produits
- Ruptures
- Surstock
- Valeur stock

### US-125 — Export comptable 🟡
**En tant que** comptable, **je veux** exporter les données **afin de** transmettre à l'expert-comptable.

- Export FEC (Fichier des Écritures Comptables) adapté OHADA
- Export liasse fiscale
- Export grand livre

---

## EPIC 14 — CONSOLE ADMIN KÈNÈ

### US-130 — Onboarding entreprise 🔴
**En tant que** ADMIN Kènè, **je veux** valider les nouvelles entreprises **afin de** contrôler le marketplace.

- Liste demandes en attente
- Vérification KYB (RCCM, ID)
- Validation / refus (motif)
- Activation compte
- Configuration pays/devise

### US-131 — Gestion abonnements 🔴
**En tant que** ADMIN Kènè, **je veux** gérer les abonnements Pro **afin de** facturer.

- Liste entreprises par palier
- Facturation mensuelle auto
- Relances impayés
- Suspension / réactivation

### US-132 — Modération avis 🟡
**En tant que** ADMIN Kènè, **je veux** modérer les avis **afin de** garantir la qualité.

- File de modération
- Validation / suppression / signalement
- Règles anti-spam

### US-133 — Supervision IA 🔴
**En tant que** ADMIN Kènè, **je veux** surveiller le modèle IA **afin de** garantir la qualité.

- Volume diagnostics / jour
- Taux d'orientation dermato
- Drift modèle détecté
- Faux positifs/négatifs signalés
- Pipeline ré-entraînement

### US-134 — Métriques plateforme 🔴
**En tant que** ADMIN Kènè, **je veux** voir les KPIs plateforme **afin de** piloter.

- Entreprises actives par pays
- Clientes par pays
- Volume transactions MoMo
- MRR par pays
- Churn

### US-135 — Gestion partenaires MoMo 🔴
**En tant que** ADMIN Kènè, **je veux** configurer les opérateurs MoMo **afin de** gérer les intégrations.

- Activation opérateur par pays
- Clés API
- Taux commission
- Monitoring transactions

### US-136 — Conformité & audit 🔴
**En tant que** ADMIN Kènè, **je veux** accéder aux journaux d'audit **afin de** répondre aux autorités.

- Journal centralisé (toutes actions)
- Recherche par tenant, utilisateur, action, date
- Export pour autorités data protection
- Gestion demandes d'accès/effacement

### US-137 — Support & tickets 🟡
**En tant que** ADMIN Kènè, **je veux** gérer les tickets support **afin d'**assister les utilisateurs.

- File de tickets (client + pro)
- Priorisation
- SLA
- Base de connaissances

---

## EPIC 15 — TÉLÉCONSULTATION (MVP 1B)

### US-140 — Chat avec institut 🟡
**En tant que** cliente, **je veux** chatter avec mon institut **afin de** poser des questions.

- Messagerie asynchrone
- Pièces jointes (photos)
- Historique
- Notifications push

### US-141 — Appel vidéo dermo-conseil 🟡
**En tant que** cliente, **je veux** faire une téléconsultation **afin d'**obtenir un conseil expert.

- Réservation créneau téléconsultation
- Appel vidéo in-app (WebRTC)
- Partage écran diagnostic IA
- Prescriptions soins/produits
- Compte-rendu PDF

### US-142 — Chat Pro 🟡
**En tant que** praticienne, **je veux** répondre aux clientes **afin de** les conseiller.

- File de conversations
- Réponses rapides (templates)
- Transfert à une collègue
- Marquage « en attente / traité »

---

## EPIC 16 — MULTI-SITES & RÔLES (MVP 1B)

### US-150 — Gestion multi-sites 🟡
**En tant que** gérant chaîne, **je veux** gérer plusieurs instituts **afin de** consolider.

- Création sites (adresse,配置)
- Affectation employés par site
- Consolidation comptable
- Reporting multi-sites

### US-151 — Matrice permissions fine 🟡
**En tant que** gérant, **je veux** configurer les permissions par rôle **afin de** sécuriser.

- Rôles prédéfinis + personnalisés
- Permissions par module (vue, création, modification, suppression)
- Héritage par site

### US-152 — Audit trail 🟡
**En tant que** gérant, **je veux** tracer toutes les actions **afin de** sécuriser.

- Journal par tenant
- Qui / quand / quoi / où
- Filtres et recherche
- Export

---

## MATRICE PRIORITÉS MVP

| Epic | Phase 1A 🔴 | Phase 1B 🟡 | Phase 2 🟢 |
|---|---|---|---|
| 1. Onboarding & Auth | ✅ US-001 à 008 | – | – |
| 2. Diagnostic IA | ✅ US-010 à 015 | US-016 à 018 | Extension |
| 3. Recherche & RDV | ✅ US-020 à 025 | US-026 | – |
| 4. Paiement MoMo | ✅ US-030 à 033 | US-034, 035 | – |
| 5. Boutique | ✅ US-040 à 042, 044 | US-043 | Marketplace |
| 6. Agenda Pro | ✅ US-050 à 055 | – | – |
| 7. Caisse POS | ✅ US-060 à 064 | US-065 | – |
| 8. CRM | ✅ US-070, 071, 074 | US-072, 073 | – |
| 9. Stock | ✅ US-080 à 083 | US-084, 085 | – |
| 10. RH & Paie | US-090 à 092 | US-093 à 098 | Extension pays |
| 11. Compta | – | US-100 à 108 | IFRS (Phase 3) |
| 12. Marketing | – | US-110 à 115 | – |
| 13. Reporting | ✅ US-120, 121 | US-122 à 125 | – |
| 14. Console | ✅ US-130 à 136 | US-137 | – |
| 15. Téléconsult | – | US-140 à 142 | – |
| 16. Multi-sites | – | US-150 à 152 | – |

---

**Total : 80+ user stories couvrant l'ensemble du périmètre MVP Phase 1A + 1B.**
