Typing Arena — Implementation Plan
Context

Portfolio project: typing test app (WPM + précision) avec heatmap clavier, stats par lettre, et un plan d’entraînement automatique basé sur tes faiblesses.

Stack (proposé, cohérent avec ton style) :

Next.js App Router + React + TypeScript

Tailwind + shadcn/ui

next-intl (EN/FR), next-themes

State: Zustand

Charts: Recharts (ou Chart.js si tu préfères)

Storage offline-first: IndexedDB (Dexie) + localStorage fallback

Tout fonctionne offline (PWA optionnel).

Project Structure

typing-arena/
├── src/
│ ├── app/
│ │ ├── [locale]/
│ │ │ ├── layout.tsx # NextIntlClientProvider + ThemeProvider
│ │ │ ├── page.tsx # Home: mode selection + quick start
│ │ │ ├── test/page.tsx # Typing test arena
│ │ │ ├── stats/page.tsx # Dashboard stats
│ │ │ └── training/page.tsx # Training plan + drills
│ │ ├── layout.tsx
│ │ └── globals.css
│ ├── components/
│ │ ├── ui/ # shadcn
│ │ ├── layout/ # Header, AppShell
│ │ ├── arena/ # TextDisplay, Caret, InputCapture, ProgressBar
│ │ ├── keyboard/ # KeyboardHeatmap, KeyCap
│ │ ├── stats/ # LetterTable, TrendCharts, SessionList
│ │ ├── training/ # TrainingPlanCard, DrillRunner, DrillPicker
│ │ └── shared/ # LanguageToggle, ThemeToggle, Toasts
│ ├── stores/
│ │ ├── test-store.ts # current test state (zustand)
│ │ ├── stats-store.ts # aggregated stats + selectors
│ │ └── settings-store.ts # layout, language, difficulty
│ ├── lib/
│ │ ├── engine/
│ │ │ ├── generator.ts # text generation (quotes/words/custom)
│ │ │ ├── scorer.ts # WPM, accuracy, raw WPM, error metrics
│ │ │ ├── keystats.ts # per-letter timing/errors, confusion pairs
│ │ │ └── training.ts # plan algorithm (weak letters -> drills)
│ │ ├── data/
│ │ │ ├── corpus-en.ts # word lists / sentences
│ │ │ ├── corpus-fr.ts
│ │ │ └── quotes.ts # optional curated quotes
│ │ ├── storage/
│ │ │ ├── db.ts # Dexie schema
│ │ │ ├── sessions.ts # CRUD sessions
│ │ │ └── aggregates.ts # precompute daily/weekly
│ │ └── utils/
│ │ ├── time.ts # ms->s formatting
│ │ ├── clamp.ts
│ │ └── keyboard-layouts.ts # QWERTY/AZERTY mappings
│ ├── hooks/
│ │ ├── useTypingCapture.ts # capture keypress, prevent scroll, etc.
│ │ ├── useCountdown.ts
│ │ ├── usePersistedSettings.ts
│ │ └── useSessionRecorder.ts
│ └── types/
│ ├── test.ts # session, keystroke, letter stats
│ └── training.ts
├── messages/
│ ├── en.json
│ └── fr.json
├── middleware.ts
└── next.config.ts

Key Architecture Decisions
1) Capture “input” sans <textarea> visible

Utilise un champ input caché ou un composant InputCapture focus-auto.

Capture keydown + gestion IME (optionnel) : au minimum, ignore les événements non-character.

2) Modèle de données “keystroke-level” (pour heatmap & training)

Stocke une session avec :

texte cible

timestamp start/end

événements : [{t, expectedChar, typedChar, correct, keyCode, latencyMs}]
Puis tu agrèges :

stats lettre : accuracy, avg latency, error rate

“confusion pairs” : ex e->r fréquent

heatmap touches : erreurs + fréquence + latence

3) Scoring clair (comme les sites connus)

WPM = (charsCorrect / 5) / minutes

Raw WPM = (charsTyped / 5) / minutes

Accuracy = correct / typed

Garde aussi : backspaces, uncorrected errors, consistency (variance WPM par intervalle)

4) Offline-first

IndexedDB via Dexie : sessions + agrégats journaliers

Zéro backend requis ; option export/import JSON plus tard.

5) Heatmap clavier

Mapping layout (AZERTY/QWERTY) : key -> character + positions.

Coloration basée sur error rate OU latency (toggle).

Implementation Phases
Phase 1 — Foundation

Scaffold Next.js + Tailwind + shadcn/ui + TS

Install deps: zustand, next-intl, next-themes, dexie, recharts, uuid, zod (validation)

Setup i18n + theme

AppShell (Header + nav: Test / Stats / Training)

Settings: layout clavier (AZERTY/QWERTY), durée test (15/30/60), langue corpus

Engine baseline: generator.ts (words/sentences), scorer.ts (WPM/accuracy)

Test Arena page skeleton + InputCapture (focus, restart)

Session model types + basic in-memory recording

DoD

Lancer un test 30s, obtenir WPM/accuracy de base, reset fonctionne.

Phase 2 — Typing Test Core (WPM + précision + UX)

TextDisplay: target text + highlighting correct/incorrect + caret

Countdown / timer + progress bar

Gestion erreurs : backspace, skip word, restart

Result screen: WPM, raw WPM, accuracy, chars correct/incorrect, backspaces

Persist sessions (Dexie)

DoD

Une session est sauvegardée et visible dans “Stats -> Sessions”.

Phase 3 — Heatmap clavier + stats par lettre

keystats.ts: agrégation par lettre + par touche (latency, errors, freq)

KeyboardHeatmap:

layout AZERTY/QWERTY

toggle view: “Errors” / “Speed”

LetterTable:

tri par worst accuracy, slowest latency

recherche lettre

Charts trends:

WPM last 7/30 days

accuracy trend

consistency trend (optionnel)

DoD

Heatmap reflète les erreurs réelles ; “p” apparaît en rouge si souvent raté.

Phase 4 — Bonus “Plan d’entraînement” automatique

Training algorithm (training.ts)

Score de faiblesse par lettre:

weakness = (errorRate * w1) + (latencyZscore * w2) + (confusionPenalty * w3)

Sélection top N lettres + paires confondues

Génération de drills:

répétitions ciblées (ex: “p” “o” alternance)

syllabes / bigrammes (“qu”, “tion”, “ment”)

mini-textes contenant forte densité de lettres faibles

Training page:

Plan du jour (10 min / 20 min)

3 drills progressifs

suivi : “mastery” par lettre (progress bar)

DrillRunner:

mêmes métriques que test, feedback instant

recalcul plan après chaque drill

DoD

L’app propose un plan qui change quand tes stats changent.

Phase 5 — Polish (portfolio + “wow”)

Keyboard shortcuts: Enter restart, Esc pause, Tab focus capture

PWA (optionnel): offline caching, install banner

Export/Import JSON des sessions

UX: confetti léger à PR, skeleton loaders

Performance: agrégats pré-calculés (daily) pour éviter recalcul à chaque render

Accessibilité: focus visible, ARIA, contraste heatmap

Verification (Check-list)

npm run dev -> home ok, i18n EN/FR ok, dark mode ok

Start 30s test -> WPM/accuracy corrects (sanity: texte court)

Save session -> visible in stats

Heatmap “Errors” correspond aux lettres ratées

Heatmap “Speed” correspond aux lettres lentes

LetterTable tri correct + recherche

Training plan propose top weak letters et drills cohérents

Après drills, mastery augmente et plan se réajuste

Offline: disable network -> test + stats fonctionnent

Risques techniques (et parades)

Capture clavier : éviter scroll/back nav (Space, Backspace) -> preventDefault ciblé

IME / accents : pour FR, gérer KeyboardEvent.key vs code; ignorer events “Dead”

Biais des corpus : si le texte n’utilise pas certaines lettres, stats incomplètes -> drills générés par densité ciblée

Heatmap layout : AZERTY ≠ QWERTY -> mapping séparé + test visuel

“Portfolio narrative” (pitch)

Typing Arena est un typing test offline-first avec métriques détaillées, heatmap clavier et stats par lettre. Bonus : un plan d’entraînement automatique qui identifie tes faiblesses (erreurs + lenteur + confusions) et génère des drills adaptés.