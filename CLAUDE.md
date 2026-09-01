# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm install          # install dependencies
npx expo start        # start the dev server (also: npm run start)
npm run android        # start with Android target
npm run ios            # start with iOS target
npm run web             # start with web target
npm run lint             # run ESLint (expo lint)
```

There is no test runner configured in this project yet. There is a `reset-project` script (`node ./scripts/reset-project.js`) that moves the starter `app/` code to `app-example/` and creates a blank `app/` — do not run this unless the user explicitly asks to reset the project (the script itself is not present in the repo yet, only referenced in package.json).

## Architecture

This is an Expo Router app (file-based routing, routes live under `app/`, currently just `app/index.tsx`). Key stack pieces:

- **Routing**: `expo-router` (`main` entry in package.json is `expo-router/entry`). `typedRoutes` and `reactCompiler` experiments are enabled in `app.json`.
- **Styling**: NativeWind v4 (Tailwind for React Native). `global.css` holds the Tailwind directives and is imported once from `app/index.tsx`. Tailwind content scanning is configured in `tailwind.config.js` to cover `app/**/*` and `components/**/*.{js,jsx,ts,tsx}`.
- **Class merging**: Use the `cn()` helper from `lib/cn.ts` (clsx + tailwind-merge) when composing conditional/overridable className strings, as done in `components/botao/botao.tsx`.
- **Path alias**: `@/*` maps to the project root (see `tsconfig.json`), e.g. `@/components/botao/botao`, `@/lib/cn`.
- **Component convention**: Components live under `components/<name>/` with two files: `<name>.tsx` (implementation) and `<name>.type.ts` (prop types, exported as `<Name>Props`). See `components/botao/` as the reference pattern. Note the existing codebase mixes Portuguese naming (`botao` = "button") — follow the existing language convention within a given component/file rather than mixing.
- **Babel/Metro**: `babel.config.js` uses `babel-preset-expo` with `jsxImportSource: 'nativewind'` plus `nativewind/babel` and `react-native-worklets/plugin`. `metro.config.js` wraps the default Expo Metro config with `withNativeWind`, pointed at `global.css`. Don't remove these when editing build config.
- **Data/network deps present but not yet wired up**: `@tanstack/react-query` and `axios` are installed dependencies but no query client or API layer exists yet — check current app state before assuming a data-fetching pattern is established.
