# Fehler-Check (Stand: 2026-04-23)

Ausgeführt wurden:
- `npm run lint`
- `npm run build`

## Ergebnis

### 1) ESLint/React/TypeScript (`npm run lint`) — **fehlgeschlagen**
- **20 Probleme gesamt**
  - **19 Errors**
  - **1 Warning**

#### Fehler nach Typ
- `@typescript-eslint/no-explicit-any`: **9x**
  - u. a. in `src/App.tsx`, `src/components/ChartSection.tsx`, `src/components/Charts.tsx`, `src/lib/api.ts`
- `react-hooks/set-state-in-effect`: **4x**
  - in `src/App.tsx` (mehrere `loadHistory(..., setState)` Aufrufe in `useEffect`)
- `react-hooks/preserve-manual-memoization`: **3x**
  - in `src/App.tsx` (`useMemo` Abhängigkeitsanalyse)
- `react-hooks/purity`: **1x**
  - in `src/components/Charts.tsx` (`Date.now()` während Render)
- `react-refresh/only-export-components`: **1x**
  - in `src/context/ThemeContext.tsx`
- `no-empty`: **1x**
  - in `src/lib/store.ts`
- `react-hooks/exhaustive-deps`: **1x Warning**
  - in `src/components/BottomSheet.tsx`

### 2) Build (`npm run build`) — **erfolgreich mit Warnungen**
- TypeScript + Vite Build erfolgreich.
- CSS-Minify Warnung:
  - `Unexpected "\b" [css-syntax-error]` (deutet auf ein ungültiges/unsichtbares Zeichen im CSS hin, z. B. vor `body.dark body::before`)
- Bundle-Size Warnung:
  - Ein JS-Chunk liegt über 500 kB (nur Performance-Hinweis, kein Build-Abbruch).

## Kurzfazit
- Das Hauptproblem ist aktuell **Linting/Codequalität-Regeln**, nicht das reine Builden.
- Die meisten harten Fehler kommen von:
  1. `any`-Typen,
  2. Hook-Regeln (`setState` in `useEffect`, Memo-Abhängigkeiten, Purity),
  3. einzelnen Strukturregeln (`ThemeContext`, `no-empty`).
