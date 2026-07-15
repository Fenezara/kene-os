# Partie 10 — Opérations, Support & Migration

> SLA, support L1/L2/L3, runbook, migration données, onboarding
> Garantit l'exploitation production, la satisfaction client et la continuité

---

## 1. SLA CONTRACTUEL (CLIENTS PRO)

### 1.1 Niveaux de service par palier d'abonnement

| Indicateur | Essentiel | Pro | Chaîne |
|---|---|---|---|
| **Disponibilité API** | 99,5% | 99,9% | 99,95% |
| **Disponibilité caisse** | 99,5% | 99,9% | 99,95% |
| **Temps réponse API** (p95) | < 2s | < 1s | < 500ms |
| **Support** | Email (48h) | Email + chat (24h) | Dédié + tél (4h) |
| **Onboarding** | Self-service | Accompagné | Sur-mesure |
| **Formation** | 1 session | 3 sessions | Illimitées |
| **Récupération données** | 24h | 4h | 1h |
| **Crédits en cas d'incident** | Non | 10% mensualité | 20% mensualité |

### 1.2 Crédits SLA

- Si disponibilité < contrat sur un mois → **crédit** sur facture suivante
- Calcul : `(contractuel - réel) × mensualité × coefficient`
- Plafond : 50% de la mensualité
- Conditions : incident signalé par client dans les 7 jours

### 1.3 Exclusions SLA

- Problèmes opérateur Mobile Money (hors contrôle Kènè)
- Problèmes réseau client
- Maintenance planifiée (notifiée 7j avant)
- Force majeure

---

## 2. SUPPORT — NIVEAUX & PROCESS

### 2.1 Organisation L1/L2/L3

#### L1 — Support front-office (Help desk)
- **Canal** : chat in-app, email support@kene.app, WhatsApp Business
- **Horaires** : 7j/7, 8h-20h (heure Abidjan/Dakar)
- **Compétences** : questions basiques, reset OTP, navigation app
- **SLA réponse** : < 30 min (chat), < 4h (email)
- **Résolution** : 60% des tickets

#### L2 — Support technique
- **Canal** : escalade depuis L1
- **Horaires** : 7j/7, 8h-22h
- **Compétences** : bugs, configuration, formations avancées
- **SLA réponse** : < 2h
- **Résolution** : 30% des tickets

#### L3 — Engineering / DevOps
- **Canal** : escalade depuis L2
- **Horaires** : 24/7 pour P0/P1
- **Compétences** : bugs complexes, sécurité, infrastructure
- **SLA réponse** : < 1h (P0), < 4h (P1)
- **Résolution** : 10% des tickets

### 2.2 Matrice de priorisation

| Priorité | Critère | SLA L1 | SLA L2 | SLA L3 |
|---|---|---|---|---|
| **P0** | Caisse down, sécurité | Immédiat | 15 min | 1h |
| **P1** | Paiement cassé, paie bloquée | 15 min | 1h | 4h |
| **P2** | Bug fonctionnel | 1h | 4h | 24h |
| **P3** | Amélioration, cosmétique | 4h | 24h | 1 semaine |

### 2.3 Outils support

| Outil | Usage |
|---|---|
| **Intercom** | Chat in-app + email |
| **Zendesk** | Ticketing |
| **StatusPage** | Status publique |
| **Slack** | Communication interne |
| **PagerDuty** | Escalade P0/P1 |
| **Loom** | Vidéos tutoriels |
| **Notion** | Base de connaissances |

### 2.4 Base de connaissances (Help Center)

#### Structure
- **Catégorie Cliente** : onboarding, diagnostic, RDV, paiement, boutique
- **Catégorie Pro** : setup, agenda, caisse, CRM, stock, paie, compta, marketing
- **FAQ** : par persona et thématique
- **Tutoriels vidéo** : modules clés (5-10 min chacun)
- **Webinaires** : mensuels (thématiques avancées)

#### Contenu initial (120+ articles)
- Onboarding cliente (15 articles)
- Diagnostic IA (10 articles)
- Réservation & RDV (12 articles)
- Paiement Mobile Money (15 articles)
- Boutique & commandes (10 articles)
- Setup entreprise (20 articles)
- Agenda & caisse Pro (20 articles)
- Stock & produits (10 articles)
- Paie & RH (15 articles)
- Comptabilité (15 articles)
- Marketing & fidélité (10 articles)

---

## 3. RUNBOOK — INCIDENTS COURANTS

### 3.1 Caisse Pro indisponible

**Symptômes** : caissier ne peut encaisser, erreur API

**Diagnostic** :
1. Vérifier status.kene.app (incident déclaré ?)
2. Tester endpoint `/health` API
3. Vérifier connexion internet institut
4. Si only 1 institut : problème tenant spécifique

**Actions** :
- **Si outage général** : activer mode offline caisse (sync différée)
- **Si tenant spécifique** : vérifier config + abonnement actif
- **Communication** : status page + email pro
- **Post-incident** : vérifier sync différée revenue

### 3.2 Paiement Mobile Money en échec

**Symptômes** : callback MoMo ne revient pas, paiement en attente

**Diagnostic** :
1. Vérifier webhook endpoint santé
2. Vérifier logs API MoMo opérateur
3. Tester avec paiement test

**Actions** :
- **Si webhook KO** : redéployer endpoint + vérifier certificat SSL
- **Si opérateur down** : informer clients (status page)
- **Timeout 5 min** : marquer paiement `failed`, proposer retry
- **Paiement orphelin** (reçu sans correspondance) : alerte admin, traitement manuel

### 3.3 Diagnostic IA lent/indisponible

**Symptômes** : diagnostic > 60s, erreur 500

**Diagnostic** :
1. Vérifier GPU EC2 santé
2. Vérifier queue Redis
3. Vérifier modèle déployé (version)
4. Logs service IA

**Actions** :
- **Si GPU saturé** : auto-scaling + provision nouvelles instances
- **Si modèle en erreur** : rollback version précédente
- **Si queue bloquée** : redémarrer workers
- **Communication** : bannière app cliente « Diagnostic temporairement ralenti »

### 3.4 Fuite de données suspectée

**Symptômes** : alerte sécurité, accès anormal, ransomware

**Actions immédiates** :
1. **Isoler** : couper accès suspect, restreindre IPs
2. **Préserver** : logs et snapshots pour forensic
3. **Évaluer** : périmètre, données affectées
4. **Notifier** : IPDCP/PDP dans 72h si données personnelles
5. **Communiquer** : clients affectés (transparent)
6. **Remédier** : patch + rotation clés + audit complet
7. **Post-mortem** : public pour incidents majeurs

### 3.5 Bug paie (calculs erronés)

**Symptômes** : gérant signale erreur bulletin, contrôle client

**Actions** :
1. **Bloquer** :暂停 génération paie pour période concernée
2. **Diagnostiquer** : identifier barème ou calcul fautif
3. **Corriger** : hotfix + tests
4. **Régénérer** : bulletins corrigés pour tous employés affectés
5. **Notifier** : gérants + employés + déclarations corrigées (CNPS/DGI)
6. **Post-mortem** : ajouter tests de non-régression

### 3.6 Tenant ne peut plus se connecter

**Diagnostic** :
1. Vérifier abonnement actif (paiement en retard ?)
2. Vérifier statut tenant (suspendu par admin ?)
3. Vérifier 2FA (perdu ?)
4. Logs auth

**Actions** :
- **Abonnement impayé** : grace period 7 jours, puis suspension
- **2FA perdu** : procédure reset (vérification identité + code 2FA backup)
- **Suspension admin** : informer motif, processus de résolution

---

## 4. MONITORING & ALERTING

### 4.1 Métriques critiques surveillées 24/7

| Métrique | Seuil alerte | Seuil critique |
|---|---|---|
| **API disponibilité** | < 99,9% /h | < 99% /h |
| **Latence API p95** | > 1s | > 3s |
| **Taux erreur 5xx** | > 1% | > 5% |
| **Caisse Pro disponibilité** | < 99,9% | < 99% |
| **Webhooks MoMo succès** | < 95% | < 90% |
| **Diagnostic IA latence p95** | > 30s | > 60s |
| **CPU/RAM serveurs** | > 80% | > 95% |
| **DB connections** | > 80% pool | > 95% pool |
| **Disk space** | > 80% | > 95% |
| **SSL certificat expiry** | < 30 jours | < 7 jours |

### 4.2 Outils

| Outil | Usage |
|---|---|
| **CloudWatch** | Métriques infrastructure AWS |
| **Prometheus + Grafana** | Métriques application |
| **Sentry** | Erreurs frontend + backend |
| **PagerDuty** | Escalade on-call |
| **StatusPage** | Status public |
| **UptimeRobot** | Monitoring externe |

### 4.3 On-call rotation

- **Équipe** : 4-6 engineers formés
- **Rotation** : 1 semaine primary + 1 secondary
- **Heures** : 24/7 pour P0/P1
- **Suivi** : sieste autorisée après intervention nuit
- **Compensation** : astreinte indemnisée

---

## 5. MAINTENANCE & MISES À JOUR

### 5.1 Fenêtres de maintenance

- **Quand** : dimanches 2h-5h (heure Abidjan/Dakar)
- **Notification** : 7 jours avant (email + status page + bannière app)
- **Impact** : API indisponible < 30 min
- **Caisse Pro** : reste fonctionnelle offline, sync différée

### 5.2 Types de mise à jour

| Type | Fréquence | Impact | Process |
|---|---|---|---|
| **Hotfix sécurité** | Ad hoc | < 5 min déploiement | Urgent, post-test minimal |
| **Patch bug** | Hebdo | < 30 min | Tests + review + canary |
| **Release mineure** | Mensuel | < 1h | Tests complets + canary 10% → 100% |
| **Release majeure** | Trimestriel | < 2h | Tests + migration DB + communication |

### 5.3 Déploiement sans interruption (zero-downtime)

- **Blue-green deployment** : 2 environnements identiques
- **Canary** : 10% trafic sur nouvelle version → vérification → 100%
- **Rollback** : < 5 min si régression
- **Health checks** : automatiques post-deploy

### 5.4 Migrations base de données

- **Outil** : Prisma Migrate
- **Stratégie** :
  1. Migration backward-compatible (ajout colonne)
  2. Déploiement code (lecture ancienne + nouvelle)
  3. Migration des données
  4. Déploiement code (lecture nouvelle uniquement)
  5. Migration cleanup (suppression ancienne)
- **Rollback** : toujours possible jusqu'à étape 5

---

## 6. SAUVEGARDES & RÉCUPÉRATION

### 6.1 Stratégie de sauvegarde

| Donnée | Fréquence | Rétention | Stockage |
|---|---|---|---|
| **PostgreSQL** | PITR continu | 35 jours | Multi-AZ + cross-region |
| **Snapshot DB complet** | Quotidien | 30 jours | S3 cross-region |
| **Snapshot mensuel** | Mensuel | 10 ans (fiscal) | S3 Glacier |
| **Médias S3** | Versioning continu | Durée vie compte | Multi-AZ |
| **Audit logs** | Temps réel | 10 ans | Append-only + WORM |
| **Config infrastructure** | IaC (Terraform) | Versionné Git | GitHub + mirror |

### 6.2 Tests de restauration

- **Quotidien** : restauration automatique d'un snapshot sur env test
- **Mensuel** : test de restauration complète + vérification données
- **Semestriel** : simulation PRA complet (région AWS différente)

### 6.3 Plan de Reprise d'Activité (PRA)

#### Objectifs
- **RTO** (Recovery Time Objective) : 4h
- **RPO** (Recovery Point Objective) : 15 min

#### Scénarios
| Scénario | RTO | Actions |
|---|---|---|
| **Perte instance** | < 30 min | Auto-scaling remplace |
| **Perte AZ** | < 1h | Failover multi-AZ |
| **Perte région** | < 4h | Restauration cross-region |
| **Cyberattaque** | < 24h | Isolation + restauration clean |

#### Procédure PRA complet
1. Détection incident majeur
2. Décision déclenchement PRA (CEO + CTO)
3. Communication équipes + clients
4. Activation environnement de secours
5. Restauration derniers snapshots
6. Re-pointing DNS
7. Vérifications
8. Reprise service
9. Post-mortem

---

## 7. ONBOARDING CLIENT PRO

### 7.1 Parcours onboarding (nouveaux instituts)

#### Jour 0 : Inscription
- Création compte + KYB + paiement abonnement
- Email bienvenue + accès app Pro

#### Jours 1-3 : Setup initial
- **Jour 1** : wizard setup (praticiennes, cabines, catalogue)
- **Jour 2** : import produits + config horaires + test caisse
- **Jour 3** : test RDV en ligne + formation initiale (1h)

#### Jours 4-7 : Go-live
- **Jour 4** : ouverture réservations en ligne
- **Jour 5-7** : suivi quotidien par Customer Success (appels, chat)

#### Jours 8-30 : Accompagnement
- Formation avancée (modules paie/compta si Pro)
- Point hebdo Customer Success
- Ajustements configuration

#### Jour 30 : Activation complète
- Vérification utilisation (KPIs)
- Passage en mode support standard

### 7.2 Formation

#### Formation Essentiel
- 1 session de 1h (visio) : prise en main de base
- Tutoriels vidéo (Help Center)

#### Formation Pro
- 3 sessions (1h chacune) :
  1. Setup + agenda + caisse
  2. CRM + stock + marketing
  3. Paie + compta
- Tutoriels vidéo + webinaires mensuels

#### Formation Chaîne
- Sur-mesure (sur site si besoin)
- Formation illimitée
- Account manager dédié

### 7.3 Customer Success

#### Équipe
- 1 CSM pour 50-80 instituts Essentiel/Pro
- 1 CSM dédié pour comptes Chaîne
- 1 Customer Success Lead

#### KPIs CSM
- Activation (30 jours) : > 80%
- Rétention 12 mois : > 90%
- NPS : > 40
- Upsell : > 15% par an

---

## 8. MIGRATION DEPUIS LOGICIEL EXISTANT

### 8.1 Cas de migration typiques

#### Depuis Excel / papier
- **Import** : modèle Excel fourni (clients, produits, employés)
- **Accompagnement** : CSM aide au remplissage
- **Validation** : vérification cohérence

#### Depuis logiciel concurrent (Planity, Fresha, etc.)
- **Export** : depuis l'outil source (CSV, Excel)
- **Mapping** : champs source → Kènè
- **Import** : outil d'import Kènè
- **Vérification** : comparaison échantillon

#### Depuis Odoo / ERP générique
- **Export** : depuis module concerné
- **Mapping** : similaire + adaptation métier beauté
- **Migration progressive** : par module

### 8.2 Outils d'import Kènè

#### Templates fournis
- Clients (Excel) : nom, téléphone, email, profil peau, historique
- Produits (Excel) : SKU, nom, prix, stock initial, fournisseur
- Employés (Excel) : identité, contrat, salaire, documents
- Services (Excel) : nom, durée, prix, ressources
- Stock initial (Excel) : produit, quantité, lot, DLC

#### Process d'import
1. Téléchargement template
2. Remplissage par client (avec aide CSM)
3. Upload dans app Pro
4. Validation automatique (erreurs/warnings)
5. Mapping champs
6. Import (transactionnel : tout ou rien)
7. Vérification post-import (rapport)
8. Activation

### 8.3 Migration données historiques

- **Factures passées** : import pour continuité compta (12 derniers mois)
- **Historique RDV** : import pour CRM (12 derniers mois)
- **Stock initial** : à date de bascule
- **Salaires passés** : import pour paie (année en cours)

### 8.4 Période de chevauchement

- **Recommandation** : 1 mois de chevauchement (ancien + Kènè)
- **Bascule** : en début de mois (pour paie/compta clean)
- **Support renforcé** : CSM dédié pendant bascule

---

## 9. OPÉRATIONS FINANCIÈRES INTERNES

### 9.1 Facturation abonnements Pro

- **Cycle** : mensuel (prélèvement le 1er)
- **Moyen** : Mobile Money (Wave/Orange) ou carte
- **Relances** :
  - J+1 : email rappel
  - J+3 : SMS
  - J+5 : suspension services premium
  - J+15 : suspension compte (accès lecture seule)
  - J+30 : résiliation + archivage

### 9.2 Commissions marketplace

- **Calcul** : mensuel (10 du mois suivant)
- **Versement** : virement Mobile Money instituts
- **Relevé** : PDF détaillé par institut

### 9.3 Paiement partenaires

- **Dermatologues validateurs** : trimestriel (facture)
- **Opérateurs MoMo** : commission auto par transaction
- **Fournisseurs SMS/WhatsApp** : mensuel

---

## 10. CONFORMITÉ OPÉRATIONNELLE

### 10.1 Veille réglementaire

- **Veille fiscale CI/SN** : lois de finances annuelles
- **Veille sociale** : barèmes CNPS/IPM annuels
- **Veille data protection** : évolutions IPDCP/PDP
- **Veille cosmétique** : réglementation ICVC/NAFDAC
- **Process** : revue trimestrielle + maj barèmes Kènè

### 10.2 Audits externes

- **Audit sécurité** : annuel (tierce partie)
- **Audit conformité fiscale** : annuel (expert-comptable)
- **Audit SOC 2** : objectif Phase 2
- **Audit accessibilité** : annuel

### 10.3 Gouvernance données

- **DPO** : désigné (interne ou externe)
- **Registre traitements** : maintenu à jour
- **Études d'impact (DPIA)** : pour nouveaux traitements sensibles
- **Coordination autorités** : IPDCP CI, PDP SN

---

## 11. DOCUMENTATION INTERNE

### 11.1 Documentation technique

| Doc | Responsable | Fréquence maj |
|---|---|---|
| Architecture (C4) | Tech Lead | Trimestriel |
| ADR (Architecture Decision Records) | Devs | Au fil de l'eau |
| Runbook incidents | SRE | Continu |
| API OpenAPI | Backend | Par release |
| Schéma DB (Prisma) | Backend | Par migration |
| Glossaire métier | Product | Trimestriel |

### 11.2 Documentation process

| Doc | Responsable |
|---|---|
| Onboarding entreprise | Customer Success |
| Formation modules | Customer Success |
| Process support L1/L2/L3 | Support Lead |
| Process facturation | Finance |
| Process conformité | DPO |
| Process sécurité | CTO |

### 11.3 Wiki interne (Notion)

- Architecture & ADR
- Runbooks
- Process opérationnels
- Base de connaissances support
- Réunions et décisions

---

## 12. RÉTROSPECTIVES & AMÉLIORATION CONTINUE

### 12.1 Rétrospectives

- **Hebdo** : équipe produit (sprint)
- **Mensuel** : équipe ops (incidents, métriques)
- **Trimestriel** : comité direction (stratégie, KPIs)
- **Post-incident** : P0/P1 uniquement (blameless post-mortem)

### 12.2 Métriques opérationnelles

| Métrique | Cible |
|---|---|
| **MTTR** (Mean Time To Resolution) P0 | < 2h |
| **MTTR P1** | < 24h |
| **Taux résolution L1** | > 60% |
| **CSAT support** | > 90% |
| **NPS clients Pro** | > 40 |
| **NPS clientes** | > 50 |
| **Taux rétention 12 mois** | > 90% |
| **Uptime API** | > 99,9% |

### 12.3 Feedback loops

- **CSAT** : après chaque interaction support (1-5 étoiles)
- **NPS** : trimestriel (clients Pro) / semestriel (clientes)
- **Feedback in-app** : bouton « Suggérer » permanent
- **Avis marketplace** : post-RDV
- **Beta testeurs** : panel instituts volontaires pour nouvelles features

---

## 13. PLAN DE CAPACITÉ

### 13.1 Projection croissance 3 ans

| Année | Tenants | Clientes | Transactions/jour | Diagnostics/jour |
|---|---|---|---|---|
| **An 1** (MVP CI+SN) | 200 | 20 000 | 5 000 | 1 000 |
| **An 2** (UEMOA) | 800 | 80 000 | 25 000 | 5 000 |
| **An 3** (+ CEMAC) | 1 500 | 150 000 | 50 000 | 10 000 |

### 13.2 Scaling planifié

| Seuil | Action |
|---|---|
| 500 tenants | Read replicas DB |
| 1 000 tenants | Sharding par région |
| 5 000 transactions/jour | Auto-scaling API |
| 20 000 diagnostics/jour | Auto-scaling GPU IA |
| 50 000 clientes | Optimisation cache |

### 13.3 Coûts prévisionnels cloud (AWS)

| Phase | Tenants | Coût/mois |
|---|---|---|
| MVP 1A | 100 | 1 800 $ |
| Fin An 1 | 200 | 3 500 $ |
| An 2 | 800 | 12 000 $ |
| An 3 | 1 500 | 25 000 $ |

---

*Fin de la Partie 10. Les opérations, support, SLA et migration garantissent l'exploitation production fiable et la satisfaction client long-terme.*

---

# ✅ CAHIER DES CHARGES — VERSION FINALE COMPLÈTE

Le cahier des charges est maintenant **très complet et détaillé** :

| Partie | Volume | Statut |
|---|---|---|
| **00-index.md** | Vue d'ensemble | ✅ |
| **01-specifications-fonctionnelles.md** | 80+ user stories | ✅ |
| **02-modele-donnees-api.md** | Schéma DB + 60+ endpoints | ✅ |
| **03-specifications-ecrans.md** | 90+ wireframes | ✅ |
| **04-exigences-non-fonctionnelles.md** | Perf, sécu, conformité | ✅ |
| **05-donnees-reference.md** | Barèmes, SYSCOHADA, taxonomies | ✅ |
| **06-diagrammes-architecture.md** | UML + C4 (Mermaid) | ✅ |
| **07-regles-metier.md** | Formules, algorithmes | ✅ |
| **08-specifications-ia.md** | Dataset, MLOps, éthique | ✅ |
| **09-plan-test.md** | Stratégie test complète | ✅ |
| **10-operations-support.md** | SLA, runbook, migration | ✅ |

**Total : 11 documents, ~6 000 lignes de spécifications détaillées, prêts pour la construction.**
