<div align="center">

# Typing Arena

**A competitive typing speed test with training drills, stats tracking, and keyboard heatmaps.**

*Un test de vitesse de frappe competitif avec exercices d'entrainement, suivi de statistiques et heatmaps clavier.*

[English](#english) | [Francais](#francais)

</div>

---

## English

### What is Typing Arena?

Typing Arena is a feature-rich typing test application. Take timed typing tests with random words or famous quotes, train on your weak keys with targeted drills, track your WPM and accuracy over time, and visualize your performance with keyboard heatmaps and trend charts.

### Features

- **Typing Tests** — Timed tests with configurable duration and text sources
- **Multiple Text Sources** — Random words, quotes, and custom text in English & French
- **Training Mode** — Targeted drills that focus on your weakest keys
- **Training Plans** — Auto-generated practice plans based on your error patterns
- **Keyboard Heatmap** — Visual heatmap showing accuracy per key
- **Session History** — All sessions stored locally with IndexedDB (Dexie)
- **Trend Charts** — Track WPM, accuracy, and consistency over time with Recharts
- **Per-Letter Stats** — Detailed accuracy and speed breakdown for every character
- **Countdown Timer** — Visual countdown with progress bar
- **Dark / Light Mode** — Theme toggle
- **Bilingual UI** — Full English & French interface

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS 4 + shadcn/ui + Radix UI |
| State | Zustand |
| Charts | Recharts |
| Database | Dexie (IndexedDB) |
| i18n | next-intl |

### Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Francais

### Qu'est-ce que Typing Arena ?

Typing Arena est une application de test de frappe complete. Passez des tests chronometes avec des mots aleatoires ou des citations celebres, entrainez-vous sur vos touches faibles avec des exercices cibles, suivez vos WPM et votre precision au fil du temps, et visualisez vos performances avec des heatmaps clavier et des graphiques de tendance.

### Fonctionnalites

- **Tests de Frappe** — Tests chronometes avec duree et sources de texte configurables
- **Sources de Texte Multiples** — Mots aleatoires, citations et texte personnalise en anglais et francais
- **Mode Entrainement** — Exercices cibles sur vos touches les plus faibles
- **Plans d'Entrainement** — Plans de pratique auto-generes bases sur vos erreurs
- **Heatmap Clavier** — Heatmap visuelle montrant la precision par touche
- **Historique des Sessions** — Toutes les sessions stockees localement avec IndexedDB
- **Graphiques de Tendance** — Suivez WPM, precision et regularite avec Recharts
- **Stats par Lettre** — Detail de la precision et vitesse pour chaque caractere
- **Compte a Rebours** — Decompte visuel avec barre de progression
- **Mode Sombre / Clair** — Bascule de theme
- **Interface Bilingue** — Anglais et francais complets

### Demarrage Rapide

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

---

<div align="center">

**Built with Next.js, TypeScript & Tailwind CSS**

</div>
