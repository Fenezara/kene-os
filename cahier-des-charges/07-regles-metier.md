# Partie 7 — Règles Métier Détaillées

> Formules, algorithmes, politiques business
> À implémenter dans les services backend

---

## 1. RÈGLES DE RÉSERVATION & ANNULATION

### 1.1 Politique d'annulation par paliers

| Délai avant RDV | Politique | Remboursement acompte |
|---|---|---|
| > 72h | Annulation libre | 100% |
| 24h - 72h | Annulation tolérée | 80% |
| 2h - 24h | Pénalité | 30% |
| < 2h | No-show anticipé | 0% (conservation totale) |
| Après RDV | No-show | 0% + éventuel blacklist |

**Configuration par institut** : le gérant peut ajuster ces paliers (dans limites 0-100%).

### 1.2 Algorithme de remboursement acompte

```
FONCTION calculer_remboursement(rdv, motif):
    SI motif == "institut_annule":
        RETOURNER acompte × 100%
    
    SI motif == "force_majeure" (avec justificatif):
        RETOURNER acompte × 100%
    
    delai_heures = rdv.start_at - maintenant()
    
    SI delai_heures > 72:
        RETOURNER acompte × 100%
    SINON SI delai_heures > 24:
        RETOURNER acompte × 80%
    SINON SI delai_heures > 2:
        RETOURNER acompte × 30%
    SINON:
        RETOURNER 0  // No-show
```

### 1.3 Règles de reprogrammation

- **Maximum 2 reprogrammations** par RDV
- **Délai min** entre reprogrammations : 2h
- **Nouveau créneau** doit être dans les 60 jours
- Si reprogrammation > 24h avant RDV : gratuit
- Si reprogrammation < 24h : 1 seule tolérée, sinon considéré comme annulation

### 1.4 Conflits d'agenda — règles de résolution

| Cas | Règle |
|---|---|
| Même praticienne même horaire | Interdit (système bloque) |
| Même ressource (cabine) même horaire | Interdit (système bloque) |
| Chevauchement partiel RDV | Détecté + proposition créneau alternatif |
| Praticienne en congé | Créneaux désactivés automatiquement |
| Hors horaires d'ouverture | Créneaux désactivés |

### 1.5 Limite de réservation par cliente

- Maximum **5 RDV futurs** simultanés par cliente (anti-abus)
- Maximum **3 RDV/semaine** par cliente (sauf VIP)
- Délai min entre 2 RDV : 2h (même institut)

---

## 2. CALCUL DES COMMISSIONS PRATICIENNES

### 2.1 Modèles de commission (configurables par institut)

#### Modèle A — Pourcentage fixe
```
commission = prix_soin × taux_commission (ex: 10%)
```

#### Modèle B — Pourcentage par paliers
```
SI CA_mensuel < 500 000 FCFA:
    commission = CA × 5%
SINON SI CA_mensuel < 1 000 000 FCFA:
    commission = CA × 8%
SINON:
    commission = CA × 12%
```

#### Modèle C — Fixe par soin
```
commission = montant_fixe_par_soin (défini par soin)
```

#### Modèle D — Mixte (fixe + variable)
```
commission = (prix_soin × 5%) + bonus_si_objectif_atteint
```

### 2.2 Calcul commission avec pourboires

```
commission_totale = commission_soin + (pourboire × 100%)
// Pourboire 100% à la praticienne (pas de commission Kènè dessus)
```

### 2.3 Périodes de calcul

- **Période** : mensuelle (1er au dernier jour du mois)
- **Versement** : avec la paie du mois suivant
- **Statut** : calculé en fin de mois, validé par gérant

---

## 3. SCORING RFM CLIENTS

### 3.1 Définitions

| Dimension | Définition | Période |
|---|---|---|
| **Récence (R)** | Nombre de jours depuis dernière visite | — |
| **Fréquence (F)** | Nombre de visites sur période | 12 mois |
| **Montant (M)** | CA total sur période | 12 mois |

### 3.2 Calcul des scores (1-5)

#### Score Récence
| Jours depuis dernière visite | Score |
|---|---|
| 0-30 | 5 |
| 31-60 | 4 |
| 61-120 | 3 |
| 121-240 | 2 |
| > 240 ou jamais | 1 |

#### Score Fréquence (12 mois)
| Nb visites | Score |
|---|---|
| ≥ 12 (mensuel) | 5 |
| 8-11 | 4 |
| 4-7 | 3 |
| 2-3 | 2 |
| 0-1 | 1 |

#### Score Montant (12 mois, FCFA)
| CA total | Score |
|---|---|
| ≥ 500 000 | 5 |
| 250 000 - 499 999 | 4 |
| 100 000 - 249 999 | 3 |
| 30 000 - 99 999 | 2 |
| < 30 000 | 1 |

### 3.3 Segments auto

| Segment | RFM | Action marketing |
|---|---|---|
| **Champions** | R≥4, F≥4, M≥4 | VIP, offres exclusives |
| **Fidèles** | R≥3, F≥3 | Programme fidélité |
| **Potentiels** | R≥4, F≤2 | Réactivation par offres |
| **À risque** | R=2, F≥3 | Win-back (remises) |
| **Perdus** | R=1, F≤2 | Campagne réactivation |
| **Nouveaux** | 1ère visite <30j | Onboarding + 2e RDV incité |

---

## 4. RÈGLES DE VALORISATION STOCK

### 4.1 Méthode CUMP (Coût Unitaire Moyen Pondéré)

```
CUMP après entrée = (valeur_stock_actuel + valeur_entrée) / (quantité_actuelle + quantité_entrée)

Exemple:
- Stock actuel: 10 unités × 5 000 FCFA = 50 000 FCFA
- Entrée: 20 unités × 5 500 FCFA = 110 000 FCFA
- Nouveau CUMP = (50 000 + 110 000) / (10 + 20) = 5 333 FCFA
```

### 4.2 Méthode FIFO (Premier Entré Premier Sorti)

- Les sorties sont valorisées au prix du lot le plus ancien
- Chaque lot garde son prix d'achat
- Traçabilité par numéro de lot + DLC

### 4.3 Configuration par tenant

- Méthode choisie en setup (CUMP par défaut)
- **Non modifiable** après première entrée en stock (cohérence comptable)
- Exception : changement validé par expert-comptable (écriture d'OD)

### 4.4 Inventaire — règles d'ajustement

```
FONCTION ajuster_stock(produit, quantité_comptée, motif):
    quantité_théorique = stock_actuel(produit)
    écart = quantité_comptée - quantité_théorique
    
    SI écart == 0:
        RETOURNER "Aucun ajustement"
    
    SI écart < 0:  // Manquant
        mouvement = SORTIE(produit, |écart|, motif)
        écriture_compta:
            débit: 658 (charges diverses) ou 6037 (variation stock)
            crédit: 3X (stock)
    
    SI écart > 0:  // Excédent
        mouvement = ENTREE(produit, écart, motif)
        écriture_compta:
            débit: 3X (stock)
            crédit: 758 (produits divers)
    
    VALIDATION gérant (2FA obligatoire)
    AUDIT trail: {qui, quand, quoi, motif}
```

---

## 5. RÈGLES FISCALES — CALCULS DÉTAILLÉS

### 5.1 Calcul IGR Côte d'Ivoire (mensuel)

```
FONCTION calculer_igr(salaire_brut_mensuel):
    SI salaire ≤ 75 000:
        RETOURNER 0
    
    impôt = 0
    SI salaire > 75 000 ET ≤ 240 000:
        impôt = (salaire - 75 000) × 16%
    SINON SI salaire > 240 000 ET ≤ 800 000:
        impôt = (240 000 - 75 000) × 16% + (salaire - 240 000) × 21%
    SINON SI salaire > 800 000 ET ≤ 2 400 000:
        impôt = 165 000 × 16% + (800 000 - 240 000) × 21% + (salaire - 800 000) × 24%
    SINON SI salaire > 2 400 000 ET ≤ 8 000 000:
        // tranches précédentes + 28%
        ...
    SINON:  // > 8 000 000
        // tranches précédentes + 36%
        ...
    
    RETOURNER impôt
```

### 5.2 Calcul TVA CI/SN (18%)

```
TVA_collectée = Σ(ventes TTC × 18/118)  // ventes soumises
TVA_déductible = Σ(achats TTC × 18/118)  // achats avec facture conforme
TVA_à_payer = TVA_collectée - TVA_déductible

SI TVA_à_payer < 0:
    crédit_de_TVA (à reporter mois suivant)
SINON:
    déclaration + paiement avant le 15
```

### 5.3 Cotisations CNPS CI (détaillées)

```
FONCTION calculer_cotisations_cnps(salaire_brut):
    // PENSION VIEILLESSE (plafond 3 375 000)
    base_pension = MIN(salaire_brut, 3 375 000)
    pension_employeur = base_pension × 7,7%
    pension_salarie = base_pension × 6,3%
    
    // PRESTATIONS FAMILIALES (plafond 70 000)
    base_prestations = MIN(salaire_brut, 70 000)
    prestations_employeur = base_prestations × 5%
    
    // ASSURANCE MATERNITÉ (plafond 70 000)
    maternité_employeur = base_prestations × 0,75%
    
    // ACCIDENTS TRAVAIL (plafond 70 000, taux 2% pour services)
    base_at = MIN(salaire_brut, 70 000)
    at_employeur = base_at × taux_at  // 2% pour instituts/spa
    
    RETOURNER {
        employeur: pension_employeur + prestations_employeur + maternité_employeur + at_employeur,
        salarie: pension_salarie,
        total: ...
    }
```

### 5.4 Congés payés (8% CI)

```
indemnité_congés = salaire_brut_annuel × 8%
// Versée au moment du départ en congé
// Pas de cotisations sociales sur l'indemnité
```

### 5.5 Retenues à la source

```
FONCTION calculer_RAS(type_prestation, montant_HT):
    taux_RAS = table_RAS[type_prestation]  // 1%, 1,5%, etc.
    RAS = montant_HT × taux_RAS
    
    // Versée à la DGI mensuellement
    RETOURNER RAS
```

---

## 6. RÈGLES COMPTABLES SYSCOHADA

### 6.1 Génération automatique écritures

#### Vente caisse
```
Pour chaque vente TTC:
    Débit: 411 (Clients) ou 521 (Caisse) ou 522 (MoMo) [TTC]
    Crédit: 701/702/706 (Ventes) [HT]
    Crédit: 443 (TVA collectée) [TVA]
```

#### Achat fournisseur
```
Pour chaque achat TTC (avec facture conforme):
    Débit: 601/602 (Achats) [HT]
    Débit: 445 (TVA déductible) [TVA]
    Crédit: 401 (Fournisseurs) [TTC]
```

#### Paiement salaire
```
Débit: 641 (Rémunérations) [brut]
Crédit: 422 (Personnel - rémunérations dues) [net]
Crédit: 43 (Organismes sociaux) [cotisations salarié]
Crédit: 442 (État - impôts) [IGR]
```

#### Paiement cotisations CNPS
```
Débit: 644 (Cotisations sociales) [employeur]
Débit: 43 (Organismes sociaux) [salarié - déjà comptabilisé]
Crédit: 521 (Banque) [total]
```

### 6.2 Règles de lettrage

- Lettrage automatique par matching montant + date ± 5 jours
- Lettrage manuel pour écarts
- Comptes non lettrés signalés en fin de période

### 6.3 Clôture annuelle — séquence

1. Inventaire physique de clôture
2. Régularisations (charges constatées d'avance, produits constatés d'avance)
3. Amortissements (dotations)
4. Provisions
5. Compte de résultat → bilan
6. Édition états financiers SYSCOHADA
7. Liasse fiscale
8. Dépôt greffe + DGI

---

## 7. RÈGLES WALLET KÈNÈ

### 7.1 Cashback

```
FONCTION calculer_cashback(achat):
    taux_cashback = 1%  // configuré par tenant
    cashback = achat.montant × taux_cashback
    
    // Crédité dans wallet après confirmation paiement
    // Plafond mensuel: 50 000 FCFA
    
    SI (cashback_cumul_mois + cashback) > 50 000:
        cashback = 50 000 - cashback_cumul_mois
    
    RETOURNER cashback
```

### 7.2 Parrainage

```
FONCTION bonus_parrainage(parrain, filleul):
    SI filleul.premier_achat >= 10 000 FCFA:
        bonus_parrain = 2 000 FCFA  // wallet parrain
        bonus_filleul = 1 000 FCFA  // wallet filleul
        
        // Limite: 20 filleuls/an par parrain
        SI parrain.filleuls_annee >= 20:
            RETOURNER "Limite atteinte"
        
        CREDITER(parrain.wallet, bonus_parrain)
        CREDITER(filleul.wallet, bonus_filleul)
```

### 7.3 Approvisionnement & utilisation

- Approvisionnement : minimum 5 000 FCFA, maximum 500 000 FCFA/transaction
- Utilisation : sur tout RDV/achat (max 100% du montant)
- Conversion : impossible (wallet en devise du pays uniquement)
- Expiration : sans activité 24 mois → dossier inactif (fonds conservés)

---

## 8. RÈGLES DIAGNOSTIC IA

### 8.1 Score global — formule

```
score_global = 100 - Σ(indicateur.sévérité × poids)

Poids par indicateur (sur 100):
- PIH: 15
- Mélasma: 12
- Acné: 15
- PFB: 8
- Pores: 8
- Texture: 10
- Séborrhée: 7
- Ridules: 10
- Taches solaires: 10
- Nævi: 5 (orientation dermato si ABCDE)

Sévérité: 0 (aucun), 1 (léger), 2 (modéré), 3 (sévère)
```

### 8.2 Sous-scores par dimension

| Dimension | Indicateurs | Calcul |
|---|---|---|
| Hydratation | Séborrhée (inverse), Texture | moyenne inversée |
| Éclat | Taches, PIH | 100 - moyenne pondérée |
| Texture | Pores, Texture, Ridules | moyenne inversée |
| Pigmentation | PIH, Mélasma, Taches | 100 - moyenne pondérée |
| Acné | Acné, PFB | 100 - moyenne pondérée |
| Sensibilité | Rougeurs, Inflammation | (extension Phase 1B) |

### 8.3 Règles d'orientation dermatologique

```
FONCTION evaluer_orientation_dermato(indicateurs):
    SI indicateurs.nævi.ABCDE_score >= 2:
        RETOURNER ORIENTATION_DERMATO
    
    SI indicateurs.suspicion_melanome_acral:
        RETOURNER ORIENTATION_URGENTE  // < 48h
    
    SI indicateurs.lésion_non_classable:
        RETOURNER ORIENTATION_DERMATO
    
    SI indicateurs.keloide_severe == 3:
        RETOURNER ORIENTATION_DERMATO
    
    RETOURNER AUCUNE
```

### 8.4 Recommandations — règles de génération

```
FONCTION générer_recommandations(diagnostic):
    routine = []
    produits = []
    soins = []
    
    // Pour chaque indicateur, mapping vers actions
    POUR CHAQUE indicateur DANS diagnostic.indicateurs:
        SI indicateur.sévérité > 0:
            actions = TABLE_RECOMMANDATIONS[indicateur.name]
            routine.ajouter(actions.routine)
            produits.ajouter(actions.produits)
            soins.ajouter(actions.soins)
    
    // Dédupliquer + trier par pertinence
    routine = unique(routine).tri(priorité)
    produits = unique(produits).tri(score_recommandation)
    soins = unique(soins).tri(score_recommandation)
    
    // Filtrer produits par stock institut partenaire (proximité)
    produits = filtrer_par_disponibilité(produits, position_client)
    
    RETOURNER {routine, produits, soins}
```

---

## 9. RÈGLES MARKETING & FIDÉLITÉ

### 9.1 Programme fidélité — calcul points

```
FONCTION calculer_points(client, achat):
    taux_base = 1 point / 1 000 FCFA
    multiplicateur = 1
    
    SI client.palier == "Argent":
        multiplicateur = 1,5
    SINON SI client.palier == "Or":
        multiplicateur = 2
    SINON SI client.palier == "Platine":
        multiplicateur = 3
    
    points = (achat.montant / 1000) × multiplicateur
    RETOURNER floor(points)
```

### 9.2 Paliers fidélité (configurable)

| Palier | Seuil points | Avantages |
|---|---|---|
| Bronze | 0 | Cashback 1% |
| Argent | 500 | Cashback 1,5% + cadeau anniversaire |
| Or | 2 000 | Cashback 2% + RDV prioritaire + soin offert/an |
| Platine | 5 000 | Cashback 3% + accès VIP + dermo-conseil illimité |

### 9.3 Campagne SMS/WhatsApp — règles anti-spam

- Maximum **1 message/semaine** par cliente (sauf RDV)
- Heures d'envoi : **8h-20h** (heure locale)
- Opt-out : « STOP au XXXX » obligatoire
- Pas de SMS aux clientes désinscrites
- Coût affiché avant envoi

### 9.4 Code promo — règles

- Maximum **1 code par commande**
- Non cumulable avec autres promos (sauf config)
- Usage limit : 1 par cliente (par défaut)
- Validité : date début + date fin obligatoires
- Montant min panier (optionnel)
- Type : pourcentage ou montant fixe

---

## 10. RÈGLES SÉCURITÉ & ANTI-FRAUDE

### 10.1 Détection fraude paiement

```
FONCTION détecter_fraude(payment):
    score_risque = 0
    
    // Montant inhabituel
    SI payment.montant > moyenne_historique × 3:
        score_risque += 30
    
    // Fréquence élevée
    SI nb_paiements_24h(payment.client) > 5:
        score_risque += 25
    
    // Géolocalisation inhabituelle
    SI payment.geo != historique_geo(payment.client):
        score_risque += 20
    
    // Numéro MoMo nouveau
    SI payment.momo_phone NOT IN historique_phones(payment.client):
        score_risque += 15
    
    // Heure inhabituelle
    SI payment.heure BETWEEN 0h AND 5h:
        score_risque += 10
    
    SI score_risque >= 50:
        RETOURNER BLOCAGE_MANUEL
    SINON SI score_risque >= 30:
        RETOURNER VERIFICATION_3DS
    SINON:
        RETOURNER OK
```

### 10.2 Lockout authentification

```
FONCTION tenter_login(user, password):
    SI user.locked_until > maintenant():
        RETOURNER "Compte bloqué, réessayez dans X min"
    
    SI verify_password(user, password):
        user.failed_attempts = 0
        RETOURNER SUCCESS
    SINON:
        user.failed_attempts += 1
        SI user.failed_attempts >= 5:
            user.locked_until = maintenant() + 15 min
            envoyer_alerte_securite(user)
        RETOURNER "Identifiants invalides (X/5 essais)"
```

### 10.3 Rotation clés API Mobile Money

- Rotation **trimestrielle** automatique
- Procédure : génération nouvelle clé → overlap 7 jours → révocation ancienne
- Audit : toute utilisation ancienne clé après révocation = alerte critique

---

## 11. RÈGLES MULTI-SITES & MULTI-DEVISES

### 11.1 Conversion de devises

```
FONCTION convertir_montant(montant, devise_source, devise_cible):
    SI devise_source == devise_cible:
        RETOURNER montant
    
    taux = obtenir_taux_quotidien(devise_source, devise_cible)
    // Source: BCEAO/BEAC (fixes pour XOF/XAF)
    // Source: banques centrales pour devises flottantes
    
    montant_converti = montant × taux
    RETOURNER round(montant_converti, 2)
```

### 11.2 Consolidation multi-sites

- Chaque site a sa propre caisse, stock, agenda
- Consolidation comptable : écritures transférées au tenant parent
- Reporting : agrégation multi-sites avec filtres
- Employés : affectés à un site principal (peut intervenir ailleurs)

---

## 12. RÈGLES CONFORMITÉ & AUDIT

### 12.1 Conservation des données

| Type donnée | Durée conservation | Base légale |
|---|---|---|
| Factures | 10 ans | Fiscal CI/SN |
| Bulletins paie | 10 ans | Social |
| Déclarations CNPS | 10 ans | Social |
| Documents employés | 5 ans après départ | Code travail |
| Données santé (diagnostics) | Durée compte + 30 jours | IPDCP (droit oubli) |
| Logs audit | 10 ans | Sécurité |
| Photos diagnostic (anonymisées IA) | Indéfini (consentement spécifique) | Recherche |

### 12.2 Droit à l'oubli

```
FONCTION supprimer_compte_client(client):
    // 1. Anonymisation données identifiantes
    UPDATE clients SET 
        first_name = 'ANONYME',
        last_name = 'ANONYME',
        phone = NULL,
        email = NULL
    WHERE id = client.id
    
    // 2. Suppression photos diagnostic (sauf consentement recherche)
    SI NOT client.consentement_recherche:
        DELETE FROM media WHERE diagnosis_id IN (...)
    
    // 3. Suppression diagnostics
    DELETE FROM diagnoses WHERE client_id = client.id
    
    // 4. Conservation factures (anonymisées) - obligation fiscale
    UPDATE sales SET client_id = NULL WHERE client_id = client.id
    
    // 5. Archivage log suppression
    INSERT audit_logs (action = 'right_to_erasure', user_id, timestamp)
    
    // 6. Email confirmation (dernier)
    envoyer_email_confirmation(client.email_historique)
```

### 12.3 Journal d'audit — obligations

Toute action sur données sensible doit être tracée :
- Création/lecture/modification/suppression diagnostic
- Accès fiche client (qui, quand)
- Modification manuelle barème paie
- Remboursement
- Export données
- Connexion administrateur

Format log : `{timestamp, user_id, action, entity_type, entity_id, ip, user_agent, changes}`

---

*Fin de la Partie 7. Les règles métier sont formalisées et implémentables directement dans le code backend.*
