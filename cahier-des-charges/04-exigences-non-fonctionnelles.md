# Partie 4 — Exigences Non-Fonctionnelles

> Performance, sécurité, conformité, disponibilité, accessibilité, compatibilité

---

## 1. PERFORMANCE

### 1.1 Temps de réponse API
| Endpoint | Cible (p95) | Max acceptable |
|---|---|---|
| Auth OTP request | < 2s | 5s |
| Auth OTP verify | < 1s | 3s |
| Liste instituts | < 500ms | 2s |
| Fiche institut | < 800ms | 3s |
| Disponibilité créneaux | < 1s | 3s |
| Création RDV | < 2s | 5s |
| Initiation paiement MoMo | < 2s | 5s |
| Liste produits boutique | < 800ms | 2s |
| Checkout commande | < 3s | 8s |
| Diagnostic IA (inférence) | < 30s | 60s |
| Dashboard Pro | < 1.5s | 4s |
| Rapport CA | < 2s | 5s |
| Génération paie | < 10s (10 employés) | 30s |
| Génération liasse fiscale | < 30s | 60s |

### 1.2 Performance mobile
- **Time to Interactive (TTI)** : < 3s sur réseau 4G moyen
- **First Contentful Paint (FCP)** : < 1.5s
- **Largest Contentful Paint (LCP)** : < 2.5s
- **Cumulative Layout Shift (CLS)** : < 0.1
- **Taille bundle JS initial** : < 200KB gzippé
- **Lazy loading** des images et routes secondaires

### 1.3 Concurrence & charge
| Indicateur | Cible MVP 1A | Cible fin Phase 1 |
|---|---|---|
| Utilisateurs concurrents (client) | 1 000 | 10 000 |
| Utilisateurs concurrents (pro) | 200 | 2 000 |
| Requêtes API / sec | 500 | 5 000 |
| Diagnostics IA simultanés | 50 | 500 |
| Transactions MoMo / jour | 1 000 | 20 000 |
| Tenants actifs | 100 | 1 000 |

### 1.4 Base de données
- Requêtes complexes : < 200ms (avec index)
- Connection pooling : PgBouncer
- Index sur colonnes critiques : `tenant_id`, `client_id`, `created_at`, `status`
- Partitioning tables volumineuses : `kene_audit_logs`, `kene_payments` (par mois)
- Read replicas pour statistiques/rapports

### 1.5 IA
- Inférence modèle : GPU instance (NVIDIA T4 minimum)
- File d'attente Redis pour diagnostics asynchrones
- Cache résultats (identique photo) : 24h
- Edge inference (offline) : modèle quantifié < 50MB

### 1.6 Stratégies d'optimisation
- **Cache Redis** : 5 min pour listes publiques (catalogue produits, instituts), 1 min pour disponibilités
- **CDN** : CloudFront pour assets statiques et médias
- **Compression** : Brotli pour réponses API, WebP/AVIF pour images
- **Pagination** : défaut 20, max 100
- **Eager loading** : éviter N+1 (Prisma includes)
- **Materialized views** pour rapports agrégés (refresh nocturne)

---

## 2. SÉCURITÉ

### 2.1 Authentification
- **OTP** : 6 chiffres, validité 5 min, 3 essais max, blocage 15 min
- **Mots de passe** (Pro) : min 12 caractères, complexité (majuscule, minuscule, chiffre, spécial), hash bcrypt cost 12
- **2FA** : TOTP (RFC 6238) obligatoire pour gérant et comptable, optionnel autres
- **Sessions** : JWT 15 min + refresh 30 jours (httpOnly, secure, sameSite=strict)
- **Détection brute force** : lockout après 5 essais échoués
- **Détection anomalie** : alerte nouvelle géo / nouvel appareil

### 2.2 Autorisation
- **RBAC** : rôles par tenant (gerant, praticienne, caissier, comptable, rh, magasinier)
- **Permissions granulaires** par module (vue, création, modification, suppression, validation)
- **Row-Level Security** PostgreSQL : isolation tenant automatique
- **Vérification tenant_id** à chaque requête
- **Principle of least privilege**

### 2.3 Chiffrement
| Couche | Méthode |
|---|---|
| En transit | TLS 1.3 (obligatoire), HSTS preload |
| Au repos (général) | AES-256 (PostgreSQL TDE) |
| Au repos (sensible) | Chiffrement applicatif pour : données santé, RIB, documents employés, clés API MoMo |
| Sauvegardes | Chiffrées AES-256 |
| Mots de passe | bcrypt cost 12 |
| Tokens API | Vault (HashiCorp) ou AWS Secrets Manager |

### 2.4 Protection API
- **WAF** : AWS WAF avec règles OWASP Top 10
- **Rate limiting** : 100 req/min par token, 1000 req/h par IP
- **CORS** strict (whitelist domaines Kènè)
- **CSP** headers (Content Security Policy)
- **Validation entrées** : Zod schemas côté API
- **Sanitization SQL** : Prisma paramétré (pas de raw queries)
- **Protection injection** : NoSQL, SQL, XSS, command injection
- **CSRF** : tokens pour forms
- **Headers sécurité** : HSTS, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy

### 2.5 Sécurité données santé (critique)
- **Consentement explicite** obligatoire avant collecte
- **Chiffrement renforcé** (clé séparée par tenant)
- **Accès tracé** (audit log)
- **Minimisation** : seules données nécessaires collectées
- **Anonymisation** photos pour entraînement IA (consentement séparé)
- **Droit d'oubli** : suppression effective dans 30 jours
- **Hébergement** : cloud régional Afrique (priorité souveraineté)

### 2.6 Sécurité paiement
- **PCI-DSS** : pas de stockage numéros carte (tokens acquéreur)
- **Tokens MoMo** : chiffrés en base, rotation périodique
- **Idempotence** : header `Idempotency-Key` pour éviter double paiement
- **Réconciliation** : automatique + alertes écart
- **Anti-fraude** : détection anomalies (montant inhabituel, fréquence, géo)
- **Validation 2FA** pour remboursements gérant

### 2.7 Tests sécurité
- **Tests de pénétration** : annuels (tiers externe)
- **SAST** (Static Analysis) : SonarQube en CI
- **DAST** (Dynamic Analysis) : OWASP ZAP mensuel
- **Dépendances** : Dependabot, Snyk
- **Bug bounty** : programme Phase 2
- **Audit SOC 2** : objectif Phase 2

### 2.8 Incident response
- **Plan de réponse** : détection, confinement, éradication, récupération, leçon
- **Notification breach** : 72h aux autorités (IPDCP CI, PDP SN, NDPA Nigeria…)
- **Communication clients** : transparente dans 72h
- **Post-mortem** public pour incidents majeurs

### 2.9 Logs & monitoring
- **Logs centralisés** : ELK / CloudWatch
- **Logs sans données sensibles** (masquage PII)
- **Métriques** : Prometheus + Grafana
- **Alerting** : PagerDuty (critique), Slack (warnings)
- **Uptime monitoring** : Pingdom multi-régions
- **Audit trail** : toutes actions sensibles tracées (qui, quand, quoi, où)

---

## 3. CONFORMITÉ RÉGLEMENTAIRE

### 3.1 Protection des données par pays

#### Côte d'Ivoire — IPDCP
- **Loi** : n°2013-450 du 19 décembre 2013
- **Autorité** : IPDCP (Commission Informatique et Libertés)
- **Obligations** :
  - Déclaration traitement données personnelles
  - Déclaration spécifique données sensibles (santé)
  - Consentement explicite
  - Droit d'accès, rectification, opposition, oubli
  - Notification breach 72h
  - Registre des traitements
  - DPO désigné
- **Sanctions** : amendes pénales

#### Sénégal — Loi 2008-12
- **Loi** : n°2008-12 du 25 janvier 2008
- **Autorité** : Commission de Protection des Données Personnelles (PDP)
- Obligations similaires à IPDCP

#### Cadre continental
- **Convention de Malabo** (Union africaine 2014) — ratification progressive

#### Futurs pays (Phase 2-4)
| Pays | Loi | Autorité |
|---|---|---|
| Mali | Loi n°2016-059 | APDP |
| Burkina Faso | Loi 010-2004 | INPDC |
| Cameroun | Loi 2010/012 | ANPD |
| Nigeria | NDPA 2023 | NDP Commission |
| Ghana | Data Protection Act 2012 | DPC |
| Kenya | Data Protection Act 2019 | ODPC |
| Afrique du Sud | POPIA | Information Regulator |

### 3.2 Conformité fiscale

#### Côte d'Ivoire
- **TVA** : 18% (facturation obligatoire au-delà de seuils)
- **IGR** (Impôt Général sur le Revenu) : barème progressif annuel
- **IBS** (Impôt Bénéfices Sociétés) : 25%
- **Patente** : taxe sur CA
- **Retenues à la source** : variables par prestation
- **Minimum de perception** : 0,5% CA
- **CFE** (Contribution Foncière des Entreprises)
- **Déclarations** : mensuelles TVA, annuelle IBS/IGR

#### Sénégal
- **TVA** : 18%
- **IR** (Impôt sur le Revenu)
- **IS** (Impôt Sociétés) : 30%
- **Retenues à la source**
- **Patente**
- **Minimum de perception**

### 3.3 Conformité sociale (paie)

#### Côte d'Ivoire — CNPS
- **Cotisations** :
  - Pension vieillesse : employeur 7,7% + salarié 6,3% (total 14%)
  - Prestations sociales : employeur 5% + salarié 3% (total 8%)
  - Accidents travail/maladies pro : employeur variable (2-5%)
- **Congés payés** : 8% (indemnité)
- **Déclaration** : e-CNPS mensuelle avant le 15
- **Barème IGR** : progressif (0-36%)

#### Sénégal — IPM
- **IPM** (Institution de Prévoyance Maladie) : prestations familiales + maladie
- **IPM taux** : employeur variable + salarié
- **Retraite** : FNR (Fonds National de Retraite)
- **IR Sénégal** : barème progressif

#### Mali — INPS
- **INPS** : 5,4% (3,4% vieillesse + 2% invalidité/décès)
- **AMO** (Assurance Maladie Obligatoire)
- **OMD** (Office Malien des Droits d'Auteur)

### 3.4 Conformité cosmétiques
- **CI** : ICVC (Commission Ivoirienne de Contrôle de la Qualité)
- **SN** : Direction du Commerce Intérieur
- **Traçabilité** lots obligatoire
- **Étiquetage** conforme (composition, DLC, précautions)
- **Déclaration** produits importés

### 3.5 Conformité financière
- **BCEAO** : régulation Mobile Money UEMOA
- **PCI-DSS** : pour paiements carte
- **Lutte anti-blanchiment** : TRACFIN CI (déclarations soupçons)
- **KYB** (Know Your Business) : vérification RCCM entreprises

### 3.6 Accessibilité (a11y)
- **Norme** : WCAG 2.1 niveau AA
- **Contrastes** : min 4.5:1 texte normal, 3:1 grand texte
- **Navigation clavier** : tous éléments accessibles
- **Lecteurs d'écran** : ARIA labels, sémantique HTML
- **Taille texte** : ajustable jusqu'à 200%
- **Pas de couleur seule** pour transmettre l'information
- **Sous-titres** vidéos
- **Boutons min 44×44px** (touch target)

### 3.7 Conformité langues
- **Français** : langue principale Phase 1
- **Disponibilité** : mentions légales en français
- **Traductions** : CGU, politique confidentialité, consentements santé

---

## 4. DISPONIBILITÉ & FIABILITÉ

### 4.1 SLA cible
| Niveau | Cible | Mesure |
|---|---|---|
| Disponibilité API | 99.9% | temps d'arrêt < 8,76h/an |
| Disponibilité caisse Pro | 99.95% | < 4,38h/an (critique business) |
| Disponibilité app cliente | 99.5% | < 43,8h/an |
| Diagnostic IA | 99% | < 87,6h/an |
| Console admin | 99% | < 87,6h/an |

### 4.2 Maintenance
- **Fenêtres de maintenance** : dimanches 2h-5h (heure Abidjan/Dakar)
- **Notification** : 7 jours à l'avance pour maintenance planifiée
- **Déploiements sans interruption** : blue-green deployment
- **Rollback** : < 5 minutes en cas de problème

### 4.3 Redondance
- **Multi-AZ** base de données (synchrone)
- **Multi-région** pour sauvegardes (asynchrone)
- **Load balancers** : auto-scaling
- **CDN** multi-edge
- **Failover automatique** : RDS, ElastiCache

### 4.4 Sauvegardes
| Donnée | Fréquence | Rétention | Type |
|---|---|---|---|
| Base de données | Continue (PITR) | 35 jours | Point-in-time recovery |
| Snapshots complets | Quotidien | 30 jours | Full backup |
| Sauvegardes mensuelles | Mensuel | 10 ans | Conformité fiscale |
| Médias (photos) | Continue | Durée vie compte | Versioning S3 |
| Audit logs | Temps réel | 10 ans | Append-only |

### 4.5 Plan de reprise d'activité (PRA/PCA)
- **RTO** (Recovery Time Objective) : 4h
- **RPO** (Recovery Point Objective) : 15 min
- **PCA** (continuité) : caisse fonctionne offline, sync différée
- **Tests** : semestriels

### 4.6 Gestion des erreurs
- **Circuit breakers** : pour APIs externes (MoMo)
- **Retry** avec backoff exponentiel : paiements, notifications
- **Dead letter queues** : messages échoués
- **Graceful degradation** : fonctionnalités non critiques désactivables

---

## 5. COMPATIBILITÉ

### 5.1 Mobile (app cliente + app Pro mobile)
| Plateforme | Version min | Cible |
|---|---|---|
| Android | 8.0 (API 26) | 90%+ devices Afrique |
| iOS | 13.0 | iPhone 6s+ |
| Android Go | Supporté | Entrée de gamme |

### 5.2 Web (app Pro desktop + console)
| Navigateur | Version min |
|---|---|
| Chrome | 100+ |
| Firefox | 100+ |
| Safari | 15+ |
| Edge | 100+ |
| (IE 11) | ❌ Non supporté |

### 5.3 Résolutions
- **Mobile** : 360×640 à 430×932
- **Tablette** : 768×1024 à 1024×1366
- **Desktop** : 1280×720 à 2560×1440+
- **PWA** : responsive

### 5.4 Connectivité
- **Offline-first** pour : caisse, agenda, capture diagnostic
- **Sync différée** quand connexion revenue
- **Mode dégradé** : 2G/3G (texte prioritaire, images lazy)
- **Détection réseau** : indicateur visible (online/offline/sync)

### 5.5 Performance devices entrée de gamme
- **RAM** : supporté à partir de 2GB
- **Stockage** : app < 100MB installée
- **Batterie** : optimisations (pas de polling inutile, background tasks limitées)

---

## 6. SCALABILITÉ

### 6.1 Architecture horizontale
- **Microservices** : scalables indépendamment
- **Auto-scaling** : basé sur CPU/mémoire/latence
- **Stateless** services (state dans Redis/DB)
- **Load balancers** : ALB AWS

### 6.2 Base de données
- **Read replicas** : pour rapports/statistiques
- **Connection pooling** : PgBouncer
- **Partitioning** : tables volumineuses par mois/tenant
- **Sharding** : Phase 2 si > 1000 tenants (par région)

### 6.3 Files de messages
- **Redis** : queues diagnostics, notifications, syncs
- **Background workers** : paiements, rappels SMS, rapports

### 6.4 Cache
- **Multi-niveau** : application (Redis) + CDN (CloudFront)
- **Invalidation** : événementielle (pub/sub)

---

## 7. OBSERVABILITÉ

### 7.1 Métriques
- **Application** : latence, throughput, taux erreur par endpoint
- **Infrastructure** : CPU, RAM, disque, réseau
- **Business** : DAU, transactions, MRR, diagnostics/jour
- **IA** : précision, drift, latence inférence

### 7.2 Logs
- **Centralisés** : CloudWatch + ELK
- **Structurés** (JSON)
- **Corrélation** : trace ID par requête (distributed tracing)
- **Rétention** : 90 jours chaud, 1 an tiède, 10 ans audit

### 7.3 Tracing
- **OpenTelemetry** : traces distribuées
- **APM** : AWS X-Ray ou Datadog

### 7.4 Alerting
- **Critique** : PagerDuty (réponse < 15 min)
- **Warning** : Slack (#alerts)
- **Info** : dashboard

### 7.5 Tableaux de bord
- **Ops** : Grafana (infra)
- **Business** : console admin Kènè
- **Status page** publique : status.kene.app

---

## 8. INTERNATIONALISATION

### 8.1 Multi-langues
- **Architecture** : i18next (web), react-i18next (mobile)
- **Fichiers de traduction** : JSON par langue
- **Langues Phase 1** : français (CI, SN)
- **Phase 2** : + anglais (préparation Nigeria, Ghana)
- **Phase 4** : + wolof, bambara, swahili

### 8.2 Multi-devises
- **XOF** (UEMOA) — Phase 1
- **XAF** (CEMAC) — Phase 2
- **NGN, GHS, KES, UGX, TZS, RWF, ZAR** — Phase 3-4
- **Conversion** : taux quotidien (Banque centrale)
- **Wallet multi-devises** : Phase 3+

### 8.3 Localisation
- **Dates** : format JJ/MM/AAAA
- **Nombres** : séparateur milliers espace, décimales virgule
- **Devises** : symbole local (FCFA pour XOF/XAF)
- **Calendrier** : jours fériés par pays
- **Fuseaux** : GMT (CI, SN, ML, BF), GMT+1 (Cameroun)

### 8.4 Timezones
- CI, SN, ML, BF, BJ, TG, GN : GMT+0
- Cameroun, Gabon, Congo, Tchad : GMT+1
- Nigeria, Ghana : GMT+0/+1
- Kenya, Ouganda, Tanzanie, Rwanda : GMT+3

---

## 9. ACCESSIBILITÉ (a11y)

### 9.1 Standards
- **WCAG 2.1 niveau AA**
- **Section 508** (référence)
- **RGAA 4.1** (référence francophone)

### 9.2 Mise en œuvre
- **HTML sémantique** : main, nav, header, footer, article, section
- **ARIA** : labels, descriptions, live regions
- **Contrastes** : validés (palette Kènè testée)
- **Navigation clavier** : focus visible, ordre logique
- **Taille texte** : rem (scalable)
- **Pas de couleur seule** : icônes + texte
- **Sous-titres** : vidéos tutoriels
- **Transcriptions** : contenus audio

### 9.3 Tests
- **Automatisés** : axe-core en CI
- **Manuels** : navigation clavier, lecteur écran (NVDA, VoiceOver)
- **Audit** : annuel

---

## 10. ÉVOLUTIVITÉ & MAINTENABILITÉ

### 10.1 Architecture
- **Modulaire** : microservices découplés
- **API versionnée** : /v1, /v2
- **Backward compatible** : 6 mois dépréciation
- **Feature flags** : LaunchDarkly ou interne

### 10.2 Code
- **TypeScript strict** : partout
- **ESLint + Prettier** : standards
- **Tests** : unitaires (Vitest), intégration, e2e (Playwright)
- **Coverage** : > 70% critique, > 50% global
- **Code review** : obligatoire (PR + 1 approbateur)
- **Documentation** : JSDoc, OpenAPI

### 10.3 CI/CD
- **GitHub Actions** : lint, test, build, deploy
- **Environnements** : dev → staging → prod
- **Déploiement auto** : staging après merge
- **Déploiement prod** : manuel (approbation)
- **Rollback** : < 5 min

### 10.4 Monitoring qualité
- **Sentry** : erreurs frontend + backend
- **Métriques qualité** : temps moyen résolution bug, dette technique
- **Reviews** : trimestriels

---

## 11. COÛTS & OPTIMISATION

### 11.1 Optimisation cloud
- **Reserved instances** : pour charges prévisibles
- **Spot instances** : pour batchs IA
- **Auto-scaling** : coûts à la demande
- **Lifecycle S3** : transition Intelligent-Tiering
- **CloudFront** : cache agressif

### 11.2 Optimisation mobile
- **Bundle splitting** : lazy routes
- **Images** : WebP/AVIF, responsive
- **Fonts** : subset (latin, diacritiques africains)
- **Requêtes** : pagination, cache

### 11.3 Budget indicatif mensuel (MVP 1A, 100 tenants)
| Poste | Estimation |
|---|---|
| Compute (API + workers) | ~500 $ |
| Base de données (RDS) | ~300 $ |
| Redis | ~100 $ |
| Stockage S3 + CDN | ~150 $ |
| IA inference (GPU) | ~400 $ |
| SMS (rappels) | ~200 $ |
| Email | ~50 $ |
| Monitoring | ~100 $ |
| **Total** | **~1 800 $/mois** |

---

## 12. DOCUMENTATION

### 12.1 Documentation technique
- **README** par service
- **Architecture** : diagrammes (C4 model)
- **API** : OpenAPI/Swagger
- **DB** : schéma Prisma + MCD
- **ADR** (Architecture Decision Records)

### 12.2 Documentation utilisateur
- **Help center** : articles par fonctionnalité
- **Tutoriels vidéo** : onboarding, modules clés
- **FAQ** : par persona
- **In-app tooltips** : première utilisation

### 12.3 Documentation légale
- **CGU** : conditions générales utilisation
- **CGV** : conditions générales vente
- **Politique confidentialité** : par pays
- **Mentions légales**
- **DPA** : accord traitement données

---

*Fin de la Partie 4. Les exigences non-fonctionnelles définissent le cadre qualité pour la construction.*
