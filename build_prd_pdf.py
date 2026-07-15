#!/usr/bin/env python3
"""Convertit le PRD markdown en HTML professionnel pour PDF."""
import markdown
import re
from pathlib import Path

BASE = Path("/home/z/my-project")
PRD_MD = BASE / "PRD.md"
OUTPUT_HTML = BASE / "PRD.html"

def md_to_html(md_text: str) -> str:
    md_text = re.sub(r'[🔴🟡🟢⭐✅❌📊🎯🔥💡🚀🌍🎨📋📖🪮🐦📚🌙🦷🏠🏰🌿☮️]', '', md_text)
    return markdown.markdown(
        md_text,
        extensions=['tables', 'fenced_code', 'codehilite', 'toc', 'nl2br', 'sane_lists', 'attr_list'],
        extension_configs={
            'codehilite': {'noclasses': True, 'pygments_style': 'friendly'},
            'toc': {'permalink': False},
        }
    )

CSS = """
<style>
@page {
    size: A4;
    margin: 25mm 20mm 25mm 20mm;
    @bottom-center {
        content: "Kènè — PRD · Page " counter(page) " / " counter(pages);
        font-family: Georgia, serif;
        font-size: 9pt;
        color: #888;
    }
}
@page :first { margin: 0; @bottom-center { content: none; } }

* { box-sizing: border-box; }
html, body {
    margin: 0; padding: 0;
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 10.5pt; line-height: 1.55; color: #1A1410; background: #FFFFFF;
}
h1, h2, h3, h4, h5, h6 {
    font-family: 'Helvetica', 'Arial', sans-serif; color: #1A1410;
    font-weight: bold; line-height: 1.3; page-break-after: avoid;
}
h1 {
    font-size: 22pt; color: #C8951E;
    border-bottom: 3px solid #C8951E; padding-bottom: 8px;
    margin-top: 30px; margin-bottom: 18px; page-break-before: always;
}
h2 {
    font-size: 15pt; color: #A0522D; margin-top: 24px; margin-bottom: 12px;
    border-left: 4px solid #C8951E; padding-left: 10px;
}
h3 { font-size: 12.5pt; color: #1A1410; margin-top: 18px; margin-bottom: 8px; }
h4 { font-size: 11pt; color: #3F7D3F; margin-top: 14px; margin-bottom: 6px; }
p { margin: 6px 0; text-align: justify; orphans: 3; widows: 3; }
ul, ol { margin: 6px 0 6px 20px; padding-left: 15px; }
li { margin: 3px 0; }
strong { color: #1A1410; }
a { color: #1B3A6B; text-decoration: none; }
table {
    border-collapse: collapse; width: 100%; margin: 12px 0;
    font-size: 9.5pt; page-break-inside: avoid;
}
th, td { border: 1px solid #D6C7A8; padding: 6px 8px; text-align: left; vertical-align: top; }
th { background: #F8F1E4; color: #1A1410; font-weight: bold; font-family: Helvetica, sans-serif; }
tr:nth-child(even) { background: #FBF7EE; }
code {
    font-family: 'Courier New', monospace; background: #F4EDE0;
    color: #8B1A3B; padding: 1px 4px; border-radius: 2px; font-size: 9pt;
}
pre {
    background: #2D2418; color: #F8F1E4; padding: 10px 12px; border-radius: 4px;
    font-family: 'Courier New', monospace; font-size: 8.5pt; line-height: 1.4;
    overflow-x: auto; page-break-inside: avoid; margin: 10px 0;
}
pre code { background: transparent; color: inherit; padding: 0; }
blockquote {
    border-left: 4px solid #C8951E; background: #FBF7EE; margin: 10px 0;
    padding: 8px 14px; color: #1A1410; font-style: italic;
}
hr { border: none; border-top: 1px solid #D6C7A8; margin: 20px 0; }

/* Cover */
.cover {
    page-break-after: always;
    background: linear-gradient(135deg, #1A1410 0%, #2D2418 50%, #1A1410 100%);
    color: #F8F1E4; padding: 0; margin: 0; height: 297mm; width: 210mm;
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
}
.cover::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background:
        radial-gradient(circle at 20% 30%, rgba(200, 149, 30, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.12) 0%, transparent 50%);
}
.cover-content { text-align: center; z-index: 1; padding: 40px; max-width: 80%; }
.cover-logo {
    font-family: Helvetica, sans-serif; font-size: 56pt; font-weight: bold;
    color: #C8951E; margin-bottom: 30px; letter-spacing: 4px;
}
.cover-title {
    font-family: Helvetica, sans-serif; font-size: 32pt; color: #F8F1E4;
    border: none; padding: 0; margin: 0 0 15px 0; page-break-before: avoid;
}
.cover-subtitle { font-size: 14pt; color: #D6C7A8; margin: 10px 0 30px 0; font-style: italic; }
.cover-divider { width: 80px; height: 3px; background: #C8951E; margin: 30px auto; }
.cover-tagline { font-size: 18pt; color: #C8951E; font-style: italic; margin: 25px 0; }
.cover-meta { margin-top: 50px; font-size: 11pt; color: #D6C7A8; line-height: 1.8; }
.cover-meta strong { color: #F8F1E4; }
.cover-footer { margin-top: 60px; font-size: 10pt; color: #A0522D; letter-spacing: 1px; }
</style>
"""

def main():
    with open(PRD_MD, "r", encoding="utf-8") as f:
        md_content = f.read()
    
    # Remove the first H1 (we use cover instead)
    md_content = re.sub(r'^# Kènè.*?\n', '', md_content, count=1)
    
    body_html = md_to_html(md_content)
    
    html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Kènè — PRD (Product Requirements Document)</title>
    <meta name="author" content="Kènè">
    <meta name="description" content="PRD MVP Kènè - Plateforme beauté mélanoderme panafricaine">
{CSS}
</head>
<body>
<section class="cover">
    <div class="cover-content">
        <div class="cover-logo">Kènè</div>
        <h1 class="cover-title">Product Requirements Document</h1>
        <p class="cover-subtitle">Plateforme Beauté & Bien-être Mélanoderme pour l'Afrique</p>
        <div class="cover-divider"></div>
        <p class="cover-tagline">La beauté mélanoderme, de A à Z.</p>
        <div class="cover-meta">
            <p><strong>Version :</strong> 1.0 — MVP Vibe Coding</p>
            <p><strong>Périmètre :</strong> 4 sprints (Sprint 1 à 4)</p>
            <p><strong>Stack :</strong> Next.js 16 + TypeScript + Prisma + VLM</p>
            <p><strong>Référence :</strong> Cahier des charges complet (286 pages)</p>
        </div>
        <div class="cover-footer">
            <p>Panafricain · Mobile Money · Conforme OHADA · IA Mélanoderme</p>
        </div>
    </div>
</section>
{body_html}
</body>
</html>
"""
    
    with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
        f.write(html)
    
    print(f"HTML généré : {OUTPUT_HTML}")
    print(f"Taille : {OUTPUT_HTML.stat().st_size / 1024:.1f} KB")

if __name__ == "__main__":
    main()
