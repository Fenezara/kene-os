# Partie 9 — Plan de Test & Qualité

> Stratégie de test, scénarios, automatisation, charge, sécurité
> Garantit la qualité avant mise en production

---

## 1. STRATÉGIE DE TEST GLOBALE

### 1.1 Pyramide de tests

```
                    ┌─────────────┐
                    │   E2E (5%)   │  ← Playwright (parcours critiques)
                    └─────────────┘
                  ┌───────────────────┐
                  │ Intégration (25%)  │  ← API + DB (Vitest + Supertest)
                  └───────────────────┘
              ┌─────────────────────────────┐
              │   Unitaires (70%)            │  ← Vitest (fonctions pures)
              └─────────────────────────────┘
```

### 1.2 Couverture cible

| Niveau | Couverture cible |
|---|---|
| **Critique** (auth, paiement, paie, IA) | ≥ 85% |
| **Important** (RDV, caisse, stock) | ≥ 75% |
| **Secondaire** (UI, marketing) | ≥ 60% |
| **Global** | ≥ 70% |

### 1.3 Outils

| Type | Outil |
|---|---|
| Tests unitaires | Vitest |
| Tests intégration | Vitest + Supertest |
| Tests E2E web | Playwright |
| Tests E2E mobile | Detox |
| Tests charge | k6 |
| Tests sécurité | OWASP ZAP, Snyk |
| Tests accessibilité | axe-core |
| Coverage | Istanbul/c8 |
| CI/CD | GitHub Actions |

---

## 2. TESTS UNITAIRES

### 2.1 Modules critiques à tester

#### Moteur de paie
```typescript
describe('calculer_igr_ci', () => {
  it('retourne 0 si salaire ≤ 75 000', () => {
    expect(calculerIgrCI(50000)).toBe(0)
    expect(calculerIgrCI(75000)).toBe(0)
  })
  
  it('calcule correctement la 2e tranche (16%)', () => {
    expect(calculerIgrCI(100000)).toBe((100000 - 75000) * 0.16) // 4000
  })
  
  it('calcule correctement la 3e tranche (21%)', () => {
    const expected = (240000 - 75000) * 0.16 + (500000 - 240000) * 0.21
    expect(calculerIgrCI(500000)).toBe(expected)
  })
  
  it('calcule correctement la tranche maximale (36%)', () => {
    const salaire = 10_000_000
    const expected = (240000 - 75000) * 0.16 
                   + (800000 - 240000) * 0.21 
                   + (2400000 - 800000) * 0.24 
                   + (8000000 - 2400000) * 0.28 
                   + (10000000 - 8000000) * 0.36
    expect(calculerIgrCI(salaire)).toBe(expected)
  })
})

describe('calculer_cnps_ci', () => {
  it('calcule les cotisations avec plafond pension', () => {
    const salaire = 4_000_000 // > plafond 3 375 000
    const result = calculerCNPSCI(salaire)
    expect(result.pension_employeur).toBe(3375000 * 0.077)
    expect(result.pension_salarie).toBe(3375000 * 0.063)
  })
  
  it('calcule les prestations familiales avec plafond 70 000', () => {
    const result = calculerCNPSCI(200000)
    expect(result.prestations_employeur).toBe(70000 * 0.05)
    expect(result.maternite_employeur).toBe(70000 * 0.0075)
  })
})
```

#### Scoring RFM
```typescript
describe('calculer_rfm', () => {
  it('classifie en Champion', () => {
    const client = { 
      derniereVisite: 10, 
      nbVisites12m: 15, 
      ca12m: 800000 
    }
    const rfm = calculerRFM(client)
    expect(rfm.R).toBe(5)
    expect(rfm.F).toBe(5)
    expect(rfm.M).toBe(5)
    expect(rfm.segment).toBe('Champion')
  })
  
  it('classifie en Perdu', () => {
    const client = { 
      derniereVisite: 300, 
      nbVisites12m: 1, 
      ca12m: 20000 
    }
    const rfm = calculerRFM(client)
    expect(rfm.segment).toBe('Perdu')
  })
})
```

#### Politique d'annulation
```typescript
describe('politique_annulation', () => {
  it('rembourse 100% si > 72h', () => {
    const rdv = { start_at: maintenant() + 80 * 3600 * 1000 }
    expect(calculerRemboursement(rdv, 'client')).toBe(rdv.acompte * 1.0)
  })
  
  it('rembourse 30% si 2h-24h', () => {
    const rdv = { start_at: maintenant() + 10 * 3600 * 1000 }
    expect(calculerRemboursement(rdv, 'client')).toBe(rdv.acompte * 0.30)
  })
  
  it('rembourse 0% si < 2h (no-show)', () => {
    const rdv = { start_at: maintenant() + 1 * 3600 * 1000 }
    expect(calculerRemboursement(rdv, 'client')).toBe(0)
  })
})
```

### 2.2 Tests modèles IA

```python
def test_model_no_bias_fitzpatrick():
    """Le modèle ne doit pas être biaisé par carnation"""
    results_by_fitz = evaluate_by_subgroup(model, test_set, 'fitzpatrick')
    max_diff = max(results_by_fitz.values()) - min(results_by_fitz.values())
    assert max_diff < 0.05, f"Biais dépassé: {max_diff}"

def test_navi_recall_high():
    """Les nævi suspects doivent être détectés (sécurité patient)"""
    navi_cases = test_set.filter(indicator='navi', abcde_risk=True)
    recall = model.evaluate(navi_cases, metric='recall')
    assert recall >= 0.85, f"Recall nævi insuffisant: {recall}"
```

---

## 3. TESTS D'INTÉGRATION

### 3.1 Tests API (endpoints critiques)

#### Auth OTP
```typescript
describe('POST /auth/otp/request', () => {
  it('envoie un OTP pour un numéro valide', async () => {
    const res = await request(app)
      .post('/v1/auth/otp/request')
      .send({ phone: '+2250700000000' })
    
    expect(res.status).toBe(200)
    expect(res.body.otp_request_id).toBeDefined()
    expect(res.body.expires_in).toBe(300)
  })
  
  it('rejette un numéro invalide', async () => {
    const res = await request(app)
      .post('/v1/auth/otp/request')
      .send({ phone: 'invalid' })
    
    expect(res.status).toBe(400)
  })
  
  it('bloque après 5 requêtes en 1 minute (rate limit)', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post('/v1/auth/otp/request').send({ phone: '+2250700000000' })
    }
    const res = await request(app)
      .post('/v1/auth/otp/request')
      .send({ phone: '+2250700000000' })
    
    expect(res.status).toBe(429)
  })
})
```

#### Paiement Mobile Money
```typescript
describe('POST /payments/initiate (Wave)', () => {
  it('initie un paiement Wave valide', async () => {
    mockWaveAPI.success()
    
    const res = await request(app)
      .post('/v1/payments/initiate')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        amount: 15000,
        currency: 'XOF',
        method: 'wave',
        reference_type: 'appointment',
        reference_id: appointmentId
      })
    
    expect(res.status).toBe(200)
    expect(res.body.payment_id).toBeDefined()
    expect(res.body.momo_redirect_url).toContain('wave')
  })
  
  it('gère l\'idempotence (pas de double paiement)', async () => {
    const idempotencyKey = 'abc-123'
    
    const res1 = await request(app)
      .post('/v1/payments/initiate')
      .set('Idempotency-Key', idempotencyKey)
      .send({...})
    
    const res2 = await request(app)
      .post('/v1/payments/initiate')
      .set('Idempotency-Key', idempotencyKey)
      .send({...})
    
    expect(res2.body.payment_id).toBe(res1.body.payment_id)
  })
})
```

#### Webhook Mobile Money
```typescript
describe('POST /webhooks/momo/wave', () => {
  it('confirme un paiement après callback Wave', async () => {
    const payment = await createTestPayment({ status: 'pending' })
    
    const res = await request(app)
      .post('/v1/webhooks/momo/wave')
      .send({
        transaction_id: 'wave-tx-123',
        status: 'success',
        amount: 15000,
        reference: payment.id
      })
    
    expect(res.status).toBe(200)
    
    const updated = await getPayment(payment.id)
    expect(updated.status).toBe('confirmed')
    expect(updated.reconciled).toBe(true)
  })
  
  it('gère un webhook en double (idempotence)', async () => {
    const payment = await createTestPayment({ status: 'confirmed' })
    
    const res = await request(app)
      .post('/v1/webhooks/momo/wave')
      .send({ transaction_id: 'wave-tx-123', status: 'success', ... })
    
    expect(res.status).toBe(200) // Ne plante pas, ne change rien
  })
})
```

### 3.2 Tests multi-tenant (isolation)

```typescript
describe('Multi-tenant isolation', () => {
  it('tenant A ne peut pas voir les clients de tenant B', async () => {
    const clientB = await createTestClient({ tenant_id: tenantB.id })
    
    const res = await request(app)
      .get(`/v1/pro/clients/${clientB.id}`)
      .set('Authorization', `Bearer ${tenantAToken}`)
    
    expect(res.status).toBe(404)
  })
  
  it('RLS PostgreSQL empêche la fuite de données', async () => {
    const result = await prisma.$queryRaw`
      SET app.tenant_id = ${tenantA.id};
      SELECT COUNT(*) FROM kene_clients;
    `
    expect(result[0].count).toBe(tenantA.clients.length)
  })
})
```

---

## 4. TESTS E2E (PARCOURS CRITIQUES)

### 4.1 Parcours cliente complet

```typescript
test('Parcours : Diagnostic → Réservation → Paiement Wave', async ({ page }) => {
  // 1. Onboarding
  await page.goto('/')
  await page.click('text=Commencer')
  await page.fill('input[placeholder=Téléphone]', '0700000000')
  await page.click('text=Envoyer le code')
  
  // Mock OTP
  const otp = await getTestOTP('0700000000')
  await page.fill('input[placeholder=OTP]', otp)
  await page.click('text=Valider')
  
  // 2. Profil peau
  await page.click('text=Fitzpatrick V')
  await page.click('text=Mixte')
  await page.click('text=Continuer')
  
  // 3. Consentement
  await page.check('input[name=health_consent]')
  await page.fill('input[name=signature]', 'Mariam Test')
  await page.click('text=J\'accepte')
  
  // 4. Diagnostic
  await page.click('text=Commencer le diagnostic')
  // Mock camera with test image
  await mockCameraCapture(page, 'test-face-1.jpg')
  await page.click('text=Capturer')
  // ... 4 autres zones
  await page.waitForSelector('text=Analyse en cours')
  await page.waitForSelector('text=Votre score', { timeout: 60000 })
  
  // Vérifier score affiché
  const score = await page.textContent('[data-testid=score-global]')
  expect(parseInt(score)).toBeGreaterThanOrEqual(0)
  expect(parseInt(score)).toBeLessThanOrEqual(100)
  
  // 5. Réservation RDV
  await page.click('text=Réserver un soin')
  await page.click('[data-testid=institut-card]:first-child')
  await page.click('text=Première disponibilité')
  await page.click('[data-testid=slot]:first-child')
  await page.click('text=Continuer')
  
  // 6. Paiement Wave
  await page.click('text=Acompte 30%')
  await page.click('text=Wave')
  await page.click('text=Payer et réserver')
  
  // Mock Wave callback
  await simulateWaveCallback(paymentId, 'success')
  
  // Vérifier confirmation
  await page.waitForSelector('text=RDV confirmé')
  expect(await page.textContent('[data-testid=rdv-id]')).toBeDefined()
})
```

### 4.2 Parcours caisse Pro

```typescript
test('Parcours : Vente caisse + paiement Orange Money', async ({ page }) => {
  await loginAs(page, 'gerant@institut.ci', 'password')
  
  await page.click('text=Caisse')
  await page.click('[data-testid=service]:first-child') // Soin
  await page.click('[data-testid=product]:first-child') // Produit
  await page.click('text=Client walk-in')
  await page.click('text=Orange Money')
  await page.fill('input[phone]', '0700000000')
  await page.click('text=Encaisser')
  
  await simulateOrangeCallback(paymentId, 'success')
  
  await page.waitForSelector('text=Vente enregistrée')
  await page.click('text=Imprimer ticket')
  
  // Vérifier stock décrémenté
  const stock = await getProductStock(productId)
  expect(stock).toBe(initialStock - 1)
})
```

### 4.3 Parcours paie mensuelle

```typescript
test('Parcours : Génération paie CNPS CI', async ({ page }) => {
  await loginAs(page, 'rh@institut.ci', 'password')
  
  await page.click('text=Paie')
  await page.selectOption('select[name=month]', '1') // Janvier
  await page.selectOption('select[name=year]', '2025')
  await page.click('text=Générer la paie')
  
  await page.waitForSelector('text=Paie générée', { timeout: 30000 })
  
  // Vérifier bulletins
  const payslips = await getPayslips({ period: '2025-01' })
  expect(payslips.length).toBe(6) // 6 employés test
  
  // Vérifier calculs
  const firstPayslip = payslips[0]
  expect(firstPayslip.gross_salary).toBe(250000)
  expect(firstPayslip.cnps_employee).toBeCloseTo(250000 * 0.063)
  expect(firstPayslip.cnps_employer).toBeCloseTo(250000 * 0.077)
  expect(firstPayslip.igr_tax).toBeGreaterThan(0)
  expect(firstPayslip.net_pay).toBeGreaterThan(150000)
  
  // Export e-CNPS
  await page.click('text=Exporter déclaration CNPS')
  const xmlContent = await downloadFile(page)
  expect(xmlContent).toContain('<CNPS>')
  expect(xmlContent).toContain('<employee>')
})
```

---

## 5. TESTS DE CHARGE

### 5.1 Scénarios k6

#### Charge normale
```javascript
import http from 'k6/http'
import { check, sleep } from 'k6'

export let options = {
  stages: [
    { duration: '2m', target: 100 },  // ramp-up
    { duration: '5m', target: 100 },  // stable
    { duration: '2m', target: 500 },  // pic
    { duration: '5m', target: 500 },  // stable
    { duration: '2m', target: 0 },    // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1500'],
    http_req_failed: ['<1%'],
  },
}

export default function () {
  const res = http.get('https://api.kene.app/v1/institutes?lat=5.36&lng=-4.01')
  check(res, {
    'status 200': (r) => r.status === 200,
    'response < 500ms': (r) => r.timings.duration < 500,
  })
  sleep(1)
}
```

#### Diagnostic IA sous charge
```javascript
export let options = {
  stages: [
    { duration: '5m', target: 50 },   // 50 diagnostics simultanés
    { duration: '10m', target: 50 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'], // init < 5s
    'diagnosis_completion': ['p(95)<30000'], // < 30s
  },
}
```

### 5.2 Objectifs de charge (MVP 1A)

| Scénario | Cible | Seuil acceptable |
|---|---|---|
| Liste instituts | 500 req/s | p95 < 500ms |
| Création RDV | 100 req/s | p95 < 1s |
| Paiement MoMo | 50 req/s | p95 < 2s |
| Diagnostic IA | 50 simultanés | p95 < 30s |
| Dashboard Pro | 200 req/s | p95 < 1,5s |
| Rapport CA | 50 req/s | p95 < 2s |

### 5.3 Tests de stress

- **Pic** : 10x charge normale pendant 5 min → pas de crash
- **Sustained** : 2x charge normale pendant 1h → stable
- **Spike** : 50x charge instantanée → dégradation gracieuse

---

## 6. TESTS DE SÉCURITÉ

### 6.1 OWASP Top 10 — Checklist

| Risque | Test | Outil |
|---|---|---|
| **Injection** | Tentatives SQL/NoSQL sur inputs | SQLmap, OWASP ZAP |
| **Broken Auth** | Brute force, session fixation | Burp Suite |
| **Sensitive Data** | Vérifier chiffrement transit + repos | SSLyze, Nmap |
| **XXE** | Parser XML externaux | OWASP ZAP |
| **Broken Access** | Tests RBAC, IDOR | Tests automatisés |
| **Security Misconfig** | Headers, CORS | Mozilla Observatory |
| **XSS** | Payloads dans tous champs | OWASP ZAP |
| **Insecure Deserialization** | objets sérialisés | Burp Suite |
| **Known Vulns** | Dépendances | Snyk, Dependabot |
| **SSRF** | Requêtes serveur forgées | Tests manuels |

### 6.2 Tests d'intrusion

- **Périmètre** : API, web app, mobile app, infrastructure
- **Fréquence** : annuel (tiers externe) + trimestriel (interne)
- **Méthodologie** : OWASP Testing Guide
- **Reporting** : CVSS scores, plan de remédiation

### 6.3 Tests spécifiques Kènè

#### Isolation multi-tenant
```typescript
test('Aucune fuite de données entre tenants', async () => {
  const tenantA = await createTenant()
  const tenantB = await createTenant()
  
  const clientA = await createClient(tenantA.id, { name: 'Secret A' })
  
  // Tentative d'accès depuis tenant B
  const tokenB = await getToken(tenantB.users[0])
  
  const res = await request(app)
    .get(`/v1/pro/clients/${clientA.id}`)
    .set('Authorization', `Bearer ${tokenB}`)
  
  expect(res.status).toBe(404) // Pas 403 (ne pas révéler existence)
})
```

#### Sécurité données santé
```typescript
test('Photos diagnostic chiffrées au repos', async () => {
  const diagnosis = await createDiagnosis()
  const s3Object = await getS3Object(diagnosis.photos[0].key)
  
  // Vérifier que le contenu est chiffré (pas lisible directement)
  expect(s3Object.Body.toString()).not.toContain('face')
  expect(s3Object.ServerSideEncryption).toBe('AES256')
})

test('Audit trail de toute lecture diagnostic', async () => {
  const diagnosis = await createDiagnosis()
  
  await request(app)
    .get(`/v1/diagnoses/${diagnosis.id}`)
    .set('Authorization', `Bearer ${praticienToken}`)
  
  const logs = await getAuditLogs({ entity_id: diagnosis.id })
  expect(logs.length).toBe(1)
  expect(logs[0].action).toBe('read')
})
```

---

## 7. TESTS D'ACCESSIBILITÉ

### 7.1 Tests automatisés

```typescript
test('Page d\'accueil accessible WCAG AA', async ({ page }) => {
  await page.goto('/')
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()
  
  expect(accessibilityScanResults.violations).toEqual([])
})
```

### 7.2 Checklist manuelle

- [ ] Navigation clavier complète (Tab, Shift+Tab, Enter, Space)
- [ ] Focus visible sur tous éléments interactifs
- [ ] Lecteur d'écran (NVDA, VoiceOver) : titres et labels corrects
- [ ] Contrastes validés (palette Kènè testée)
- [ ] Taille texte ajustable à 200% sans cassure
- [ ] Pas d'info transmise par couleur seule
- [ ] Vidéos sous-titrées
- [ ] Formulaires : labels associés, erreurs annoncées

---

## 8. TESTS DE COMPATIBILITÉ

### 8.1 Navigateurs (App Pro + Console)

| Navigateur | Versions testées |
|---|---|
| Chrome | Dernière, avant-dernière |
| Firefox | Dernière |
| Safari | 15, 16, 17 |
| Edge | Dernière |

**Outil** : BrowserStack

### 8.2 Mobile (App Cliente)

| Plateforme | Versions | Devices |
|---|---|---|
| Android | 8, 10, 12, 13, 14 | Samsung A32, A52, S22, Tecno, Infinix |
| iOS | 13, 15, 17 | iPhone 8, SE, 12, 14 |

**Outil** : BrowserStack App Live, émulateurs

### 8.3 Résolutions

- Mobile : 360×640, 375×667, 414×896
- Tablette : 768×1024, 1024×1366
- Desktop : 1280×720, 1920×1080, 2560×1440

---

## 9. TESTS DE CONFORMITÉ FISCALE & SOCIALE

### 9.1 Validation barèmes CI

```typescript
describe('Conformité barèmes CI 2025', () => {
  // Test avec valeurs de référence DGI
  const cas_test = [
    { salaire: 75000, igr_attendu: 0 },
    { salaire: 100000, igr_attendu: 4000 },
    { salaire: 500000, igr_attendu: 77400 },
    { salaire: 1000000, igr_attendu: 203400 },
  ]
  
  cas_test.forEach(({ salaire, igr_attendu }) => {
    it(`salaire ${salaire} → IGR ${igr_attendu}`, () => {
      expect(calculerIgrCI(salaire)).toBe(igr_attendu)
    })
  })
})

describe('Conformité CNPS CI', () => {
  it('cotisations pension conformes Guide employeur', () => {
    const salaire = 300000
    const result = calculerCNPSCI(salaire)
    
    // Source : Guide CNPS employeur 2024
    expect(result.pension_employeur).toBe(300000 * 0.077) // 23 100
    expect(result.pension_salarie).toBe(300000 * 0.063) // 18 900
    expect(result.prestations_employeur).toBe(70000 * 0.05) // 3 500
  })
})
```

### 9.2 Validation échéances

```typescript
describe('Échéances réglementaires', () => {
  it('alerte si déclaration CNPS en retard après le 15', () => {
    const today = new Date('2025-02-16') // 16 février
    const echeance = getEcheanceCNPS(today)
    expect(echeance.en_retard).toBe(true)
    expect(echeance.periode).toBe('2025-01')
  })
  
  it('TVA mensuelle avant le 15', () => {
    const today = new Date('2025-02-14')
    const echeance = getEcheanceTVA(today)
    expect(echeance.en_retard).toBe(false)
  })
})
```

### 9.3 Validation format déclarations

```typescript
describe('Format e-CNPS', () => {
  it('génère un XML conforme au format attendu', () => {
    const payslips = [/* ... */]
    const xml = generateCNPSDeclaration(payslips, '2025-01')
    
    // Validation XSD
    const isValid = validateXML(xml, 'cnps_schema.xsd')
    expect(isValid).toBe(true)
    
    expect(xml).toContain('<employer_rccm>')
    expect(xml).toContain('<period>2025-01</period>')
    expect(xml).toContain('<employees>')
  })
})
```

---

## 10. DONNÉES DE TEST

### 10.1 Jeux de données

| Dataset | Usage | Anonymisation |
|---|---|---|
| Clients test | 1 000 clients fictifs | N/A (générés) |
| Instituts test | 50 instituts fictifs CI + SN | N/A |
| Produits test | 200 produits cosmétiques | N/A |
| Employés test | 100 employés (10 instituts) | N/A |
| Images peau test | 500 photos (consentement) | Anonymisées |

### 10.2 Environnements

| Env | Usage | Données |
|---|---|---|
| **dev** | Développement | Données synthétiques |
| **staging** | Tests intégrés | Données synthétiques + anonymisées |
| **preprod** | Validation finale | Données anonymisées réelles |
| **prod** | Production | Données réelles |

### 10.3 RGPD des données test

- Pas de données réelles en dev/staging
- Anonymisation irréversible en preprod
- Pas de numéros de téléphone réels (sauf tests端的 employés Kènè)
- Effacement régulier des données test

---

## 11. PROCESS CI/CD

### 11.1 Pipeline GitHub Actions

```yaml
name: CI
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:unit
      - run: bash <(curl -s https://codecov.io/bash)
      
  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres: ...
      redis: ...
    steps:
      - run: npm run test:integration
      
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:e2e
      
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - run: npm audit
      - uses: snyk/actions/node@master
      
  a11y-test:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:a11y
      
  build:
    needs: [lint, unit-tests, integration-tests, e2e-tests, security-scan, a11y-test]
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      - uses: aws-actions/amazon-ecr-push@v1
      
  deploy-staging:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh staging
      
  e2e-staging:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:e2e:staging
```

### 11.2 Gates qualité

Un PR ne peut être mergé que si :
- ✅ Lint passe
- ✅ Tests unitaires ≥ 70% coverage, 100% succès
- ✅ Tests intégration 100% succès
- ✅ Tests E2E parcours critiques 100% succès
- ✅ Scan sécurité : 0 vulnérabilité critique
- ✅ Tests accessibilité : 0 violation
- ✅ Code review : 1 approbateur minimum

---

## 12. STRATÉGIE DE BUG FIXING

### 12.1 Priorisation

| Sévérité | Définition | SLA correction |
|---|---|---|
| **P0 Critique** | Service indisponible, données perdues, sécurité compromise | < 2h |
| **P1 Élevée** | Fonctionnalité critique cassée, workaround difficile | < 24h |
| **P2 Moyenne** | Fonctionnalité affectée, workaround existe | < 1 semaine |
| **P3 Faible** | Cosmétique, mineur | < 1 mois |

### 12.2 Process

1. **Signalement** (Sentry, support, interne)
2. **Triage** (assignation priorité, responsable)
3. **Reproduction** (env staging)
4. **Correction** (branche fix + tests)
5. **Review** (PR + approbateur)
6. **Déploiement** (staging → prod)
7. **Vérification** (post-deploy check)
8. **Post-mortem** (P0/P1 uniquement)

---

*Fin de la Partie 9. Le plan de test garantit la qualité, sécurité, conformité et fiabilité avant et après mise en production.*
