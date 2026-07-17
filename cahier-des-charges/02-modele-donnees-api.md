# Partie 2 — Modèle de Données & API

> Schéma entité-relation + spécifications API REST
> Périmètre : MVP Phase 1A (🔴) + 1B (🟡)

---

## 1. ARCHITECTURE DE DONNÉES

### 1.1 Stratégie multi-tenant
- **1 tenant = 1 entreprise** (institut/spa/chaîne)
- Isolation par **Row-Level Security (RLS) PostgreSQL** : colonne `tenant_id` sur toutes tables métier
- Tables globales (sans tenant) : utilisateurs plateforme, pays, devises, barèmes, opérateurs MoMo

### 1.2 Conventions
- Préfixe tables : `kene_` (ex : `kene_clients`)
- Clés primaires : UUID v4
- Horodatage : `created_at`, `updated_at`, `deleted_at` (soft delete)
- Audit : `created_by`, `updated_by`
- Montants : `DECIMAL(14,2)` en devise du tenant
- Devise stockée : `currency` (XOF, XAF, NGN…)

---

## 2. SCHÉMA ENTITÉ-RELATION

### 2.1 Tables globales (plateforme)

#### `kene_countries`
| Champ | Type | Description |
|---|---|---|
| id | UUID PK | |
| code | VARCHAR(2) | CI, SN, ML… (ISO 3166) |
| name | VARCHAR(100) | |
| currency_code | VARCHAR(3) | XOF, XAF… |
| language | VARCHAR(5) | fr-CI, fr-SN, en-NG |
| ohada | BOOLEAN | true si pays OHADA |
| active | BOOLEAN | |
| config | JSONB | barèmes fiscaux, cotisations, params |

#### `kene_currencies`
| Champ | Type | Description |
|---|---|---|
| code | VARCHAR(3) PK | XOF |
| name | VARCHAR(50) | Franc CFA |
| symbol | VARCHAR(5) | FCFA |
| decimals | INT | 0 |

#### `kene_momo_operators`
| Champ | Type | Description |
|---|---|---|
| id | UUID PK | |
| name | VARCHAR(50) | Wave, Orange Money, MTN MoMo… |
| code | VARCHAR(20) | WAVE, ORANGE, MTN… |
| countries | JSONB | liste codes pays |
| api_base_url | VARCHAR | |
| api_credentials | JSONB (chiffré) | clés API par tenant |
| commission_rate | DECIMAL(5,4) | |
| active | BOOLEAN | |

#### `kene_users` (comptes plateforme, multi-rôles)
| Champ | Type | Description |
|---|---|---|
| id | UUID PK | |
| phone | VARCHAR(20) UNIQUE | format E.164 |
| email | VARCHAR(255) | optionnel |
| password_hash | VARCHAR | null pour OTP-only |
| two_factor_enabled | BOOLEAN | |
| two_factor_secret | VARCHAR | TOTP |
| first_name | VARCHAR(100) | |
| last_name | VARCHAR(100) | |
| avatar_url | VARCHAR | |
| language | VARCHAR(5) | défaut fr-CI |
| status | ENUM | active, suspended, deleted |
| last_login_at | TIMESTAMP | |
| created_at | TIMESTAMP | |

#### `kene_user_roles` (relation user ↔ tenant ↔ rôle)
| Champ | Type |
|---|---|
| user_id | UUID FK |
| tenant_id | UUID FK |
| role | ENUM (gerant, praticienne, caissier, comptable, rh, magasinier) |
| permissions | JSONB |

### 2.2 Tables tenant (entreprises)

#### `kene_tenants`
| Champ | Type | Description |
|---|---|---|
| id | UUID PK | |
| name | VARCHAR(200) | raison sociale |
| legal_name | VARCHAR(200) | |
| type | ENUM | institut, spa, dermo, massage, esthetique, chaine |
| country_code | VARCHAR(2) FK | |
| currency_code | VARCHAR(3) FK | |
| rccm | VARCHAR(50) | |
| tax_id | VARCHAR(50) | n° contribuable |
| vat_rate | DECIMAL(5,4) | 0.18 CI/SN |
| address | JSONB | rue, ville, code postal, géo |
| subscription_tier | ENUM | essentiel, pro, chaine |
| subscription_status | ENUM | active, past_due, suspended |
| created_at | TIMESTAMP | |
| active | BOOLEAN | |

#### `kene_sites` (sites d'un tenant multi-sites)
| Champ | Type |
|---|---|
| id | UUID PK |
| tenant_id | UUID FK |
| name | VARCHAR(100) |
| address | JSONB |
| geo_point | GEOGRAPHY(Point) |
| phone | VARCHAR(20) |
| active | BOOLEAN |

#### `kene_employees` (employés du tenant)
| Champ | Type |
|---|---|
| id | UUID PK |
| tenant_id | UUID FK |
| user_id | UUID FK (nullable) |
| site_id | UUID FK |
| first_name, last_name | VARCHAR |
| birth_date | DATE |
| gender | ENUM |
| phone, email | VARCHAR |
| address | JSONB |
| hire_date | DATE |
| contract_type | ENUM (CDI, CDD, essai) |
| contract_end_date | DATE |
| position | VARCHAR |
| base_salary | DECIMAL(12,2) |
| documents | JSONB (URLs) |
| status | ENUM (active, leave, terminated) |
| rib_momo | VARCHAR |

#### `kene_clients` (clientes du tenant)
| Champ | Type |
|---|---|
| id | UUID PK |
| tenant_id | UUID FK |
| user_id | UUID FK (nullable, si cliente app) |
| first_name, last_name | VARCHAR |
| phone | VARCHAR |
| email | VARCHAR |
| birth_date | DATE |
| gender | ENUM |
| fitzpatrick_type | ENUM (I-VI) |
| skin_type | ENUM (grasse, seche, mixte, normale, sensible) |
| allergies | JSONB |
| treatments | JSONB |
| consent_health_data | BOOLEAN |
| consent_at | TIMESTAMP |
| notes | TEXT |
| rfm_score | JSONB |
| created_at | TIMESTAMP |

#### `kene_services` (catalogue soins)
| Champ | Type |
|---|---|
| id | UUID PK |
| tenant_id | UUID FK |
| name | VARCHAR(200) |
| description | TEXT |
| category | ENUM |
| duration_min | INT |
| price | DECIMAL(12,2) |
| vat_rate | DECIMAL(5,4) |
| resources_required | JSONB (salles, appareils) |
| commission_rate | DECIMAL(5,4) |
| active | BOOLEAN |

#### `kene_resources` (cabines, appareils)
| Champ | Type |
|---|---|
| id | UUID PK |
| tenant_id | UUID FK |
| site_id | UUID FK |
| name | VARCHAR(100) |
| type | ENUM (cabine, appareil, salon) |
| active | BOOLEAN |

#### `kene_appointments` (RDV)
| Champ | Type |
|---|---|
| id | UUID PK |
| tenant_id | UUID FK |
| client_id | UUID FK |
| site_id | UUID FK |
| service_id | UUID FK |
| employee_id | UUID FK |
| resource_id | UUID FK (nullable) |
| start_at | TIMESTAMP |
| end_at | TIMESTAMP |
| status | ENUM (pending, confirmed, in_progress, completed, cancelled, no_show) |
| amount | DECIMAL(12,2) |
| deposit_amount | DECIMAL(12,2) |
| deposit_payment_id | UUID FK |
| source | ENUM (online, walk_in, phone) |
| notes | TEXT |
| created_at | TIMESTAMP |

#### `kene_products` (catalogue produits)
| Champ | Type |
|---|---|
| id | UUID PK |
| tenant_id | UUID FK |
| sku | VARCHAR(50) |
| name | VARCHAR(200) |
| description | TEXT |
| category | VARCHAR(50) |
| botanical | VARCHAR(50) (karité, baobab…) |
| purchase_price | DECIMAL(12,2) |
| sale_price | DECIMAL(12,2) |
| vat_rate | DECIMAL(5,4) |
| supplier_id | UUID FK |
| threshold | INT |
| active | BOOLEAN |

#### `kene_inventory_items` (stock par site)
| Champ | Type |
|---|---|
| id | UUID PK |
| tenant_id | UUID FK |
| site_id | UUID FK |
| product_id | UUID FK |
| quantity | INT |
| lot_number | VARCHAR |
| expiry_date | DATE |
| updated_at | TIMESTAMP |

#### `kene_inventory_movements`
| Champ | Type |
|---|---|
| id | UUID PK |
| tenant_id | UUID FK |
| site_id | UUID FK |
| product_id | UUID FK |
| movement_type | ENUM (purchase, sale, loss, transfer, adjustment) |
| quantity | INT (signé) |
| lot_number | VARCHAR |
| reference_id | UUID (vente, achat…) |
| reason | VARCHAR |
| created_at | TIMESTAMP |

#### `kene_sales` (ventes caisse)
| Champ | Type |
|---|---|
| id | UUID PK |
| tenant_id | UUID FK |
| site_id | UUID FK |
| invoice_number | VARCHAR(50) séquentiel |
| client_id | UUID FK (nullable) |
| cashier_id | UUID FK |
| sale_date | TIMESTAMP |
| items | JSONB (lignes : service/product, qty, price, vat) |
| subtotal | DECIMAL(12,2) |
| discount_amount | DECIMAL(12,2) |
| vat_amount | DECIMAL(12,2) |
| total | DECIMAL(12,2) |
| status | ENUM (pending, paid, refunded, partial) |
| appointment_id | UUID FK (nullable) |
| created_at | TIMESTAMP |

#### `kene_payments` (paiements)
| Champ | Type |
|---|---|
| id | UUID PK |
| tenant_id | UUID FK |
| sale_id | UUID FK (nullable) |
| appointment_id | UUID FK (nullable) |
| amount | DECIMAL(12,2) |
| method | ENUM (wave, orange, mtn, moov, cash, card, check, wallet) |
| momo_operator_id | UUID FK (nullable) |
| momo_transaction_id | VARCHAR (référence opérateur) |
| status | ENUM (pending, confirmed, failed, refunded) |
| reconciled | BOOLEAN |
| paid_at | TIMESTAMP |
| metadata | JSONB |

#### `kene_diagnoses` (diagnostics IA)
| Champ | Type |
|---|---|
| id | UUID PK |
| client_id | UUID FK (user plateforme, pas tenant) |
| tenant_id | UUID FK (nullable, si fait chez institut) |
| photos | JSONB (URLs par zone) |
| score_global | INT (0-100) |
| sub_scores | JSONB (hydratation, eclat…) |
| indicators | JSONB (PIH: severity, acne: severity…) |
| heatmap_url | VARCHAR |
| recommendations | JSONB |
| dermato_referral | BOOLEAN |
| referral_reason | TEXT |
| model_version | VARCHAR |
| created_at | TIMESTAMP |

#### `kene_wallets` (wallet Kènè)
| Champ | Type |
|---|---|
| id | UUID PK |
| user_id | UUID FK |
| balance | DECIMAL(12,2) |
| currency_code | VARCHAR(3) |
| created_at | TIMESTAMP |

#### `kene_wallet_transactions`
| Champ | Type |
|---|---|
| id | UUID PK |
| wallet_id | UUID FK |
| type | ENUM (credit, debit) |
| amount | DECIMAL(12,2) |
| reason | ENUM (cashback, referral, topup, payment, refund) |
| reference_id | UUID |
| created_at | TIMESTAMP |

### 2.3 Tables paie & compta (MVP 1B)

#### `kene_pay_periods`
| Champ | Type |
|---|---|
| id | UUID PK |
| tenant_id | UUID FK |
| period_month | INT |
| period_year | INT |
| status | ENUM (open, processing, closed) |
| closed_at | TIMESTAMP |

#### `kene_payslips` (bulletins de paie)
| Champ | Type |
|---|---|
| id | UUID PK |
| tenant_id | UUID FK |
| employee_id | UUID FK |
| pay_period_id | UUID FK |
| gross_salary | DECIMAL(12,2) |
| bonuses | JSONB |
| deductions | JSONB |
| cnps_employee | DECIMAL(12,2) |
| cnps_employer | DECIMAL(12,2) |
| igr_tax | DECIMAL(12,2) |
| net_pay | DECIMAL(12,2) |
| pdf_url | VARCHAR |
| created_at | TIMESTAMP |

#### `kene_accounting_entries` (écritures comptables)
| Champ | Type |
|---|---|
| id | UUID PK |
| tenant_id | UUID FK |
| entry_number | VARCHAR séquentiel |
| journal | ENUM (ventes, achats, banque, caisse, od) |
| entry_date | DATE |
| reference | VARCHAR |
| description | TEXT |
| lines | JSONB (compte, debit, credit) |
| status | ENUM (draft, posted) |
| created_at | TIMESTAMP |

#### `kene_chart_of_accounts` (plan comptable par tenant)
| Champ | Type |
|---|---|
| id | UUID PK |
| tenant_id | UUID FK |
| account_number | VARCHAR(20) |
| name | VARCHAR(200) |
| class | INT (1-8) |
| type | ENUM (actif, passif, charge, produit) |
| parent_id | UUID FK |

### 2.4 Tables marketing (MVP 1B)

#### `kene_campaigns`, `kene_promo_codes`, `kene_gift_cards`, `kene_loyalty_points`, `kene_referrals`
(Détails omis pour brièveté — structure standard)

### 2.5 Tables audit & conformité

#### `kene_audit_logs`
| Champ | Type |
|---|---|
| id | UUID PK |
| tenant_id | UUID FK (nullable) |
| user_id | UUID FK |
| action | VARCHAR |
| entity_type | VARCHAR |
| entity_id | UUID |
| changes | JSONB |
| ip_address | INET |
| user_agent | VARCHAR |
| created_at | TIMESTAMP |

#### `kene_consents`
| Champ | Type |
|---|---|
| id | UUID PK |
| user_id | UUID FK |
| consent_type | ENUM (health_data, marketing, third_party) |
| granted | BOOLEAN |
| granted_at | TIMESTAMP |
| revoked_at | TIMESTAMP |
| text_version | VARCHAR |

---

## 3. SPÉCIFICATIONS API

### 3.1 Conventions
- Base URL : `https://api.kene.app/v1`
- Auth : `Authorization: Bearer <JWT>` (sauf routes publiques)
- Format : JSON
- Pagination : `?page=1&page_size=20` → `{ data: [], total, page, page_size }`
- Erreurs : `{ error: { code, message, details } }`, codes HTTP standards
- Rate limit : 100 req/min par token (sauf endpoints lourds)
- Idempotence : header `Idempotency-Key` pour POST paiements

### 3.2 Auth & compte

#### `POST /auth/otp/request`
Demande un code OTP
```json
Request: { "phone": "+2250700000000" }
Response: { "otp_request_id": "uuid", "expires_in": 300 }
```

#### `POST /auth/otp/verify`
Vérifie l'OTP et connecte
```json
Request: { "otp_request_id": "uuid", "code": "123456", "device_id": "..." }
Response: { "access_token": "...", "refresh_token": "...", "user": {...}, "is_new": true }
```

#### `POST /auth/login` (Pro, mot de passe)
```json
Request: { "email_or_phone": "...", "password": "...", "otp_code": "..." }
Response: { "access_token": "...", "user": {...}, "tenants": [...] }
```

#### `POST /auth/refresh`
#### `POST /auth/logout`
#### `GET /me` — profil courant
#### `PATCH /me` — mise à jour profil
#### `POST /me/consents` — enregistrement consentement
#### `DELETE /me` — droit à l'oubli (anonymisation)

### 3.3 Diagnostic IA

#### `POST /diagnoses` 🔴
Lance un diagnostic
```json
Request: {
  "photos": [
    { "zone": "face_full", "url": "s3://..." },
    { "zone": "forehead", "url": "s3://..." }
  ],
  "client_profile": { "fitzpatrick": "V", "age_range": "25-35" }
}
Response: { "diagnosis_id": "uuid", "status": "processing" }
```
+ Webhook `POST /webhooks/diagnosis-completed` quand prêt

#### `GET /diagnoses/:id` 🔴
```json
Response: {
  "id": "uuid",
  "score_global": 72,
  "sub_scores": { "hydratation": 65, "eclat": 80, ... },
  "indicators": [
    { "name": "PIH", "severity": 2, "zones": [...] },
    ...
  ],
  "heatmap_url": "...",
  "recommendations": { "routine": [...], "products": [...], "services": [...] },
  "dermato_referral": false,
  "created_at": "..."
}
```

#### `GET /diagnoses` 🔴 — historique paginé
#### `GET /diagnoses/:id/compare?with=:other_id` 🟡 — comparaison avant/après

### 3.4 Médias (upload photos)

#### `POST /media/upload-url` 🔴
Génère une URL S3 pré-signée
```json
Request: { "filename": "selfie.jpg", "content_type": "image/jpeg", "purpose": "diagnosis" }
Response: { "upload_url": "https://...", "file_url": "https://..." }
```

### 3.5 Clientes (app cliente)

#### `GET /institutes` 🔴
Recherche instituts
```json
Query: ?lat=...&lng=...&radius=10&specialty=dermo&page=1
Response: { "data": [{ "id": "...", "name": "...", "distance_km": 3.2, "rating": 4.7, "specialties": [...] }] }
```

#### `GET /institutes/:id` 🔴 — fiche détaillée
#### `GET /institutes/:id/services` 🔴 — soins
#### `GET /institutes/:id/availability` 🔴
```json
Query: ?service_id=...&date=2025-01-15
Response: { "slots": [{ "start": "2025-01-15T09:00:00", "end": "...", "employee_id": "..." }] }
```

#### `POST /appointments` 🔴
Crée un RDV
```json
Request: {
  "institute_id": "...",
  "service_id": "...",
  "employee_id": "...",
  "start_at": "2025-01-15T09:00:00",
  "deposit_amount": 5000,
  "payment_method": "wave"
}
Response: { "appointment_id": "...", "payment": { "id": "...", "status": "pending", "momo_init_url": "..." } }
```

#### `GET /appointments` 🔴 — RDV de la cliente
#### `POST /appointments/:id/reschedule` 🔴
#### `POST /appointments/:id/cancel` 🔴

### 3.6 Boutique

#### `GET /products` 🔴
#### `GET /products/:id` 🔴
#### `POST /cart` 🔴 — gestion panier
#### `POST /cart/checkout` 🔴
```json
Request: { "items": [...], "delivery": { "type": "pickup"|"delivery", "address": ... }, "payment_method": "orange" }
Response: { "order_id": "...", "payment": {...} }
```
#### `GET /orders` 🔴
#### `GET /orders/:id` 🔴

### 3.7 Paiements

#### `POST /payments/initiate` 🔴
```json
Request: {
  "amount": 15000,
  "currency": "XOF",
  "method": "wave",
  "reference_type": "appointment|sale|order|subscription",
  "reference_id": "uuid"
}
Response: { "payment_id": "uuid", "status": "pending", "momo_redirect_url": "https://...", "expires_at": "..." }
```

#### `POST /webhooks/momo/:operator` 🔴
Callback opérateur (Wave, Orange…)
```json
Request (varie par opérateur): { "transaction_id": "...", "status": "success", "amount": 15000 }
Response: 200 OK
```
→ Met à jour `kene_payments`, déclenche confirmation RDV/vente

#### `GET /payments/:id` 🔴 — statut
#### `POST /payments/:id/refund` 🟡 — remboursement (gérant)

### 3.8 Wallet

#### `GET /wallet` 🔴 — solde + historique
#### `POST /wallet/topup` 🔴 — approvisionnement par MoMo
#### `POST /wallet/pay` 🔴 — payer avec wallet

### 3.9 App Pro — Agenda

#### `GET /pro/agenda` 🔴
```json
Query: ?site_id=...&date=2025-01-15&view=day
Response: { "employees": [{ "id": "...", "appointments": [...] }] }
```
#### `POST /pro/appointments` 🔴 — création manuelle
#### `PATCH /pro/appointments/:id` 🔴
#### `DELETE /pro/appointments/:id` 🔴

### 3.10 App Pro — Caisse

#### `POST /pro/sales` 🔴 — encaissement
```json
Request: {
  "site_id": "...",
  "items": [{ "type": "service", "id": "...", "quantity": 1 }, { "type": "product", "id": "...", "quantity": 2 }],
  "client_id": "...",
  "discount": { "type": "amount", "value": 1000 },
  "payments": [{ "method": "wave", "amount": 15000 }]
}
Response: { "sale_id": "...", "invoice_number": "...", "payments": [...], "receipt_pdf_url": "..." }
```
#### `GET /pro/sales` 🔴 — historique (brouillard)
#### `GET /pro/sales/:id` 🔴
#### `POST /pro/cash-registers/close` 🔴 — clôture Z
#### `GET /pro/payments/reconciliation` 🔴 — réconciliation MoMo

### 3.11 App Pro — CRM

#### `GET /pro/clients` 🔴 — liste paginée
#### `GET /pro/clients/:id` 🔴 — fiche enrichie
#### `POST /pro/clients` 🔴 — création rapide
#### `PATCH /pro/clients/:id` 🔴
#### `GET /pro/clients/:id/diagnoses` 🔴 — historique diagnostics
#### `GET /pro/clients/:id/history` 🔴 — soins + achats
#### `POST /pro/clients/:id/notes` 🔴

### 3.12 App Pro — Stock

#### `GET /pro/products` 🔴
#### `POST /pro/products` 🔴
#### `PATCH /pro/products/:id` 🔴
#### `GET /pro/inventory` 🔴 — stock par site
#### `POST /pro/inventory/movements` 🔴 — mouvement (entrée, sortie, perte, transfert)
#### `POST /pro/inventory/count` 🔴 — inventaire
#### `GET /pro/inventory/alerts` 🔴 — produits sous seuil

### 3.13 App Pro — RH & Paie (MVP 1B)

#### `GET /pro/employees` 🟡
#### `POST /pro/employees` 🟡
#### `POST /pro/employees/:id/contracts` 🟡
#### `POST /pro/time-tracking/clock-in` 🟡 — pointage
#### `POST /pro/time-tracking/clock-out` 🟡
#### `POST /pro/leave-requests` 🟡
#### `POST /pro/payroll/run` 🟡 — génère paie période
```json
Request: { "period_month": 1, "period_year": 2025, "employee_ids": [...] }
Response: { "payslips": [{ "id": "...", "employee_id": "...", "net_pay": 250000 }] }
```
#### `GET /pro/payroll/payslips/:id` 🟡 — bulletin PDF
#### `POST /pro/payroll/declaration/cnps` 🟡 — export e-CNPS
#### `POST /pro/payroll/declaration/ipm` 🟡 — export IPM SN

### 3.14 App Pro — Compta (MVP 1B)

#### `GET /pro/accounting/chart` 🟡 — plan comptable
#### `POST /pro/accounting/entries` 🟡 — saisie manuelle
#### `GET /pro/accounting/entries` 🟡
#### `GET /pro/accounting/ledger` 🟡 — grand livre
#### `GET /pro/accounting/balance` 🟡 — balance
#### `GET /pro/accounting/vat` 🟡 — TVA
#### `POST /pro/accounting/vat/declaration` 🟡
#### `GET /pro/accounting/financial-statements` 🟡 — bilan + compte de résultat
#### `POST /pro/accounting/bank-reconciliation` 🟡
#### `GET /pro/accounting/fec-export` 🟡 — export FEC

### 3.15 App Pro — Marketing (MVP 1B)

#### `POST /pro/campaigns` 🟡 — campagne SMS/WhatsApp
#### `POST /pro/promo-codes` 🟡
#### `POST /pro/gift-cards` 🟡
#### `GET /pro/loyalty/points` 🟡

### 3.16 App Pro — Reporting

#### `GET /pro/reports/dashboard` 🔴 — KPIs temps réel
#### `GET /pro/reports/revenue` 🔴 — CA par période
#### `GET /pro/reports/employees` 🟡
#### `GET /pro/reports/clients` 🟡
#### `GET /pro/reports/inventory` 🟡
#### `GET /pro/reports/accounting-export` 🟡

### 3.17 Console Admin

#### `GET /admin/tenants` 🔴 — liste entreprises
#### `POST /admin/tenants/:id/approve` 🔴 — validation KYB
#### `PATCH /admin/tenants/:id` 🔴
#### `GET /admin/subscriptions` 🔴
#### `GET /admin/metrics` 🔴
#### `GET /admin/ai/supervision` 🔴 — monitoring modèle
#### `GET /admin/audit-logs` 🔴
#### `GET /admin/support/tickets` 🟡

### 3.18 Notifications

#### `POST /notifications/send` (interne)
#### `GET /notifications` 🔴 — liste
#### `PATCH /notifications/:id/read` 🔴
#### `POST /devices` 🔴 — enregistrement push token (FCM)

### 3.19 Webhooks entrants (externes)

| Webhook | Source | Usage |
|---|---|---|
| `POST /webhooks/momo/wave` | Wave | Confirmation paiement |
| `POST /webhooks/momo/orange` | Orange Money | Confirmation paiement |
| `POST /webhooks/momo/mtn` | MTN MoMo | Confirmation paiement |
| `POST /webhooks/diagnosis-completed` | Service IA | Diagnostic prêt |
| `POST /webhooks/sms-delivery` | Fournisseur SMS | Statut envoi |

---

## 4. ÉVÉNEMENTS TEMPS RÉEL (WebSocket / Socket.io)

### 4.1 Namespaces
- `/client` — app cliente (notifications RDV, paiements, messages)
- `/pro` — app pro (nouveaux RDV, paiements caisse, alertes)
- `/admin` — console (métriques temps réel)

### 4.2 Événements clés

| Événement | Direction | Payload |
|---|---|---|
| `appointment.created` | → client, pro | appointment |
| `appointment.reminder` | → client | appointment |
| `payment.confirmed` | → client, pro | payment |
| `payment.failed` | → client, pro | payment |
| `diagnosis.completed` | → client | diagnosis |
| `sale.recorded` | → pro | sale |
| `cash.alert` | → pro | alert |
| `stock.low` | → pro | product |
| `message.received` | → client, pro | message |
| `metrics.update` | → admin | metrics |

---

## 5. SÉCURITÉ API

### 5.1 Authentification
- JWT court (15 min) + refresh token (30 jours, httpOnly cookie)
- 2FA obligatoire pour rôles sensibles (gérant, comptable)
- Détection brute force (lockout 15 min après 5 essais)

### 5.2 Autorisation
- RBAC par tenant + rôle
- Vérification `tenant_id` à chaque requête
- Permissions granulaires par module

### 5.3 Protection
- Rate limiting : 100 req/min par token, 1000 req/h par IP
- WAF (Web Application Firewall)
- Validation stricte des entrées (Zod)
- Sanitization SQL (Prisma paramétré)
- CORS strict
- CSP headers
- HSTS, X-Frame-Options

### 5.4 Données sensibles
- Chiffrement au repos (AES-256) pour : données santé, RIB, documents employés
- Chiffrement en transit (TLS 1.3)
- Tokens MoMo chiffrés en base
- Logs sans données sensibles (masquage)

---

## 6. VERSIONNING & COMPATIBILITÉ

- Versioning URL : `/v1`, `/v2`…
- Dépréciation : 6 mois de chevauchement
- Changelog public
- Backward compatibility garantie dans une version majeure

---

*Fin de la Partie 2. Le schéma DB complet (script Prisma) sera généré en phase de construction à partir de cette spécification.*
