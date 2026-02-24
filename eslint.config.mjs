import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Downgrade from error → warn. Existing codebase uses `any` extensively;
      // enforcing as error blocks CI without improving runtime safety.
      "@typescript-eslint/no-explicit-any": "warn",

      // We intentionally use <img> in the admin panel where Next.js <Image>
      // optimization is unnecessary (private dashboard, not public-facing SEO).
      "@next/next/no-img-element": "off",

      // Warn on unused vars, but ignore underscore-prefixed intentional ignores.
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      }],

      // Quotes and apostrophes in JSX text are safe at runtime; React renders
      // them correctly. This rule produces excessive false positives.
      "react/no-unescaped-entities": "off",

      // Allow @ts-ignore alongside @ts-expect-error in existing code.
      "@typescript-eslint/ban-ts-comment": "off",

      // Downgrade from error → warn. Many components legitimately call setState
      // inside useEffect for hydration/initialization (ThemeToggle, RoleContext,
      // AnalyticsProvider). Refactoring these would change app behavior.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
