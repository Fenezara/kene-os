# Partie 11 — Évolutions & Améliorations du Diagnostic

> Consolidation des 6 évolutions issues de l'analyse des solutions professionnelles (VISIA, analyseurs spectraux) et de l'extension multi-zones du corps
>
> Périmètre : MVP 1B (🟡) — Phase 1A inchangée

---

## CONTEXTE

L'analyse de 4 solutions professionnelles (VISIA, analyseur 8 spectres, Aura, Le Verdun) et de 8 apps mobiles concurrentes a révélé :

1. **Layout professionnel type VISIA** (grille 2×4 indicateurs avec marquages colorés + pourcentages) — à reproduire
2. **Vues spectrales multiples** (UV, polarisée, thermique, lumière bleue) — à simuler par IA
3. **Indicateurs complémentaires** (taches UV, zones rouges, porphyrines) — à ajouter
4. **Limitation majeure du marché** : toutes les solutions se limitent au visage (+ cou)
5. **Opportunité Kènè** : extension multi-zones du corps, en particulier pour peaux mélanodermes (pathologies spécifiques invisibles sur visage seul)

---

## ÉVOLUTION A — Écran résultats « Mode VISIA-like »

### A.1 Objectif
Reproduire le rendu professionnel d'un appareil VISIA (~30 000€) sur smartphone, avec un layout grille d'indicateurs, des marquages colorés par indicateur, et des pourcentages de sévérité.

### A.2 Layout de l'écran résultats (enrichi)

```
┌─────────────────────────────────────────┐
│  SCORE GLOBAL Kènè    [72/100]          │  ← Hero (jauge circulaire animée)
│  « Votre peau va bien »                  │
├─────────────────────────────────────────┤
│  [Visage] [Dos] [Cuir chevelu] [Mains]   │  ← Onglets multi-zones (Évolution D)
├─────────────────────────────────────────┤
│  Vues : [Standard] [Pigment] [Inflam.]   │  ← Toggle vues spectrales (Évolution B)
├─────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│  │ Taches│ │ Rides │ │Texture│ │ Pores│    │  ← Grille 2×4 (8 indicateurs visibles)
│  │  82%  │ │  63%  │ │  55%  │ │  88% │    │
│  │[photo]│ │[photo]│ │[photo]│ │[photo]│    │
│  └──────┘ └──────┘ └──────┘ └──────┘    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│  │Taches │ │Taches │ │Zones  │ │Porphyr│    │
│  │  UV   │ │Brunes │ │Rouges │ │  ines │    │
│  │  18%  │ │  80%  │ │  34%  │ │  48% │    │
│  └──────┘ └──────┘ └──────┘ └──────┘    │
├─────────────────────────────────────────┤
│  [Toutes] [PIH] [Acné] [Rides]…          │  ← Filtres par indicateur
├─────────────────────────────────────────┤
│  Recommandations                         │
│  • Routine matin/soir                    │
│  • Produits conseillés                   │
│  • Soins institut                        │
└─────────────────────────────────────────┘
```

### A.3 Fonctionnalités clés

| Fonctionnalité | Description |
|---|---|
| **Hero score** | Jauge circulaire 0-100 animée + interprétation textuelle |
| **Grille indicateurs** | 2×4 (visage) ou adapté par zone (Évolution D) |
| **Marquages colorés** | Par indicateur : points (taches/pores), lignes (rides), zones (texture/rougeurs) |
| **Pourcentages** | Sévérité 0-100% par indicateur + code couleur (vert/orange/rouge) |
| **Toggle filtres** | Bouton « Toutes » ou filtrer par indicateur (affiche seulement ses marquages) |
| **Comparaison percentile** | « Vous êtes dans le top 30% des peaux de votre âge/carnation » |
| **Comparaison avant/après** | Slider 2 diagnostics (Évolution déjà prévue US-018) |
| **Disclaimer** | « Kènè n'est pas un diagnostic médical » |

### A.4 User stories associées

#### US-200 — Écran résultats VISIA-like 🟡
**En tant que** cliente, **je veux** voir mes résultats sous forme de grille professionnelle d'indicateurs avec marquages colorés **afin de** visualiser mes problèmes comme chez le dermatologue.

**Critères :**
- Layout grille 2×4 par défaut (8 indicateurs principaux)
- Chaque case : photo visage + marquage couleur + pourcentage + label
- Hero score global en haut
- Toggle filtre par indicateur
- Animation d'apparition des marquages (progressif)

#### US-201 — Filtre par indicateur 🟡
**En tant que** cliente, **je veux** cliquer sur un indicateur pour voir seulement ses marquages **afin de** focaliser sur un problème.

- Bouton radio « Toutes » (défaut) + un bouton par indicateur
- Au clic, seules les zones correspondantes sont mises en évidence
- Les autres marquages s'estompent (opacité 20%)

#### US-202 — Comparaison percentile 🟡
**En tant que** cliente, **je veux** savoir où je me situe vs les peaux de mon âge/carnation **afin de** contextualiser mon score.

- Calcul basé sur dataset anonymisé Kènè
- « Vous êtes dans le top X% des peaux Fitzpatrick V, 25-34 ans »
- Histogramme de distribution avec position de la cliente

---

## ÉVOLUTION B — Vues spectrales simulées par IA

### B.1 Objectif
Simuler par IA les vues spectrales des appareils professionnels (UV, polarisée, thermique, lumière bleue) à partir d'une simple photo RGB smartphone. Chaque vue est labelisée « estimation IA » (transparence).

### B.2 Les 4 vues spectrales simulées

| Vue | Spectre simulé | Ce qu'elle révèle | Techno IA |
|---|---|---|---|
| **Standard** | RGB naturelle | Vue normale de référence | Aucune (photo brute) |
| **Pigmentation profonde** | UV simulé | Mélanine invisible, taches futures | Segmentation U-Net |
| **Inflammation** | Thermique simulée | Rougeurs masquées par mélanine | Modèle GAN pix2pix |
| **Acné/Sébum** | Lumière bleue simulée | Porphyrines, activité bactérienne | Modèle de transfert |

### B.3 User stories

#### US-210 — Sélecteur de vue spectrale 🟡
**En tant que** cliente, **je veux** basculer entre vues standard / pigmentation / inflammation / acné **afin de** voir ma peau sous différents angles.

- 4 boutons radio en haut de l'écran résultats
- Transition fluide entre vues (cross-fade 300ms)
- Chaque vue affiche un disclaimer discret « Estimation IA »

#### US-211 — Vue pigmentation profonde 🟡
**En tant que** cliente, **je veux** voir les taches pigmentaires invisibles à l'œil nu **afin d'**anticiper les futures taches.

- IA entraînée sur paires photos RGB ↔ UV VISIA
- Affiche zones de mélanine profonde en surbrillance
- Disclaimer : « Estimation — consultez un dermatologue pour confirmation »

#### US-212 — Vue inflammation 🟡
**En tant que** cliente mélanoderme, **je veux** voir les rougeurs masquées par ma mélanine **afin de** détecter inflammations.

- Spécifiquement adapté peaux mélanodermes (où rougeurs invisibles)
- Heatmap thermique simulée par IA
- Important pour détection eczéma, dermite, rosée

#### US-213 — Vue acné/sébum 🟡
**En tant que** cliente, **je veux** voir l'activité bactérienne de mon acné **afin de** comprendre sa sévérité.

- Simule lumière bleue (excite porphyrines)
- Affiche points fluorescents = activité bactérienne
- Utile pour suivi traitement acné

### B.4 Limitations & transparence

| Limitation | Mitigation |
|---|---|
| Précision inférieure à appareil pro | Disclaimer clair « estimation IA » |
| Faux positifs possibles | Toujours valider avec dermatologue pour diagnostic |
| Pas de vraie lumière UV (sécurité) | Estimation logicielle uniquement |
| Conditions de capture variables | Assistance capture + recalage IA |

---

## ÉVOLUTION C — Indicateurs complémentaires

### C.1 Indicateurs VISIA ajoutés au MVP 1B

| Indicateur | Description | Sévérité |
|---|---|---|
| **Taches UV** | Dommages solaires invisibles (mélanine profonde) | 0-3 |
| **Zones Rouges** | Érythème, inflammation, sensibilité (spécialement utile peaux mélanodermes où rougeurs masquées) | 0-3 |
| **Porphyrines** | Activité bactérienne (Propionibacterium acnes) — indicateur acné | 0-3 |
| **Taches Brunes** | Hyperpigmentation (taches de vieillesse, mélasma établi) | 0-3 |

### C.2 Nouveau total : 14 indicateurs visage (MVP 1B)

| # | Indicateur | Source | Phase |
|---|---|---|---|
| 1-10 | (initiaux : PIH, mélasma, acné, PFB, pores, texture, séborrhée, ridules, taches solaires, nævi) | Cahier initial | 1A |
| 11 | Taches UV | Évolution C | 1B |
| 12 | Zones Rouges (érythème) | Évolution C | 1B |
| 13 | Porphyrines | Évolution C | 1B |
| 14 | Taches Brunes | Évolution C | 1B |

### C.3 User stories

#### US-220 — Diagnostic 14 indicateurs 🟡
**En tant que** cliente, **je veux** un diagnostic à 14 indicateurs **afin d'**obtenir une analyse aussi complète qu'en cabinet.

- Étend US-010 (10 → 14 indicateurs visage)
- Chaque indicateur : sévérité 0-3 + marquage couleur + heatmap
- Score global recalculé (poids actualisés)

---

## ÉVOLUTION D — Multi-zones corps

### D.1 Objectif
Étendre l'analyse au-delà du visage pour couvrir les zones du corps pertinentes pour peaux mélanodermes. C'est un **avantage différenciant majeur** vs VISIA et apps concurrentes (toutes limitées au visage).

### D.2 Zones couvertes (MVP 1B)

| Zone | Indicateurs spécifiques | Justification peau mélanoderme |
|---|---|---|
| **Visage** (14 indicateurs) | PIH, mélasma, acné, PFB, pores, texture, séborrhée, ridules, taches UV/brunes/solaires, zones rouges, porphyrines, nævi | Cœur MVP 1A |
| **Dos** | Acné kystique, PIH post-acné, kéloïdes, pityriasis versicolor, taches | Acné tronc très fréquent chez femmes africaines |
| **Cuir chevelu + Nuque** | Pseudofolliculite, dermite séborrhéique, psoriasis, acné keloidalis nuchae (AKN), alopécie traction | Spécifique cheveux crépus |
| **Mains** | Taches de vieillesse, vitiligo, dermatosis papulosa nigra (DPN), sécheresse | Première zone à vieillir |
| **Barbe** | Pseudofolliculite barbe (PFB), rasoir bumps | Spécifique poils crépus |
| **Nævi corps** (cartographie) | Nævi ABCDE, mélanome acral (paumes, plantes, ongles) | Mélanome acral plus fréquent peau noire |

### D.3 Indicateurs par zone (pas tous partout)

| Zone | Indicateurs pertinents | Indicateurs non pertinents |
|---|---|---|
| Visage | Tous (14) | — |
| Dos | Acné, PIH, kéloïdes, pityriasis, taches | Rides, pores, ridules |
| Cuir chevelu/nuque | PFB, dermite, psoriasis, AKN | Rides, pores, taches UV |
| Mains | Taches, vitiligo, DPN, sécheresse | Acné, pores, séborrhée |
| Barbe | PFB, AKN | Tous autres |
| Nævi corps | ABCDE, mélanome acral | Tous autres |

### D.4 Score multi-zones pondéré

```
Score Kènè Global = moyenne pondérée :
  - Visage : 40% (priorité cosmétique)
  - Dos : 15%
  - Cuir chevelu/nuque : 10%
  - Mains : 10%
  - Barbe (si applicable) : 5%
  - Nævi corps : 20% (sécurité patient — élevé)
```

> Si aucune zone scannée → score calculé sur zones scannées seulement (poids redistribués).

### D.5 User stories

#### US-230 — Sélection zone du corps 🟡
**En tant que** cliente, **je veux** choisir la zone du corps à analyser **afin de** cibler mes préoccupations.

- Écran de sélection : visage (défaut) + dos + cuir chevelu + mains + barbe + nævi corps
- Icônes claires par zone
- Description courte : « Acné, PIH, kéloïdes » pour le dos

#### US-231 — Capture adaptative par zone 🟡
**En tant que** cliente, **je veux** une assistance capture spécifique à la zone **afin de** prendre une bonne photo.

- **Visage** : cercle de guidage + détection visage (existant US-010)
- **Dos** : assistance grille (haut/milieu/bas) + détection dos
- **Cuir chevelu** : partition en 4 zones + assistance focus
- **Mains** : cadre adapté (paume + dos main)
- **Barbe** : cercle de guidage menton + joues
- **Nævi** : macro rapprochée + règle de référence 6mm

#### US-232 — Diagnostic spécifique par zone 🟡
**En tant que** cliente, **je veux** un diagnostic adapté à la zone scannée **afin d'**obtenir des indicateurs pertinents.

- Ex : dos → acné kystique, PIH, kéloïdes, pityriasis (pas de rides)
- Modèle IA spécifique par zone (voir Évolution E)
- Score par zone (0-100) + score global multi-zones pondéré

#### US-233 — Écran résultats multi-zones 🟡
**En tant que** cliente, **je veux** voir mes résultats par zone via onglets **afin de** naviguer facilement.

- Onglets horizontaux : [Visage] [Dos] [Cuir chevelu] [Mains] [Barbe] [Nævi]
- Chaque onglet → layout grille adapté aux indicateurs de la zone
- Onglet « Synthèse » → score global multi-zones + priorités

#### US-234 — Cartographie nævi corps 🟡
**En tant que** cliente, **je veux** cartographier mes grains de beauté **afin de** suivre leur évolution.

- Capture successive des nævi (jusqu'à 20 par diagnostic)
- Localisation sur silhouette corps (avant/arrière)
- Évaluation ABCDE par nævus
- Alerte orientation dermatologique si ≥ 2 critères ABCDE
- Comparaison temporelle (évolution taille/couleur/forme)

---

## ÉVOLUTION E — Modèle IA multi-têtes spécialisées

### E.1 Architecture IA enrichie

```
Input photo (224×224×3)
  ↓
Détection automatique zone ( EfficientNet-Light classifier )
  ↓
Routing vers tête spécialisée :
  ├── Visage : EfficientNet-B4 + 14 têtes (10 initiales + 4 Évolution C)
  ├── Dos : EfficientNet-B4 + 5 têtes (acné, PIH, kéloïdes, pityriasis, taches)
  ├── Cuir chevelu : EfficientNet-B4 + 4 têtes (PFB, dermite, psoriasis, AKN)
  ├── Mains : EfficientNet-B4 + 4 têtes (taches, vitiligo, DPN, sécheresse)
  ├── Barbe : EfficientNet-B0 + 2 têtes (PFB, AKN)
  └── Nævi : EfficientNet-B4 + 2 têtes (ABCDE classification, melanoma acral screening)
  ↓
Têtes spectrales (Évolution B) :
  ├── U-Net : segmentation pigmentation profonde (UV simulé)
  ├── GAN pix2pix : inflammation (thermique simulé)
  └── Transfert learning : porphyrines (lumière bleue simulée)
  ↓
Heatmap Grad-CAM par indicateur + par vue spectrale
  ↓
Score par zone + score global pondéré multi-zones
```

### E.2 Dataset multi-zones (extension Partie 8)

| Zone | Cible images MVP 1B | Cumul depuis MVP 1A |
|---|---|---|
| Visage | 50 000 (déjà MVP 1A) | 50 000 |
| Dos | + 10 000 | 60 000 |
| Cuir chevelu/nuque | + 5 000 | 65 000 |
| Mains | + 5 000 | 70 000 |
| Barbe | + 3 000 | 73 000 |
| Nævi corps | + 8 000 | 81 000 |
| **Total MVP 1B** | **81 000 images** | |

### E.3 Métriques d'évaluation par zone

| Zone | F1 min | Recall min (critique) |
|---|---|---|
| Visage (14 indicateurs) | 0,80 | 0,78 |
| Dos (5 indicateurs) | 0,75 | 0,72 |
| Cuir chevelu (4) | 0,75 | 0,70 |
| Mains (4) | 0,78 | 0,75 |
| Barbe (2) | 0,82 | 0,80 |
| **Nævi (ABCDE)** | **0,90** | **0,85** (sécurité patient) |
| Vues spectrales (B) | 0,75 | 0,72 |

### E.4 Biais & équité multi-zones

Surveillance par sous-groupe (carnation Fitzpatrick IV-VI × zone × genre × âge × pays). Différence max acceptable : 5%.

---

## ÉVOLUTION F — UX capture adaptative

### F.1 Détection automatique de zone

```
FONCTION détecter_zone(photo):
    classifier = EfficientNet-Light (5 classes : visage/dos/main/barbe/nævi)
    zone = classifier.predict(photo)
    RETOURNER zone + confidence_score
    
    SI confidence < 70%:
        demander à la cliente de sélectionner manuellement
```

### F.2 Assistance capture par zone

| Zone | Assistance | Indicateurs qualité |
|---|---|---|
| **Visage** | Cercle de guidage + détection visage | Luminosité, distance, flou, alignement |
| **Dos** | Grille 3×1 (haut/milieu/bas) + détection dos | Cadre complet, luminosité |
| **Cuir chevelu** | 4 quadrants + focus rapproché | Distance (5-10 cm), séparation cheveux |
| **Mains** | Cadre rectangulaire + détection main | Paume ouverte, fond uni |
| **Barbe** | Cercle menton + joues | Visage de face, zone barbue visible |
| **Nævi** | Macro rapprochée + règle 6mm | Focus net, règle de référence visible |

### F.3 User stories

#### US-240 — Détection auto zone 🟡
**En tant que** cliente, **je veux** que l'app détecte automatiquement la zone photographiée **afin de** ne pas avoir à sélectionner manuellement.

- Modèle léger de classification de zone
- Si confidence > 70% → confirmation rapide
- Si < 70% → sélection manuelle proposée

#### US-241 — Assistance capture multi-zones 🟡
**En tant que** cliente, **je veux** une assistance visuelle adaptée à chaque zone **afin de** réussir ma photo.

- Overlay spécifique par zone (cercle, grille, cadre…)
- Indicateurs qualité temps réel
- Recadrage auto post-capture si nécessaire

#### US-242 — Recommandation de zones à scanner 🟡
**En tant que** cliente, **je veux** être guidée sur les zones pertinentes **afin de** ne rien oublier.

- Si première analyse : recommander « Visage + nævi corps » (base)
- Si acné visage détectée : recommander « + Dos » (acné tronc)
- Si PFB barbe détecté : recommander « + Cuir chevelu/nuque »
- Si nævi suspect : recommander « cartographie complète »

---

## SYNTHÈSE DES NOUVELLES USER STORIES (Partie 11)

| US | Évolution | Phase | Description |
|---|---|---|---|
| US-200 | A | 🟡 | Écran résultats VISIA-like |
| US-201 | A | 🟡 | Filtre par indicateur |
| US-202 | A | 🟡 | Comparaison percentile |
| US-210 | B | 🟡 | Sélecteur vue spectrale |
| US-211 | B | 🟡 | Vue pigmentation profonde |
| US-212 | B | 🟡 | Vue inflammation |
| US-213 | B | 🟡 | Vue acné/sébum |
| US-220 | C | 🟡 | Diagnostic 14 indicateurs visage |
| US-230 | D | 🟡 | Sélection zone du corps |
| US-231 | D | 🟡 | Capture adaptative par zone |
| US-232 | D | 🟡 | Diagnostic spécifique par zone |
| US-233 | D | 🟡 | Écran résultats multi-zones |
| US-234 | D | 🟡 | Cartographie nævi corps |
| US-240 | F | 🟡 | Détection auto zone |
| US-241 | F | 🟡 | Assistance capture multi-zones |
| US-242 | F | 🟡 | Recommandation de zones à scanner |

**Total : 17 nouvelles user stories (toutes en MVP 1B 🟡)**

---

## IMPACT SUR LES PARTIES EXISTANTES

### Mise à jour Partie 1 — US-010 (diagnostic)
Étendu à :
- 14 indicateurs visage (au lieu de 10)
- 6 zones corps scannables (au lieu de visage seul)
- Score multi-zones pondéré

### Mise à jour Partie 5 — Taxonomie peau
- Ajout 4 indicateurs VISIA (taches UV, zones rouges, porphyrines, taches brunes)
- Ajout tableau indicateurs par zone corps
- Score pondéré multi-zones

### Mise à jour Partie 8 — Spécifications IA
- Architecture multi-têtes par zone
- Dataset 81 000 images (vs 50 000 initial)
- Métriques par zone
- Vues spectrales simulées (U-Net, GAN pix2pix)

### Mise à jour Partie 3 — Écran C4 (résultats)
- Nouveau layout VISIA-like (grille 2×4)
- Toggle filtres par indicateur
- Onglets multi-zones
- Toggle vues spectrales

---

## AVANTAGES DIFFÉRENCIANTS FINAUX

| Critère | VISIA | Apps mobiles | **Kènè (avec évolutions)** |
|---|---|---|---|
| Zones du corps | Visage (+cou) | Visage + nævi | **Visage + 5 zones corps** |
| Indicateurs visage | 8 | 5-10 | **14** |
| Peaux mélanodermes | ❌ Biaisé | ❌ Biaisé | ✅ Dataset panafricain |
| Vues spectrales | ✅ Vraies (appareil pro) | ❌ Aucune | ⚠️ Simulées par IA (labelisées) |
| Indicateurs afro-spécifiques (PFB, AKN, acanthosis) | ❌ | ❌ | ✅ Couverts |
| Cartographie nævi ABCDE | Basique | Basique | ✅ Renforcé + mélanome acral |
| Suivi longitudinal multi-zones | ❌ | Visage seul | ✅ Toutes zones |
| Coût | 30 000€ | Gratuit mais limité | ✅ Gratuit + complet |
| Accessibilité | Cabinet dermato | Chez soi | ✅ Chez soi, mobile |
| Calibrage mélanoderme | ❌ | ❌ | ✅ Différenciant clé |

---

## ROADMAP IA MISE À JOUR

### Phase 1A (mois 1-4) 🔴 — inchangée
- 10 indicateurs visage
- Inférence cloud
- Dataset 50 000 images visage

### Phase 1B (mois 5-6) 🟡 — ÉVOLUTIONS A-F
- 14 indicateurs visage (+ 4 VISIA)
- Layout VISIA-like (Évolution A)
- Vues spectrales simulées (Évolution B)
- 6 zones corps scannables (Évolution D)
- Modèle multi-têtes par zone (Évolution E)
- UX capture adaptative (Évolution F)
- Dataset 81 000 images multi-zones
- Edge inference offline

### Phase 2 (mois 7-12) 🟢
- Extension à toutes zones corps (jambes, pieds, plis, ongles…)
- Acanthosis nigricans, vergetures, eczéma, psoriasis
- Cartographie 3D nævi complète
- Études cliniques multi-zones

---

*Fin de la Partie 11. Les 6 évolutions consolident la supériorité de Kènè sur le marché mondial du diagnostic de peau mélanoderme.*
