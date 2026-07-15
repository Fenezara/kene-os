#!/usr/bin/env python3
"""
Consolide tous les fichiers markdown du cahier des charges + enquêtes
en un seul HTML professionnel pour génération PDF.
"""
import os
import markdown
import re
from pathlib import Path

BASE = Path("/home/z/my-project")
CDC_DIR = BASE / "cahier-des-charges"
RESEARCH_DIR = BASE / "research"

# Ordre des fichiers du cahier des charges
CDC_FILES = [
    ("00-index.md", "Introduction & Périmètre"),
    ("01-specifications-fonctionnelles.md", "Partie 1 — Spécifications Fonctionnelles"),
    ("02-modele-donnees-api.md", "Partie 2 — Modèle de Données & API"),
    ("03-specifications-ecrans.md", "Partie 3 — Spécifications Écran par Écran"),
    ("04-exigences-non-fonctionnelles.md", "Partie 4 — Exigences Non-Fonctionnelles"),
    ("05-donnees-reference.md", "Partie 5 — Données de Référence"),
    ("06-diagrammes-architecture.md", "Partie 6 — Diagrammes UML & Architecture"),
    ("07-regles-metier.md", "Partie 7 — Règles Métier Détaillées"),
    ("08-specifications-ia.md", "Partie 8 — Spécifications IA Approfondies"),
    ("09-plan-test.md", "Partie 9 — Plan de Test & Qualité"),
    ("10-operations-support.md", "Partie 10 — Opérations, Support & Migration"),
    ("11-evolutions-diagnostic.md", "Partie 11 — Évolutions & Améliorations du Diagnostic"),
    ("12-enrichissement-creatif.md", "Partie 12 — Enrichissement Créatif, Innovations & Immersion 3D"),
]

# Fichiers d'enquêtes/analyses à inclure en annexe
RESEARCH_FILES = [
    ("conception_documentation.md", "Document de Conception Panafricaine"),
    ("decisions_finales.md", "Décisions Finales de Conception"),
    ("design_investigation.md", "Enquête Design Africain Moderne"),
    ("app_design_proposal.md", "Proposition Initiale d'Application"),
]

def md_to_html(md_text: str) -> str:
    """Convertit markdown en HTML avec extensions."""
    # Nettoyer les emojis décoratifs qui posent problème en PDF
    md_text = re.sub(r'[🔴🟡🟢⭐✅❌📊🎯🔥💡🚀🌍🎨📋📖🎯🪮🐦📚🌙🦷🏠🏰🌿☮️🟠🟡🔵🟣🟢👇👆🇨🇮🇸🇳🇲🇱🇧🇫🇧🇯🇹🇬🇨🇲🇬🇦🇨🇩🇹🇩🇬🇶🇨🇫🇳🇬🇬🇭🇬🇳🇱🇷🇰🇪🇺🇬🇹🇿🇷🇼🇿🇦💳💰💵🛍️📅📆📦👥🧾📒📣📈🏢💬🔒🔔🛡️]', '', md_text)
    
    return markdown.markdown(
        md_text,
        extensions=[
            'tables',
            'fenced_code',
            'codehilite',
            'toc',
            'nl2br',
            'sane_lists',
            'attr_list',
        ],
        extension_configs={
            'codehilite': {'noclasses': True, 'pygments_style': 'friendly'},
            'toc': {'permalink': False},
        }
    )

def build_cover() -> str:
    """Page de couverture."""
    return """
    <section class="cover">
        <div class="cover-content">
            <div class="cover-logo">Kènè</div>
            <h1 class="cover-title">Cahier des Charges</h1>
            <p class="cover-subtitle">Plateforme Beauté & Bien-être Mélanoderme pour l'Afrique</p>
            <div class="cover-divider"></div>
            <p class="cover-tagline">La beauté mélanoderme, de A à Z.</p>
            <div class="cover-meta">
                <p><strong>Version :</strong> 1.0 — Phase 1 (MVP CI + SN)</p>
                <p><strong>Document :</strong> Consolidation des enquêtes, analyses et spécifications</p>
                <p><strong>Statut :</strong> Prêt pour construction</p>
            </div>
            <div class="cover-footer">
                <p>Panafricain · Mobile Money · Conforme OHADA</p>
            </div>
        </div>
    </section>
    """

def build_toc() -> str:
    """Table des matières."""
    return """
    <section class="toc-page">
        <h1 class="toc-title">Table des Matières</h1>
        <div class="toc-content">
            <div class="toc-section">
                <h2>Document de Conception</h2>
                <ul>
                    <li>Introduction & Périmètre</li>
                    <li>Document de Conception Panafricaine</li>
                    <li>Décisions Finales de Conception</li>
                </ul>
            </div>
            <div class="toc-section">
                <h2>Cahier des Charges (11 parties)</h2>
                <ul>
                    <li>Partie 1 — Spécifications Fonctionnelles (80+ user stories)</li>
                    <li>Partie 2 — Modèle de Données & API</li>
                    <li>Partie 3 — Spécifications Écran par Écran</li>
                    <li>Partie 4 — Exigences Non-Fonctionnelles</li>
                    <li>Partie 5 — Données de Référence</li>
                    <li>Partie 6 — Diagrammes UML & Architecture</li>
                    <li>Partie 7 — Règles Métier Détaillées</li>
                    <li>Partie 8 — Spécifications IA Approfondies</li>
                    <li>Partie 9 — Plan de Test & Qualité</li>
                    <li>Partie 10 — Opérations, Support & Migration</li>
                    <li>Partie 11 — Évolutions & Améliorations du Diagnostic (VISIA-like, multi-zones corps)</li>
                    <li>Partie 12 — Enrichissement Créatif, Innovations & Immersion 3D</li>
                </ul>
            </div>
            <div class="toc-section">
                <h2>Annexes — Enquêtes & Analyses</h2>
                <ul>
                    <li>Enquête Design Africain Moderne</li>
                    <li>Proposition Initiale d'Application</li>
                </ul>
            </div>
        </div>
    </section>
    """

def build_executive_summary() -> str:
    """Synthèse exécutive consolidant toutes les enquêtes."""
    return """
    <section class="chapter">
        <h1 class="chapter-title">Synthèse Exécutive</h1>
        
        <h2>1. Vision</h2>
        <p><strong>Kènè</strong> (du bambara « santé, bien-être ») est la première plateforme beauté et bien-être panafricaine qui unifie en un seul produit le diagnostic de peau par IA entraînée sur peaux mélanodermes, la mise en relation cliente-entreprise, la gestion complète de l'entreprise (RDV, caisse, stock, employés, paie, comptabilité) et la boutique cosmétique avec ingrédients botaniques africains.</p>
        
        <h2>2. Contexte des enquêtes</h2>
        <p>Ce cahier des charges consolide <strong>28 recherches web</strong> menées sur les thématiques suivantes :</p>
        <ul>
            <li>Applications de diagnostic de peau (B2C et B2B/médical)</li>
            <li>Logiciels de gestion spa, salon de beauté, esthétique (FR et EN)</li>
            <li>ERP tout-en-un (Odoo, ERPNext, Zoho, PayFit, Sage, Pennylane)</li>
            <li>Contexte Côte d'Ivoire (Mobile Money, paie CNPS, IGR, logiciels locaux, adoption digitale)</li>
            <li>Design africain moderne (UI fintech, Adinkra, couleurs Kente/Bogolan, typo Ojuju, patterns, beauté mélanoderme)</li>
            <li>Marchés panafricains (Mobile Money par pays, OHADA, régimes sociaux, data protection, marché beauté, dermatologie peaux noires)</li>
        </ul>
        
        <h2>3. Gap stratégique identifié</h2>
        <p>Aucune solution mondiale ou locale actuelle ne répond simultanément aux besoins suivants en Afrique :</p>
        <ol>
            <li>Diagnostic IA de peau entraîné sur peaux mélanodermes (Fitzpatrick IV-VI)</li>
            <li>Paiement Mobile Money natif (Wave, Orange, MTN, Moov, M-Pesa, OPay)</li>
            <li>Paie conforme par pays (CNPS CI, IPM SN, INPS ML, PENCOM Nigeria, SSNIT Ghana, NSSF Kenya)</li>
            <li>Comptabilité SYSCOHADA (17 pays OHADA) + IFRS (Nigeria, Kenya, Afrique du Sud)</li>
            <li>Métier beauté/spa/dermo (RDV variables, commissions, fiches photo avant/après)</li>
            <li>Mise en relation cliente-entreprise panafricaine</li>
            <li>Prix en devise locale adapté au pouvoir d'achat</li>
        </ol>
        
        <h2>4. Décisions clés validées</h2>
        <table>
            <thead>
                <tr><th>Décision</th><th>Choix</th></tr>
            </thead>
            <tbody>
                <tr><td>Nom</td><td>Kènè (bambara « santé, bien-être »)</td></tr>
                <tr><td>Logo</td><td>Duafe + Goutte (peigne Akan stylisé)</td></tr>
                <tr><td>Palette</td><td>Or + Bogolan + Vert Baobab + Bordeaux Bissap</td></tr>
                <tr><td>Typo</td><td>Ojuju (Ụdị Foundry, Google Fonts)</td></tr>
                <tr><td>Pays lancement</td><td>Côte d'Ivoire + Sénégal simultanés</td></tr>
                <tr><td>MoMo priorité</td><td>Wave + Orange Money</td></tr>
                <tr><td>Dataset dermato</td><td>CHU Cocody/Treichville + CHU Fann/Dantec</td></tr>
                <tr><td>Hébergement</td><td>AWS af-south-1 (Cape Town)</td></tr>
                <tr><td>MVP</td><td>1A cœur (mois 1-4) + 1B étendu (mois 5-6)</td></tr>
            </tbody>
        </table>
        
        <h2>5. Architecture produit</h2>
        <p>Trois faces complémentaires :</p>
        <ul>
            <li><strong>App Cliente</strong> (iOS/Android/Web) : diagnostic IA, RDV, boutique, wallet</li>
            <li><strong>App Pro</strong> (Web + mobile) : agenda, caisse, CRM, stock, RH, paie, compta</li>
            <li><strong>Console Admin</strong> : marketplace, IA, conformité</li>
        </ul>
        
        <h2>6. Roadmap</h2>
        <ul>
            <li><strong>Phase 1A</strong> (mois 1-4) : CI + SN, MVP cœur (10 indicateurs visage, RDV, caisse MoMo)</li>
            <li><strong>Phase 1B</strong> (mois 5-6) : Étendu (paie CNPS/IPM, compta SYSCOHADA) + <strong>évolutions diagnostic</strong> (Partie 11) :
                <ul>
                    <li>Layout VISIA-like (grille 2×4 indicateurs + marquages colorés)</li>
                    <li>Vues spectrales simulées par IA (UV, thermique, lumière bleue)</li>
                    <li>14 indicateurs visage (+ taches UV, zones rouges, porphyrines, taches brunes)</li>
                    <li>Multi-zones corps (visage + dos + cuir chevelu + mains + barbe + nævi corps)</li>
                    <li>Modèle IA multi-têtes spécialisées par zone</li>
                    <li>UX capture adaptative + détection auto zone</li>
                </ul>
            </li>
            <li><strong>Phase 2</strong> (mois 7-12) : UEMOA + CEMAC</li>
            <li><strong>Phase 3</strong> (mois 13-20) : Nigeria + Ghana (anglophone)</li>
            <li><strong>Phase 4</strong> (mois 21-30) : Afrique de l'Est + Australe</li>
            <li><strong>Phase 5</strong> (continu) : Marketplace panafricaine, IA étendue</li>
        </ul>
        
        <h2>7. Modèle économique</h2>
        <ul>
            <li>SaaS Pro (3 paliers : Essentiel 15 000 FCFA, Pro 35 000, Chaîne 75 000)</li>
            <li>Commission marketplace (8-12%)</li>
            <li>Commission transactions Mobile Money</li>
            <li>Premium B2C (Glow Pass 5 000 FCFA/mois)</li>
            <li>Kènè Credits (monnaie virtuelle engagement)</li>
            <li>B2B White Label (licence IA)</li>
        </ul>
        
        <h2>8. Vision créative & immersive (Partie 12)</h2>
        <p>Kènè n'est pas qu'une app fonctionnelle — c'est une <strong>expérience de soi</strong>. 12 innovations stratégiques + 8 features bonus + 4 innovations accessibilité rendent l'app <strong>unique, hyper intuitive, immersive</strong> :</p>
        <ul>
            <li><strong>Kènè Mirror</strong> : miroir IA temps réel avec overlay doré</li>
            <li><strong>Peau Journey</strong> : timeline 3D évolutive</li>
            <li><strong>Rooted Routine</strong> : routine gamifiée (jardin botanique virtuel)</li>
            <li><strong>Skin Twin</strong> : avatar 3D de la peau</li>
            <li><strong>Mama Kènè</strong> : coach IA vocal en langues locales</li>
            <li><strong>5 scènes 3D signatures</strong> au scroll (sphère, voyage sous peau, jardin glow, souk immersif, constellation)</li>
            <li><strong>Shaders signatures</strong> : Peau vivante, Glow Duafe, Kente Flow</li>
            <li><strong>Sound design</strong> opt-in (balafon, kora, marimba)</li>
            <li><strong>31 nouvelles user stories créatives</strong> (US-300 à US-330)</li>
        </ul>
        <p><strong>Stack immersive</strong> : React Three Fiber + GSAP ScrollTrigger + Lenis + MediaPipe + GLSL shaders + Web Audio API</p>
    </section>
    """

def build_css() -> str:
    """CSS professionnel pour le PDF."""
    return """
    <style>
    @page {
        size: A4;
        margin: 25mm 20mm 25mm 20mm;
        @bottom-center {
            content: "Kènè — Cahier des Charges · Page " counter(page) " / " counter(pages);
            font-family: 'Georgia', serif;
            font-size: 9pt;
            color: #888;
        }
    }
    @page :first {
        margin: 0;
        @bottom-center { content: none; }
    }
    
    * { box-sizing: border-box; }
    
    html, body {
        margin: 0;
        padding: 0;
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 10.5pt;
        line-height: 1.55;
        color: #1A1410;
        background: #FFFFFF;
    }
    
    h1, h2, h3, h4, h5, h6 {
        font-family: 'Helvetica', 'Arial', sans-serif;
        color: #1A1410;
        font-weight: bold;
        line-height: 1.3;
        page-break-after: avoid;
    }
    
    h1 { 
        font-size: 22pt; 
        color: #C8951E;
        border-bottom: 3px solid #C8951E;
        padding-bottom: 8px;
        margin-top: 30px;
        margin-bottom: 18px;
        page-break-before: always;
    }
    
    h2 { 
        font-size: 15pt; 
        color: #A0522D;
        margin-top: 24px;
        margin-bottom: 12px;
        border-left: 4px solid #C8951E;
        padding-left: 10px;
    }
    
    h3 { 
        font-size: 12.5pt; 
        color: #1A1410;
        margin-top: 18px;
        margin-bottom: 8px;
    }
    
    h4 { 
        font-size: 11pt; 
        color: #3F7D3F;
        margin-top: 14px;
        margin-bottom: 6px;
    }
    
    p { 
        margin: 6px 0; 
        text-align: justify;
        orphans: 3;
        widows: 3;
    }
    
    ul, ol {
        margin: 6px 0 6px 20px;
        padding-left: 15px;
    }
    
    li {
        margin: 3px 0;
    }
    
    strong { color: #1A1410; }
    
    a { color: #1B3A6B; text-decoration: none; }
    
    table {
        border-collapse: collapse;
        width: 100%;
        margin: 12px 0;
        font-size: 9.5pt;
        page-break-inside: avoid;
    }
    
    th, td {
        border: 1px solid #D6C7A8;
        padding: 6px 8px;
        text-align: left;
        vertical-align: top;
    }
    
    th {
        background: #F8F1E4;
        color: #1A1410;
        font-weight: bold;
        font-family: 'Helvetica', sans-serif;
    }
    
    tr:nth-child(even) {
        background: #FBF7EE;
    }
    
    code {
        font-family: 'Courier New', monospace;
        background: #F4EDE0;
        color: #8B1A3B;
        padding: 1px 4px;
        border-radius: 2px;
        font-size: 9pt;
    }
    
    pre {
        background: #2D2418;
        color: #F8F1E4;
        padding: 10px 12px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 8.5pt;
        line-height: 1.4;
        overflow-x: auto;
        page-break-inside: avoid;
        margin: 10px 0;
    }
    
    pre code {
        background: transparent;
        color: inherit;
        padding: 0;
    }
    
    blockquote {
        border-left: 4px solid #C8951E;
        background: #FBF7EE;
        margin: 10px 0;
        padding: 8px 14px;
        color: #1A1410;
        font-style: italic;
    }
    
    hr {
        border: none;
        border-top: 1px solid #D6C7A8;
        margin: 20px 0;
    }
    
    /* Cover page */
    .cover {
        page-break-after: always;
        background: linear-gradient(135deg, #1A1410 0%, #2D2418 50%, #1A1410 100%);
        color: #F8F1E4;
        padding: 0;
        margin: 0;
        height: 297mm;
        width: 210mm;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }
    
    .cover::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: 
            radial-gradient(circle at 20% 30%, rgba(200, 149, 30, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.12) 0%, transparent 50%);
    }
    
    .cover-content {
        text-align: center;
        z-index: 1;
        padding: 40px;
        max-width: 80%;
    }
    
    .cover-logo {
        font-family: 'Helvetica', sans-serif;
        font-size: 48pt;
        font-weight: bold;
        color: #C8951E;
        margin-bottom: 30px;
        letter-spacing: 4px;
    }
    
    .cover-title {
        font-family: 'Helvetica', sans-serif;
        font-size: 36pt;
        color: #F8F1E4;
        border: none;
        padding: 0;
        margin: 0 0 15px 0;
        page-break-before: avoid;
    }
    
    .cover-subtitle {
        font-size: 14pt;
        color: #D6C7A8;
        margin: 10px 0 30px 0;
        font-style: italic;
    }
    
    .cover-divider {
        width: 80px;
        height: 3px;
        background: #C8951E;
        margin: 30px auto;
    }
    
    .cover-tagline {
        font-size: 16pt;
        color: #C8951E;
        font-style: italic;
        margin: 25px 0;
    }
    
    .cover-meta {
        margin-top: 50px;
        font-size: 11pt;
        color: #D6C7A8;
        line-height: 1.8;
    }
    
    .cover-meta strong {
        color: #F8F1E4;
    }
    
    .cover-footer {
        margin-top: 60px;
        font-size: 10pt;
        color: #A0522D;
        letter-spacing: 1px;
    }
    
    /* TOC page */
    .toc-page {
        page-break-after: always;
        padding: 20px 0;
    }
    
    .toc-title {
        font-size: 28pt;
        color: #C8951E;
        text-align: center;
        border-bottom: 3px solid #C8951E;
        padding-bottom: 15px;
        margin-bottom: 30px;
    }
    
    .toc-section {
        margin: 20px 0;
        padding: 15px;
        background: #FBF7EE;
        border-left: 4px solid #C8951E;
    }
    
    .toc-section h2 {
        font-size: 14pt;
        color: #A0522D;
        border: none;
        padding: 0;
        margin: 0 0 10px 0;
    }
    
    .toc-section ul {
        margin: 0;
        padding-left: 20px;
    }
    
    .toc-section li {
        font-size: 10.5pt;
        margin: 4px 0;
        color: #1A1410;
    }
    
    /* Chapter sections */
    .chapter {
        page-break-before: always;
    }
    
    .chapter-title {
        font-size: 24pt;
        color: #C8951E;
        border-bottom: 3px solid #C8951E;
        padding-bottom: 10px;
        margin-bottom: 20px;
    }
    
    /* Partie separator */
    .partie-separator {
        page-break-before: always;
        background: linear-gradient(135deg, #A0522D 0%, #8B1A3B 100%);
        color: #F8F1E4;
        padding: 60px 40px;
        margin: 0;
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
    
    .partie-separator h1 {
        color: #F8F1E4;
        border: none;
        font-size: 28pt;
        margin: 0;
        page-break-before: avoid;
    }
    
    /* Code blocks mermaid - render as pre */
    .mermaid {
        background: #FBF7EE;
        border: 1px solid #D6C7A8;
        padding: 10px;
        font-family: 'Courier New', monospace;
        font-size: 8pt;
        white-space: pre-wrap;
        page-break-inside: avoid;
    }
    
    /* Print optimizations */
    h1, h2, h3 {
        page-break-after: avoid;
    }
    
    table, pre, blockquote {
        page-break-inside: avoid;
    }
    
    /* Avoid orphan headings */
    h1 + p, h2 + p, h3 + p {
        page-break-before: avoid;
    }
    </style>
    """

def main():
    """Génère le HTML consolidé."""
    html_parts = []
    
    # HTML head
    html_parts.append(f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kènè — Cahier des Charges Complet</title>
    <meta name="author" content="Kènè">
    <meta name="description" content="Cahier des charges complet de la plateforme Kènè - Beauté mélanoderme panafricaine">
{build_css()}
</head>
<body>
""")
    
    # Cover page
    html_parts.append(build_cover())
    
    # TOC
    html_parts.append(build_toc())
    
    # Executive summary
    html_parts.append(build_executive_summary())
    
    # Document de conception (préambule)
    html_parts.append('<section class="chapter">')
    html_parts.append('<h1 class="chapter-title">Document de Conception Panafricaine</h1>')
    if (RESEARCH_DIR / "conception_documentation.md").exists():
        with open(RESEARCH_DIR / "conception_documentation.md", "r", encoding="utf-8") as f:
            content = f.read()
            # Skip the first heading (already in chapter title)
            content = re.sub(r'^# .*\n', '', content, count=1)
            html_parts.append(md_to_html(content))
    html_parts.append('</section>')
    
    # Décisions finales
    html_parts.append('<section class="chapter">')
    html_parts.append('<h1 class="chapter-title">Décisions Finales de Conception</h1>')
    if (RESEARCH_DIR / "decisions_finales.md").exists():
        with open(RESEARCH_DIR / "decisions_finales.md", "r", encoding="utf-8") as f:
            content = f.read()
            content = re.sub(r'^# .*\n', '', content, count=1)
            html_parts.append(md_to_html(content))
    html_parts.append('</section>')
    
    # Les 11 parties du cahier des charges
    for filename, title in CDC_FILES:
        filepath = CDC_DIR / filename
        if filepath.exists():
            html_parts.append(f'<section class="chapter">')
            html_parts.append(f'<h1 class="chapter-title">{title}</h1>')
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                # Skip the first H1 (already in chapter title)
                content = re.sub(r'^# .*\n', '', content, count=1)
                html_parts.append(md_to_html(content))
            html_parts.append('</section>')
    
    # Annexes - enquêtes design
    html_parts.append('<section class="chapter">')
    html_parts.append('<h1 class="chapter-title">Annexe — Enquête Design Africain Moderne</h1>')
    if (RESEARCH_DIR / "design_investigation.md").exists():
        with open(RESEARCH_DIR / "design_investigation.md", "r", encoding="utf-8") as f:
            content = f.read()
            content = re.sub(r'^# .*\n', '', content, count=1)
            html_parts.append(md_to_html(content))
    html_parts.append('</section>')
    
    # Proposition initiale
    html_parts.append('<section class="chapter">')
    html_parts.append('<h1 class="chapter-title">Annexe — Proposition Initiale d\'Application</h1>')
    if (RESEARCH_DIR / "app_design_proposal.md").exists():
        with open(RESEARCH_DIR / "app_design_proposal.md", "r", encoding="utf-8") as f:
            content = f.read()
            content = re.sub(r'^# .*\n', '', content, count=1)
            html_parts.append(md_to_html(content))
    html_parts.append('</section>')
    
    # Closing
    html_parts.append("""
    <section class="chapter">
        <h1 class="chapter-title">Fin du Document</h1>
        <div style="text-align: center; padding: 60px 20px; margin-top: 40px; background: linear-gradient(135deg, #1A1410 0%, #2D2418 100%); color: #F8F1E4; border-radius: 8px;">
            <div style="font-size: 32pt; color: #C8951E; font-family: Helvetica, sans-serif; font-weight: bold; letter-spacing: 4px; margin-bottom: 20px;">Kènè</div>
            <p style="font-size: 14pt; color: #D6C7A8; font-style: italic;">La beauté mélanoderme, de A à Z.</p>
            <hr style="width: 60px; border: none; border-top: 2px solid #C8951E; margin: 30px auto;">
            <p style="font-size: 10pt; color: #A0522D;">Cahier des charges complet — Prêt pour construction</p>
            <p style="font-size: 9pt; color: #888; margin-top: 20px;">Panafricain · Mobile Money · Conforme OHADA · IA Mélanoderme</p>
        </div>
    </section>
    </body>
    </html>
    """)
    
    # Write final HTML
    output_path = BASE / "cahier-des-charges" / "KENE_CAHIER_DES_CHARGES_COMPLET.html"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(html_parts))
    
    print(f"HTML généré : {output_path}")
    print(f"Taille : {output_path.stat().st_size / 1024:.1f} KB")
    
    return output_path

if __name__ == "__main__":
    main()
