# 📋 Kènè — Cahier des Charges

> **Document maître des spécifications pour la construction de la plateforme Kènè**
>
> Version : 1.0 — Phase 1 (MVP CI + SN)
> Référence : conception_documentation.md + decisions_finales.md
>
> Structure en 5 parties :
> 1. Spécifications fonctionnelles détaillées (user stories + critères d'acceptation)
> 2. Modèle de données & API
> 3. Spécifications écran par écran (wireframes textuels)
> 4. Exigences non-fonctionnelles
> 5. Données de référence (barèmes, plan comptable, taxonomies)

---

## CONVENTIONS

- **US-XXX** : User Story numérotée
- Format user story : `En tant que <rôle>, je veux <action> afin de <bénéfice>`
- **Critères d'acceptation** : au format Gherkin (Étant donné / Quand / Alors)
- **Priorité** : 🔴 Must (MVP 1A) | 🟡 Should (MVP 1B) | 🟢 Could (Phase 2+)
- **Rôles** : CLIENT (cliente app), GERANT (gérant institut), PRATICIENNE, COMPTABLE, RH, CAISSIER, ADMIN (console Kènè)

---

## PÉRIMÈTRE DU CAHIER DES CHARGES

### MVP 1A — Cœur (mois 1-4) 🔴
- App Cliente : onboarding OTP, diagnostic IA (10 indicateurs), RDV, boutique, paiement Wave+Orange
- App Pro : agenda, caisse MoMo, CRM, catalogue, stock basique
- Console : onboarding entreprise

### MVP 1B — Étendu (mois 5-6) 🟡
- App Cliente + : suivi temporel, téléconsultation, fidélité, avis
- App Pro + : paie CNPS/IPM, compta SYSCOHADA, marketing SMS/WhatsApp, multi-sites
- IA + : 20 indicateurs, edge offline

### Hors périmètre MVP (Phase 2+) 🟢
- Extension ML + BF + Cameroun
- Marketplace cosmétique panafricaine
- Langues locales (nouchi, wolof)
- Afrique anglophone
